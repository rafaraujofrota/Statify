export interface BenchmarkResult {
  cpuScore: number;
  gpuScore: number;
  averageFps: number;
  overallScore: number;
  rating: string;
}

export type BenchmarkProgressCallback = (
  progress: number,
  statusText: string,
) => void;

export async function runBenchmark(
  onProgress: BenchmarkProgressCallback,
): Promise<BenchmarkResult> {

  // ETAPA 1: BENCHMARK DE CPU (0% a 50%)

  onProgress(5, "INICIANDO TESTE DE CPU...");
  await new Promise((resolve) => setTimeout(resolve, 80));

  const cpuChunks = 10;
  const iterationsPerChunk = 250_000;
  let totalCpuTime = 0;

  for (let chunk = 0; chunk < cpuChunks; chunk++) {
    const chunkStart = performance.now();

    // Carga de cálculo: operações de ponto flutuante, trigonometria e raízes quadradas
    let acc = 0;
    for (let i = 0; i < iterationsPerChunk; i++) {
      acc += Math.sqrt(i) * Math.sin(i) + Math.cos(i);
    }
    // Evita otimização de eliminação de código morto pelo compilador JIT
    if (acc === 0.123456) console.log(acc);

    const chunkEnd = performance.now();
    totalCpuTime += chunkEnd - chunkStart;

    const progress = Math.round(5 + ((chunk + 1) / cpuChunks) * 45);
    onProgress(progress, `TESTANDO CPU: ETAPA ${chunk + 1}/${cpuChunks}...`);

    // Cede tempo à thread de renderização da UI
    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  // Normalização do score de CPU (uma CPU moderna típica faz ~2500 a 4500 pontos)
  const safeTime = Math.max(totalCpuTime, 15);
  const cpuScore = Math.round(Math.min(6500, Math.max(300, (480_000 / safeTime))));


  // ETAPA 2: BENCHMARK DE GPU (50% a 100%)

  onProgress(52, "INICIALIZANDO TESTE GRÁFICO (GPU)...");
  await new Promise((resolve) => setTimeout(resolve, 80));

  let gpuScore: number;
  let averageFps: number;

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 300;
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

  if (!gl) {
    // Sem WebGL disponível, pontuação padrão básica
    gpuScore = 400;
    averageFps = 30;
    onProgress(100, "CONCLUÍDO (SEM SUPORTE A WEBGL)");
  } else {
    // Criação dos Shaders para teste de carga gráfica
    const vsSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment Shader com cálculos trigonométricos e geração de ruído visual pesado
    const fsSource = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
        float d = length(uv);
        for (float i = 1.0; i < 7.0; i++) {
          uv.x += sin(uv.y * i + uTime) * 0.25;
          uv.y += cos(uv.x * i + uTime) * 0.25;
        }
        float col = sin(length(uv) * 8.0 + uTime) * 0.5 + 0.5;
        gl_FragColor = vec4(col, col * 0.6, 1.0 - col, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl as WebGLRenderingContext, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl as WebGLRenderingContext, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();

    if (program && vs && fs) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      // Quadrado cobrindo a tela (dois triângulos)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1, -1,
          1, -1,
          -1, 1,
          -1, 1,
          1, -1,
          1, 1,
        ]),
        gl.STATIC_DRAW,
      );

      const posAttr = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      const resUniform = gl.getUniformLocation(program, "uResolution");
      const timeUniform = gl.getUniformLocation(program, "uTime");
      gl.uniform2f(resUniform, canvas.width, canvas.height);

      // Renderiza ~90 a 120 quadros e mede o framerate real
      const totalFrames = 100;
      let framesDrawn = 0;
      const gpuStartTime = performance.now();

      await new Promise<void>((resolve) => {
        function renderLoop() {
          const now = performance.now();
          const elapsed = (now - gpuStartTime) / 1000;

          gl?.uniform1f(timeUniform, elapsed);
          gl?.drawArrays(gl.TRIANGLES, 0, 6);

          framesDrawn++;
          const progress = Math.min(
            99,
            Math.round(52 + (framesDrawn / totalFrames) * 46),
          );
          onProgress(progress, `RENDERIZANDO GPU: QUADRO ${framesDrawn}/${totalFrames}...`);

          if (framesDrawn < totalFrames) {
            requestAnimationFrame(renderLoop);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(renderLoop);
      });

      const totalGpuTime = performance.now() - gpuStartTime;
      averageFps = Math.round((framesDrawn / (totalGpuTime / 1000)));
      gpuScore = Math.round(averageFps * 45 + (canvas.getContext("webgl2") ? 350 : 150));

      // Limpeza de recursos WebGL
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    } else {
      gpuScore = 500;
      averageFps = 45;
    }
  }

  // Finalização e cálculo do Score Geral
  const overallScore = Math.round(cpuScore * 0.45 + gpuScore * 0.55);

  let rating = "Básico (Navegação & Estudos)";
  if (overallScore >= 3400) {
    rating = "Excelente (Gamer / Alto Desempenho)";
  } else if (overallScore >= 2400) {
    rating = "Muito Bom (Multitarefa & Jogos Leves)";
  } else if (overallScore >= 1600) {
    rating = "Bom (Uso Geral / Escritório)";
  }

  onProgress(100, "BENCHMARK CONCLUÍDO COM SUCESSO!");

  return {
    cpuScore,
    gpuScore,
    averageFps,
    overallScore,
    rating,
  };
}
