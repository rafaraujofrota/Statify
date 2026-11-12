import type UAParser from "ua-parser-js"

type CodecInfo = {
  supported: boolean | null
  smooth: boolean | null
  powerEfficient: boolean | null
}

export type BrowserCapabilities = {
  codecs: {
    h264: CodecInfo
    vp9: CodecInfo
    av1: CodecInfo
    hevc: CodecInfo
  }
  images: {
    webp: boolean
    avif: boolean
  }
  apis: {
    webCodecs: boolean
    webgl: boolean
    webgl2: boolean
    webgpu: boolean
  }
}

export function getBrowserCompatibility(): number {
  
  // Lista Gerada pelo GPT ( Talvez olhar isso depois )
  const checks = [
    // APIs básicas
    typeof fetch !== "undefined",
    typeof WebSocket !== "undefined",
    typeof Worker !== "undefined",
    typeof WebAssembly !== "undefined",
    typeof indexedDB !== "undefined",
    typeof localStorage !== "undefined",
    typeof sessionStorage !== "undefined",

    // APIs gráficas
    typeof OffscreenCanvas !== "undefined",
    typeof IntersectionObserver !== "undefined",
    typeof ResizeObserver !== "undefined",
    typeof MutationObserver !== "undefined",

    // APIs de hardware
    "gpu" in navigator,
    "bluetooth" in navigator,
    "usb" in navigator,
    "serial" in navigator,
    "hid" in navigator,
    "getBattery" in navigator,

    // APIs multimídia e sistema
    "mediaDevices" in navigator,
    "geolocation" in navigator,
    "clipboard" in navigator,
    "serviceWorker" in navigator,
    typeof Notification !== "undefined",
    typeof speechSynthesis !== "undefined",

    // APIs adicionais
    typeof BroadcastChannel !== "undefined",
    typeof crypto !== "undefined" && "subtle" in crypto,
    typeof CompressionStream !== "undefined",
    typeof DecompressionStream !== "undefined"
  ]

  const supported = checks.filter(check => check == true).length

  return Math.round((supported / checks.length) * 100)
}

export function getUADataUndefinedAmount(systemData: UAParser.IResult): number {
  const values = [
    systemData.os.name,
    systemData.os.version,
    systemData.cpu.architecture,
    systemData.browser.name,
    systemData.browser.version,
    systemData.engine.name,
    systemData.engine.version
  ]

  return values.filter(value => value == undefined).length
}

export async function getMediaCapabilities(): Promise<BrowserCapabilities> {
  const codecs = {
    h264: 'video/mp4; codecs="avc1.42E01E"',
    vp9: 'video/webm; codecs="vp09.00.10.08"',
    av1: 'video/mp4; codecs="av01.0.04M.08"',
    hevc: 'video/mp4; codecs="hvc1.1.6.L93.B0"'
  }

  const result: BrowserCapabilities = {
    codecs: {
      h264: { supported: null, smooth: null, powerEfficient: null },
      vp9: { supported: null, smooth: null, powerEfficient: null },
      av1: { supported: null, smooth: null, powerEfficient: null },
      hevc: { supported: null, smooth: null, powerEfficient: null }
    },
    images: { webp: false, avif: false },
    apis: {
      webCodecs: "VideoDecoder" in window,
      webgl: !!document.createElement("canvas").getContext("webgl"),
      webgl2: !!document.createElement("canvas").getContext("webgl2"),
      webgpu: false
    }
  }

  // Codecs
  if (navigator.mediaCapabilities) {
    await Promise.all(
      Object.entries(codecs).map(async ([key, contentType]) => {
        try {
          const info = await navigator.mediaCapabilities.decodingInfo({
            type: "file",
            video: {
              contentType,
              width: 1920,
              height: 1080,
              bitrate: 5000000,
              framerate: 30
            }
          })

          result.codecs[key as keyof typeof codecs] = {
            supported: info.supported,
            smooth: info.smooth,
            powerEfficient: info.powerEfficient
          }
        } catch {
          // Não faz nada, mantém null
        }
      })
    )
  }

  // Codecs Imagens
  async function testImageFormat(format: string): Promise<boolean> {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1

      const data = canvas.toDataURL(format)

      if (!data.startsWith(`data:${format}`)) return false

      const img = new Image()
      img.src = data
      await img.decode()

      return true
    } catch { return false }
  }

  const [webp, avif] = await Promise.all([
    testImageFormat("image/webp"),
    testImageFormat("image/avif")
  ])

  result.images.webp = webp
  result.images.avif = avif

  // WebGPU
  try {
    if (navigator.gpu) {
      result.apis.webgpu = !!(await navigator.gpu.requestAdapter())
    }
  } catch { result.apis.webgpu = false }

  return result
}
