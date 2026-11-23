import { getBrowserCompatibility, getMediaCapabilities, type BrowserCapabilities } from "./compatibility"
import { getGPUInfo, measureRefreshRate } from "./getInfo"

// Gravidade de cada recomendação (define a cor e a ordem na lista)
export type Severity = "critical" | "warning" | "tip"

// Tudo que a página precisa saber sobre o dispositivo, coletado de uma vez só
export interface SystemSnapshot {
  cores: number
  ram?: number            // GB. navigator.deviceMemory só existe em navegadores Chromium
  refreshRate?: number    // Hz
  screenWidth: number     // pixels físicos (já multiplicado pela escala)
  screenHeight: number
  battery?: BatteryInfo
  online: boolean
  compatibility: number   // 0 a 100
  gpu: string
  capabilities: BrowserCapabilities
}

export interface Comparison {
  id: string
  label: string
  detected: string
  recommended: string
  percentage: number | null   // 0 a 100. null = não foi possível medir
  ok: boolean | null          // null = não foi possível medir
}

export interface Recommendation {
  id: string
  severity: Severity
  title: string
  description: string
}

// Valores de referência da comparação. Ajuste aqui para mudar o que é "recomendado".
const REFERENCE = {
  cores: 4,
  ramGB: 8,            // o Chrome limita navigator.deviceMemory a 8
  refreshRate: 60,
  screenWidth: 1920,
  compatibility: 65,   // mesmo limite usado na página Sistema
}

// A partir de quantos % do valor recomendado o item conta como "ok".
// Tem folga porque a taxa de atualização medida oscila (59 Hz em vez de 60, por exemplo).
const OK_FROM_PERCENTAGE = 95

// Limites que transformam um valor medido em recomendação
const LOW_REFRESH_RATE = 55
const LOW_RAM_GB = 4
const LOW_BATTERY_LEVEL = 0.2

// Renderizadores que indicam que o navegador está desenhando com a CPU, sem a placa de vídeo
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|basic render/i

// ---------------------------------------------------------------------------
// Coleta de dados
// ---------------------------------------------------------------------------

async function readBattery(): Promise<BatteryInfo | undefined> {
  if (!navigator.getBattery) return undefined

  try {
    const b: BatteryInfo = await navigator.getBattery()
    return {
      charging: b.charging,
      chargingTime: b.chargingTime,
      dischargingTime: b.dischargingTime,
      level: b.level
    }
  } catch {
    return undefined
  }
}

// Se a aba estiver em segundo plano o requestAnimationFrame não dispara e a medição nunca termina.
// Com o timeout a página carrega mesmo assim e mostra a taxa como "Indisponível".
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([
    promise,
    new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), ms))
  ])
}

export async function collectSnapshot(): Promise<SystemSnapshot> {
  const [capabilities, refreshRate, battery] = await Promise.all([
    getMediaCapabilities(),
    withTimeout(measureRefreshRate(), 3000),
    readBattery()
  ])

  return {
    cores: navigator.hardwareConcurrency,
    ram: navigator.deviceMemory,
    refreshRate,
    screenWidth: Math.round(screen.width * window.devicePixelRatio),
    screenHeight: Math.round(screen.height * window.devicePixelRatio),
    battery,
    online: navigator.onLine,
    compatibility: getBrowserCompatibility(),
    gpu: getGPUInfo().gpu,
    capabilities
  }
}

// ---------------------------------------------------------------------------
// Comparações
// ---------------------------------------------------------------------------

function compare(
  id: string,
  label: string,
  value: number | undefined,
  recommended: number,
  format: (n: number) => string,
  detectedText?: string
): Comparison {
  const measured = value !== undefined && Number.isFinite(value)
  const percentage = measured ? Math.min(100, Math.round((value / recommended) * 100)) : null

  return {
    id,
    label,
    detected: measured ? (detectedText ?? format(value)) : "Indisponível",
    recommended: format(recommended),
    percentage,
    ok: percentage === null ? null : percentage >= OK_FROM_PERCENTAGE
  }
}

export function buildComparisons(s: SystemSnapshot): Comparison[] {
  return [
    compare("cores", "Núcleos do processador", s.cores, REFERENCE.cores, (n) => `${n}`),
    compare("ram", "Memória RAM", s.ram, REFERENCE.ramGB, (n) => `${n} GB`),
    compare("refreshRate", "Taxa de atualização", s.refreshRate, REFERENCE.refreshRate, (n) => `${n} Hz`),
    compare(
      "resolution", "Resolução da tela", s.screenWidth, REFERENCE.screenWidth,
      () => `${REFERENCE.screenWidth} x 1080`, `${s.screenWidth} x ${s.screenHeight}`
    ),
    compare("compatibility", "Compatibilidade com APIs web", s.compatibility, REFERENCE.compatibility, (n) => `${n}%`)
  ]
}

// Porcentagem de comparações que atingiram o recomendado (ignora as que não puderam ser medidas)
export function calcScore(comparisons: Comparison[]): number {
  const measured = comparisons.filter((c) => c.ok !== null)
  if (measured.length === 0) return 100

  return Math.round((measured.filter((c) => c.ok).length / measured.length) * 100)
}

// ---------------------------------------------------------------------------
// Recomendações
// ---------------------------------------------------------------------------

const SEVERITY_ORDER: Record<Severity, number> = { critical: 0, warning: 1, tip: 2 }

export function buildRecommendations(s: SystemSnapshot): Recommendation[] {
  const list: Recommendation[] = []
  const { apis, codecs } = s.capabilities

  function add(id: string, severity: Severity, title: string, description: string) {
    list.push({ id, severity, title, description })
  }

  // Críticas
  if (!s.online) {
    add("offline", "critical", "Sem conexão com a internet",
      "Verifique o Wi-Fi ou o cabo de rede. Sem conexão, sites e serviços online deixam de funcionar.")
  }

  if (s.battery && !s.battery.charging && s.battery.level <= LOW_BATTERY_LEVEL) {
    add("battery", "critical", `Bateria em ${Math.round(s.battery.level * 100)}%`,
      "Conecte o carregador para evitar que o computador desligue durante o uso.")
  }

  // Gráficos
  if (!apis.webgl) {
    add("webgl", "warning", "WebGL indisponível",
      "Gráficos 3D, mapas e alguns jogos não vão funcionar. Ative a aceleração de hardware nas configurações do navegador e atualize os drivers de vídeo.")
  } else if (SOFTWARE_RENDERER.test(s.gpu)) {
    add("software-rendering", "warning", "Gráficos renderizados pela CPU",
      `O navegador parece não estar usando a placa de vídeo (${s.gpu}). Ative a aceleração de hardware nas configurações do navegador e atualize os drivers de vídeo.`)
  } else if (!apis.webgl2) {
    add("webgl2", "warning", "WebGL 2 indisponível",
      "Sites e jogos modernos podem exigir WebGL 2. Atualize o navegador e os drivers de vídeo.")
  }

  // Navegador
  if (s.compatibility < REFERENCE.compatibility) {
    add("compatibility", "warning", "Compatibilidade baixa com APIs web",
      `Seu navegador atende só ${s.compatibility}% das APIs verificadas. Atualize para a versão mais recente. Alguns recursos, como Bluetooth e USB, só existem em navegadores baseados em Chromium.`)
  }

  // Vídeo
  if (codecs.h264.supported === false) {
    add("h264", "warning", "Codec H.264 não suportado",
      "Muitos vídeos usam H.264. Atualize o navegador ou os drivers de vídeo para reproduzi-los sem falhas.")
  }

  if (codecs.av1.supported === false) {
    add("av1", "tip", "Sem suporte a AV1",
      "Serviços de vídeo usam AV1 quando disponível. Sem ele, recorrem a outros formatos, que podem gastar mais CPU e bateria.")
  }

  if (!apis.webgpu) {
    add("webgpu", "tip", "WebGPU indisponível",
      "É um recurso novo para gráficos e processamento no navegador. Atualizar o navegador e os drivers pode habilitá-lo, mas não é essencial.")
  }

  // Desempenho
  if (s.ram !== undefined && s.ram < LOW_RAM_GB) {
    add("ram", "warning", `Pouca memória RAM (${s.ram} GB)`,
      "Feche abas e programas que não estiver usando e desative extensões desnecessárias. O valor é aproximado.")
  }

  if (s.cores < REFERENCE.cores) {
    add("cores", "warning", `Poucos núcleos de processador (${s.cores})`,
      "Evite abrir muitas abas ou programas pesados ao mesmo tempo.")
  }

  if (s.refreshRate !== undefined && s.refreshRate < LOW_REFRESH_RATE) {
    add("refreshRate", "warning", `Taxa de atualização baixa (${s.refreshRate} Hz)`,
      "A tela parece atualizar abaixo de 60 Hz. Isso pode vir do modo de economia de energia, de uma aba em segundo plano ou do próprio monitor. Confira as configurações de vídeo do sistema.")
  }

  if (s.screenWidth < REFERENCE.screenWidth) {
    add("resolution", "tip", "Resolução abaixo de Full HD",
      `A tela está em ${s.screenWidth} x ${s.screenHeight}. Se o monitor suportar, aumentar a resolução nas configurações de vídeo do sistema mostra mais conteúdo ao mesmo tempo.`)
  }

  return list.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}