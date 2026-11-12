import type UAParser from "ua-parser-js"

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