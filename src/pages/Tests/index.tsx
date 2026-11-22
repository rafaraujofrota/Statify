import { useState } from "react";
import TitleBar from "../../components/TitleBar";
import InfoCard from "../../components/InfoCard";
import InfoTag from "../../components/InfoTag";
import ProgressBar from "../../components/ProgressBar";

import {
  PageContainer,
  TestCardContent,
  ControlHeader,
  ActionButton,
  MetricsGrid,
  MetricCard,
  RatingBanner,
} from "./styles";

import {
  runBenchmark,
  type BenchmarkResult,
} from "../../utils/benchmark";

import {
  runNetworkTest,
  type NetworkTestResult,
} from "../../utils/networkTest";

import {
  LuPlay,
  LuRotateCw,
  LuWifi,
  LuArrowDown,
  LuActivity,
  LuZap,
  LuGauge,
} from "react-icons/lu";
import { BsCpu, BsGpuCard, BsSpeedometer2 } from "react-icons/bs";

export function Tests() {
  // Estados para o Benchmark de GPU & CPU
  const [benchRunning, setBenchRunning] = useState(false);
  const [benchProgress, setBenchProgress] = useState(0);
  const [benchStatusText, setBenchStatusText] = useState("PRONTO PRA INICIAR");
  const [benchResult, setBenchResult] = useState<BenchmarkResult | null>(null);

  // Estados para o Teste de Rede e Conexão
  const [netRunning, setNetRunning] = useState(false);
  const [netProgress, setNetProgress] = useState(0);
  const [netStatusText, setNetStatusText] = useState("PRONTO PRA INICIAR");
  const [netResult, setNetResult] = useState<NetworkTestResult | null>(null);

  // Diagnóstico / Integridade Geral calculado dinamicamente
  let diagnosisScore = 60;
  if (benchResult) diagnosisScore += 20;
  if (netResult) diagnosisScore += 20;

  async function handleStartBenchmark() {
    if (benchRunning) return;
    setBenchRunning(true);
    setBenchProgress(0);

    try {
      const result = await runBenchmark((progress, status) => {
        setBenchProgress(progress);
        setBenchStatusText(status);
      });
      setBenchResult(result);
    } catch (err) {
      console.error(err);
      setBenchStatusText("ERRO AO EXECUTAR BENCHMARK");
    } finally {
      setBenchRunning(false);
    }
  }

  async function handleStartNetworkTest() {
    if (netRunning) return;
    setNetRunning(true);
    setNetProgress(0);

    try {
      const result = await runNetworkTest((progress, status) => {
        setNetProgress(progress);
        setNetStatusText(status);
      });
      setNetResult(result);
    } catch (err) {
      console.error(err);
      setNetStatusText("ERRO AO TESTAR CONEXÃO");
    } finally {
      setNetRunning(false);
    }
  }

  return (
    <PageContainer>
      <TitleBar
        diagnosis={diagnosisScore}
        subtitle="Laboratório"
        title="Resultados e testes"
      />

      {/* CARD 1: BENCHMARK GPU & CPU */}
      <InfoCard
        Icon={BsSpeedometer2}
        title="Benchmark GPU & CPU"
        InfoTag={
          <InfoTag
            color={
              benchResult
                ? "var(--activeGreen)"
                : benchRunning
                ? "var(--infoBlue)"
                : "var(--warningYellow)"
            }
            text={
              benchResult
                ? "Concluído"
                : benchRunning
                ? "Em Execução"
                : "Aguardando"
            }
          />
        }
      >
        <TestCardContent>
          <ControlHeader>
            <div className="statusText">
              <span>Status do Diagnóstico</span>
              <h4>{benchStatusText}</h4>
            </div>

            <div className="actionArea">
              <span className="percentage">{benchProgress}%</span>
              <ActionButton
                onClick={handleStartBenchmark}
                disabled={benchRunning}
              >
                {benchRunning ? (
                  <>
                    <LuRotateCw size={16} className="spinner" />
                    <span>Testando Hardware...</span>
                  </>
                ) : (
                  <>
                    <LuPlay size={16} />
                    <span>Iniciar teste de desempenho</span>
                  </>
                )}
              </ActionButton>
            </div>
          </ControlHeader>

          <ProgressBar
            percentage={benchProgress}
            color={benchResult ? "var(--activeGreen)" : "var(--accentColor)"}
            percentageStyle={{ isBig: false }}
          />

          {benchResult && (
            <>
              <MetricsGrid>
                <MetricCard $highlight>
                  <div className="label">
                    <LuZap size={14} /> Score Geral
                  </div>
                  <div className="valueWrapper">
                    <span className="value">{benchResult.overallScore}</span>
                    <span className="unit">pts</span>
                  </div>
                  <div className="description">Desempenho consolidado</div>
                </MetricCard>

                <MetricCard>
                  <div className="label">
                    <BsCpu size={14} /> Score CPU
                  </div>
                  <div className="valueWrapper">
                    <span className="value">{benchResult.cpuScore}</span>
                    <span className="unit">pts</span>
                  </div>
                  <div className="description">Cálculo de precisão</div>
                </MetricCard>

                <MetricCard>
                  <div className="label">
                    <BsGpuCard size={14} /> Score GPU
                  </div>
                  <div className="valueWrapper">
                    <span className="value">{benchResult.gpuScore}</span>
                    <span className="unit">pts</span>
                  </div>
                  <div className="description">Taxa e renderização WebGL</div>
                </MetricCard>

                <MetricCard>
                  <div className="label">
                    <LuGauge size={14} /> Taxa de Quadros
                  </div>
                  <div className="valueWrapper">
                    <span className="value">{benchResult.averageFps}</span>
                    <span className="unit">FPS</span>
                  </div>
                  <div className="description">Estabilidade gráfica média</div>
                </MetricCard>
              </MetricsGrid>

              <RatingBanner>
                <span className="ratingTitle">Classificação do Hardware:</span>
                <span className="ratingValue">{benchResult.rating}</span>
              </RatingBanner>
            </>
          )}
        </TestCardContent>
      </InfoCard>

      {/* CARD 2: TESTE DE INTERNET E CONEXÃO */}
      <InfoCard
        Icon={LuWifi}
        title="Teste de Conexão e Internet"
        InfoTag={
          <InfoTag
            color={
              netResult
                ? "var(--activeGreen)"
                : netRunning
                ? "var(--infoBlue)"
                : "var(--warningYellow)"
            }
            text={
              netResult
                ? "Concluído"
                : netRunning
                ? "Medindo Rede"
                : "Aguardando"
            }
          />
        }
      >
        <TestCardContent>
          <ControlHeader>
            <div className="statusText">
              <span>Status da Conexão</span>
              <h4>{netStatusText}</h4>
            </div>

            <div className="actionArea">
              <span className="percentage">{netProgress}%</span>
              <ActionButton
                onClick={handleStartNetworkTest}
                disabled={netRunning}
              >
                {netRunning ? (
                  <>
                    <LuRotateCw size={16} className="spinner" />
                    <span>Medindo Conexão...</span>
                  </>
                ) : (
                  <>
                    <LuPlay size={16} />
                    <span>Iniciar teste de internet</span>
                  </>
                )}
              </ActionButton>
            </div>
          </ControlHeader>

          <ProgressBar
            percentage={netProgress}
            color={netResult ? "var(--activeGreen)" : "var(--infoBlue)"}
            percentageStyle={{ isBig: false }}
          />

          {netResult && (
            <>
              <MetricsGrid>
                <MetricCard $highlight>
                  <div className="label">
                    <LuArrowDown size={14} /> Download
                  </div>
                  <div className="valueWrapper">
                    <span className="value">{netResult.downloadSpeed}</span>
                    <span className="unit">Mbps</span>
                  </div>
                  <div className="description">Taxa real transferida</div>
                </MetricCard>

                <MetricCard>
                  <div className="label">
                    <LuActivity size={14} /> Latência (Ping)
                  </div>
                  <div className="valueWrapper">
                    <span className="value">{netResult.ping}</span>
                    <span className="unit">ms</span>
                  </div>
                  <div className="description">Tempo de resposta (RTT)</div>
                </MetricCard>

                <MetricCard>
                  <div className="label">
                    <LuActivity size={14} /> Jitter
                  </div>
                  <div className="valueWrapper">
                    <span className="value">{netResult.jitter}</span>
                    <span className="unit">ms</span>
                  </div>
                  <div className="description">Variação de latência</div>
                </MetricCard>

                <MetricCard>
                  <div className="label">
                    <LuWifi size={14} /> Interface
                  </div>
                  <div className="valueWrapper">
                    <span className="value" style={{ fontSize: "18px" }}>
                      {netResult.connectionType}
                    </span>
                  </div>
                  <div className="description">Tipo de rede detectada</div>
                </MetricCard>
              </MetricsGrid>

              <RatingBanner>
                <span className="ratingTitle">Classificação da Rede:</span>
                <span className="ratingValue">{netResult.rating}</span>
              </RatingBanner>
            </>
          )}
        </TestCardContent>
      </InfoCard>
    </PageContainer>
  );
}
