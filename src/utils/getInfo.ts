interface GPUInfo {
  gpu: string;
  api: string;
}

export function getGPUInfo(): GPUInfo {
  const gl = document.createElement("canvas").getContext("webgl")
	if(!gl) return { api: "Desconhecido", gpu: "Erro: Sem suporte a WebGL" }

  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  if (!ext) return { api: "Desconhecido", gpu: "Desconhecido" }

  const raw = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
  if (!raw) return { api: "Desconhecido", gpu: "Desconhecido" }

  ///////
  let api = null
  const apiMatch = raw.match(/Direct3D\s?(\d+)|D3D(\d+)|Vulkan|Metal|OpenGL(?:\s?ES)?/i)
  if (apiMatch) {
    const d3dVersion = apiMatch[1] || apiMatch[2]
    if (d3dVersion) api = `Direct3D ${d3dVersion}`
    else {
      const name = apiMatch[0].toLowerCase();
      api = name.includes("vulkan") ? "Vulkan"
          : name.includes("metal") ? "Metal"
          : name.includes("es") ? "OpenGL ES" : "OpenGL";
    }
  }

  //////
  let gpu = raw
  const angle = raw.match(/^ANGLE \((.+)\)$/i)
  if (angle) {
    const parts = angle[1].split(",").map((s: string) => s.trim())
    gpu = parts[1] || parts[0];
  }

  gpu = gpu
    .replace(/^ANGLE Metal Renderer:\s*/i, "")
    .replace(/^Mesa\s+/i, "")
    .replace(/\/PCIe\/SSE2$/i, "")
    .replace(/\s*(Direct3D\d*|OpenGL|Vulkan|Metal)\b.*$/i, "")
    .replace(/\s*vs_\d+_\d+.*$/i, "")
    .replace(/\s*\(0x[0-9a-f]+\)/i, "")
    .replace(/,?\s*or similar$/i, "")
    .replace(/\s+/g, " ")
    .trim()

  return { api: api ?? "Desconhecido", gpu };
}

export function measureRefreshRate(samples: number = 60): Promise<number> {
  return new Promise<number>((resolve) => {
    const deltas: number[] = [];
    let last: number | undefined;

    function tick(now: number) {
      if (last) deltas.push(now - last);
      last = now;

      if (deltas.length < samples) {
        requestAnimationFrame(tick);
      } else {
        deltas.sort((a, b) => a - b);
        const median = deltas[Math.floor(deltas.length / 2)];
        resolve(Math.round(1000 / median));
      }
    }

    requestAnimationFrame(tick);
  });
}