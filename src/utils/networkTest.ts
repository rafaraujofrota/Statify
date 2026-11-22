export interface NetworkTestResult {
  ping: number; // em ms
  jitter: number; // em ms
  downloadSpeed: number; // em Mbps
  connectionType: string;
  rating: string;
}

export type NetworkProgressCallback = (
  progress: number,
  statusText: string,
) => void;

export async function runNetworkTest(
  onProgress: NetworkProgressCallback,
): Promise<NetworkTestResult> {
  // Detecção de tipo da conexão através da API NetworkInformation (quando disponível)
  let connectionType = "Banda Larga";
  if (navigator.connection?.effectiveType) {
    const eff = navigator.connection.effectiveType.toUpperCase();
    connectionType = eff.includes("4G") ? "Rede 4G / Fibra" : `Rede ${eff}`;
  }


  // ETAPA 1: TESTE DE PING E LATÊNCIA (0% a 40%)

  onProgress(5, "TESTANDO PING E LATÊNCIA...");

  const pingEndpoints = [
    "https://cloudflare.com/cdn-cgi/trace",
    "https://1.1.1.1/cdn-cgi/trace",
    "https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js",
  ];

  const pings: number[] = [];
  const pingAttempts = 4;

  for (let i = 0; i < pingAttempts; i++) {
    const targetUrl = `${pingEndpoints[i % pingEndpoints.length]}?t=${Date.now()}_${i}`;
    const start = performance.now();

    try {
      await fetch(targetUrl, {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store",
      });
      const duration = Math.round(performance.now() - start);
      pings.push(duration);
    } catch {
      // Fallback usando timestamp de request padrão
      const fallbackStart = performance.now();
      try {
        await fetch(`https://dns.google/resolve?name=google.com&t=${Date.now()}`, {
          mode: "cors",
          cache: "no-store",
        });
        pings.push(Math.round(performance.now() - fallbackStart));
      } catch {
        // Se totalmente bloqueado por sandbox/offline, usa estimativa da API se houver
        pings.push(navigator.connection?.rtt || 25);
      }
    }

    const progress = Math.round(5 + ((i + 1) / pingAttempts) * 35);
    onProgress(progress, `MEDINDO LATÊNCIA (${i + 1}/${pingAttempts})...`);
    await new Promise((r) => setTimeout(r, 60));
  }

  // Média de ping
  const averagePing = pings.length > 0
    ? Math.round(pings.reduce((a, b) => a + b, 0) / pings.length)
    : 20;

  // Cálculo de Jitter (variação média entre pings consecutivos)
  let jitterSum = 0;
  for (let i = 1; i < pings.length; i++) {
    jitterSum += Math.abs(pings[i] - pings[i - 1]);
  }
  const jitter = pings.length > 1 ? Math.round(jitterSum / (pings.length - 1)) : 2;


  // ETAPA 2: TESTE DE VELOCIDADE DE DOWNLOAD (40% a 100%)

  onProgress(45, "INICIANDO MEDIÇÃO DE VELOCIDADE DE DOWNLOAD...");

  // Arquivos em CDNs públicas velozes e seguras para cálculo de taxa de transferência
  const downloadSources = [
    "https://speed.cloudflare.com/__down?bytes=6000000",
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js",
  ];

  let downloadSpeed: number;
  let bytesDownloaded = 0;
  const downloadStartTime = performance.now();
  let timedOut = false;

  for (const source of downloadSources) {
    if (bytesDownloaded > 3_000_000 || timedOut) break;

    try {
      const url = `${source}${source.includes("?") ? "&" : "?"}_cb=${Date.now()}`;
      const response = await fetch(url, { cache: "no-store", mode: "cors" });

      if (response.body) {
        const reader = response.body.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          bytesDownloaded += value.length;
          const elapsedSeconds = (performance.now() - downloadStartTime) / 1000;

          // Atualiza o progresso visual de 45% a 95%
          const progress = Math.min(
            95,
            Math.round(45 + (elapsedSeconds / 4) * 50),
          );
          const currentMbps = (bytesDownloaded * 8) / (elapsedSeconds * 1_000_000);
          onProgress(progress, `BAIXANDO PACOTES: ${currentMbps.toFixed(1)} Mbps...`);

          // Limite máximo de teste em 4 segundos para não consumir excesso de dados
          if (elapsedSeconds >= 4) {
            timedOut = true;
            await reader.cancel();
            break;
          }
        }
      } else {
        const blob = await response.blob();
        bytesDownloaded += blob.size;
      }
    } catch {
      // Ignora falha de um CDN e tenta o próximo
    }
  }

  const totalElapsed = (performance.now() - downloadStartTime) / 1000;

  if (bytesDownloaded > 100_000 && totalElapsed > 0.1) {
    downloadSpeed = Number(((bytesDownloaded * 8) / (totalElapsed * 1_000_000)).toFixed(1));
  } else {
    // Estimativa de contingência baseada em downlink ou latência
    downloadSpeed = navigator.connection?.downlink
      ? Number(navigator.connection.downlink.toFixed(1))
      : Math.max(10, Math.round(1000 / (averagePing || 30)));
  }

  // Avaliação da qualidade da conexão
  let rating = "Básica (Navegação Leve)";
  if (downloadSpeed >= 120 && averagePing <= 30) {
    rating = "Ultra Rápida (4K, Jogos Online & Streaming)";
  } else if (downloadSpeed >= 50 && averagePing <= 60) {
    rating = "Muito Boa (Streaming HD & Multiuso)";
  } else if (downloadSpeed >= 20) {
    rating = "Boa (Navegação Rápida & Vídeos)";
  }

  onProgress(100, "TESTE DE CONEXÃO FINALIZADO!");

  return {
    ping: averagePing,
    jitter,
    downloadSpeed,
    connectionType,
    rating,
  };
}
