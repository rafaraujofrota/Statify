import { useEffect , useState } from "react";
import type {IconType} from "react-icons"
import {FaRegLightbulb} from "react-icons/fa";
import {
	FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaRotateRight, FaScaleBalanced, FaTriangleExclamation

} from "react-icons/fa6";

import InfoCard from "../../components/InfoCard";
import TitleBar from "../../components/TitleBar";
import ProgressBar from "../../components/ProgressBar";
import InfoTag from "../../components/InfoTag";

import { ComparisonList, PageContainer, RecommendationItem, RecommendationList } from "./styles";
import {
	buildComparisons, buildRecommendations, calcScore, collectSnapshot,
	type Severity, type SystemSnapshot
} from "../../utils/recommendations.ts";

const SEVERITY: Record<Severity, { label: string; color: string; Icon: IconType }> = {
	critical: { label: "CRÍTICO", color: "#E5484D", Icon: FaCircleExclamation },
	warning: { label: "ATENÇÃO", color: "var(--warningYellow)", Icon: FaTriangleExclamation },
	tip: { label: "DICA", color: "var(--infoBlue)", Icon: FaCircleInfo }
}

export function Recommendations() {
	const [snapshot, setSnapshot] = useState<SystemSnapshot>()
	const [analysis, setAnalysis] = useState(0)

	useEffect(() => {
		let cancelled = false

		collectSnapshot().then((data) => {
			if (!cancelled) setSnapshot(data)
		})

		return () => { cancelled = true }
	}, [analysis])

	function analyzeAgain() {
		setSnapshot(undefined)
		setAnalysis((n) => n + 1)
	}

	if (!snapshot) return (
		<PageContainer style={{ height: "100%" }}>
			<div className="loadingContainer"><img src="/loading.gif"/></div>
		</PageContainer>
	)

	const comparisons = buildComparisons(snapshot)
	const recommendations = buildRecommendations(snapshot)

	const measured = comparisons.filter((c) => c.ok !== null)
	const passed = measured.filter((c) => c.ok).length
	const allPassed = passed === measured.length



	return (
		<PageContainer>
			<TitleBar
				diagnosis={calcScore(comparisons)}
				subtitle="PRÓXIMAS AÇÕES" title="Comparações e Recomendações"
			/>
			<div className="infoCardContainer">
				<InfoCard
					Icon={FaScaleBalanced} title="Comparação com o Recomendado"
					InfoTag={
						<InfoTag
							color={allPassed ? "var(--activeGreen)" : "var(--warningYellow)"}
							text={`${passed} DE ${measured.length} OK`}
						/>
					}
				>
					<ComparisonList>
						{comparisons.map((c) => (
							<li key={c.id}>
								<ProgressBar
									title={c.label}
									percentage={c.percentage ?? 0}
									color={
										c.ok === null ? "var(--accentColor)" :
										c.ok ? "var(--activeGreen)" : "var(--warningYellow)"
									}
									percentageStyle={{
										isBig: false, text: c.detected,
										Icon: c.ok === null ? undefined : (c.ok ? FaCircleCheck : FaTriangleExclamation)
									}}
								/>
								<p className="recommended">Recomendado: {c.recommended}</p>
							</li>
						))}
					</ComparisonList>
				</InfoCard>

				<InfoCard
					Icon={FaRegLightbulb} title="Recomendações"
					InfoTag={
						recommendations.length === 0 ? (
							<InfoTag color="var(--activeGreen)" Icon={FaCircleCheck} text="TUDO CERTO" />
						) : (
							<InfoTag
								color="var(--warningYellow)"
								text={recommendations.length === 1 ? "1 AÇÃO" : `${recommendations.length} AÇÕES`}
							/>
						)
					}
				>
					{recommendations.length === 0 ? (
						<p className="allGood">
							Nenhum problema encontrado. Seu dispositivo atende a tudo que foi verificado.
						</p>
					) : (
						<RecommendationList>
							{recommendations.map((r) => {
								const { label, color, Icon } = SEVERITY[r.severity]

								return (
									<RecommendationItem key={r.id} $color={color}>
										<span className="icon"><Icon size={20}/></span>
										<div className="content">
											<div className="header">
												<h4>{r.title}</h4>
												<InfoTag color={color} text={label} />
											</div>
											<p>{r.description}</p>
										</div>
									</RecommendationItem>
								)
							})}
						</RecommendationList>
					)}
				</InfoCard>
			</div>

			<div className="actionsContainer">
				<button className="refreshButton" onClick={analyzeAgain}>
					<FaRotateRight /> Analisar Novamente
				</button>
			</div>
		</PageContainer>
	)
}