import { UAParser } from "ua-parser-js";
import { useState, useEffect } from "react";

import { FaComputer, FaGlobe, FaClock, FaCompactDisc } from "react-icons/fa6";
import InfoCard from "../../components/InfoCard";
import TitleBar from "../../components/TitleBar";
import ProgressBar from "../../components/ProgressBar";
import InfoTag from "../../components/InfoTag";

import { BrowserContainer, DriversContainer, LocationContainer, PageContainer, SystemContainer } from "./styles";
import { getBrowserIcon, getOSIcon } from "../../utils/getIcons";
import { getBrowserCompatibility, getUADataUndefinedAmount } from "../../utils/compatibility";
import { type BrowserCapabilities, getMediaCapabilities } from "../../utils/compatibility"

function getRegionalSettings() {
    const locale = navigator.language

    const time = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions()

    const utc = new Intl.DateTimeFormat("en", { timeZoneName: "longOffset"})
		.formatToParts(new Date())
    .find(part => part.type === "timeZoneName")?.value
    .replace("GMT", "UTC")

		const hour = time.hourCycle
		const languageViewer = new Intl.DisplayNames(["pt-BR"], { type: "language" })

    return {
      language: locale,
			languageString: languageViewer.of(locale) ?? "Desconhecido",
      timeFormat: hour ? (hour.startsWith("h1") ? "12h" : "24h") : "Desconhecido",
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      utc: utc ?? "Desconhecido",
      encoding: document.characterSet
    }
}

function returnSupportedTag(supported: boolean | null) {
	if(supported == null) return <InfoTag color="var(--warningYellow)" text="Desconhecido"/>

	if(supported) return <InfoTag color="var(--activeGreen)" text="Suportado"/>
	else return <InfoTag color="var(--warningYellow)" text="Não Suportado"/>
}

export function System() {
	const systemData = UAParser()
	const compatibility = getBrowserCompatibility()
	const regionalData = getRegionalSettings()
	let undefinedAmount = getUADataUndefinedAmount(systemData)
	undefinedAmount += Object.values(regionalData).filter(value => value == "Desconhecido").length
	const diagnosisPercentage = Math.floor((9 - undefinedAmount) / 9 * 100) 

	const [capabilities, setCapabilities] = useState<BrowserCapabilities>()

	useEffect(() => {
		getMediaCapabilities().then(setCapabilities)
  }, [])

	if(!capabilities) return (
		<PageContainer style={{ height: "100%" }}>
			<div className="loadingContainer"><img src="/loading.gif"/></div>
		</PageContainer>
	)
	
	return (
		<PageContainer>
			<TitleBar 
				diagnosis={diagnosisPercentage} 
				subtitle="INFORMAÇÕES COLETADAS" 
				title="Informações do Sistema"
			/>
			<div className="infoCardContainer">
				<InfoCard Icon={FaComputer} title="Sistema Operacional">
					<SystemContainer>
						<span>{getOSIcon(systemData.os.name)}</span>
						<div className="infoContainer">
							<h1>{systemData.os.name ?? "Desconhecido"}</h1>
							<hr />
							<div style={{display: "flex", gap: "1rem"}}>
								<div className="info">
									<h5>VERSÃO</h5>
									<p>{systemData.os.version ?? "Desconhecido"}</p>	
								</div>
								<div className="info">
									<h5>ARQUITETURA</h5>
									<p>{systemData.cpu.architecture ?? "Desconhecido"}</p>	
								</div>
							</div>
						</div>
					</SystemContainer>
				</InfoCard>
				<InfoCard Icon={FaGlobe} title="Navegador">
					<BrowserContainer>
						<div className="browserInfo">
							<span>{getBrowserIcon(systemData.browser.name)}</span>
							<div className="browserInfoContainer">
								<h2>{systemData.browser.name ?? "Desconhecido"}</h2>
								<p>
									Versão: {systemData.browser.version ?? "Desconhecido"} {" // "}
									Engine: {systemData.engine.name ?? "Desconhecido"} {" "}
									V { systemData.engine.version ?? "??"}
								</p>
							</div>
						</div>
						<ProgressBar 
							percentage={compatibility} 
							title="COMPATIBILIDADE COM APIs WEB"
							color={compatibility > 65 ? "var(--activeGreen)" : "var(--warningYellow)"} 
							percentageStyle={{isBig: true, text: `${compatibility}%`}}
						/>
					</BrowserContainer>
				</InfoCard>
			</div>
			<div className="infoCardContainer" style={{whiteSpace: "nowrap"}}>
				<InfoCard style={{ width: "fit-content" }} title="Localização e Sessão" Icon={FaClock}>
					<LocationContainer>
						<div className="infoContainer">
							<span>
								<h5>IDIOMA</h5>
								<p>{regionalData.language}</p>
								<h6>{regionalData.languageString}</h6>
							</span>
							<span>
								<h5>FUSO HORÁRIO</h5>
								<p>{regionalData.utc}</p>
								<h6>{regionalData.timeZone}</h6>
							</span>
						</div>
						<div className="infoContainer">
							<span>
								<h5>CODIFICAÇÃO</h5>
								<p>{regionalData.encoding}</p>
							</span>
							<span>
								<h5>FORMATO</h5>
								<p>{regionalData.timeFormat}</p>
							</span>
						</div>
					</LocationContainer>
				</InfoCard>
				<InfoCard title="Codecs e APIs" Icon={FaCompactDisc}>
					<DriversContainer>
						<span>
							<h5>Codec AV1</h5>
							{returnSupportedTag(capabilities.codecs.av1.supported)}
						</span>
						<span>
							<h5>Codec H264</h5>
							{returnSupportedTag(capabilities.codecs.h264.supported)}
						</span>
						<span>
							<h5>Codec AVIF</h5>
							{returnSupportedTag(capabilities.images.avif)}
						</span>
						<span>
							<h5>Codec HEVC</h5>
							{returnSupportedTag(capabilities.codecs.hevc.supported)}
						</span>
						<span>
							<h5>Codec VP9</h5>
							{returnSupportedTag(capabilities.codecs.vp9.supported)}
						</span>
						<span>
							<h5>Codec WEBP</h5>
							{returnSupportedTag(capabilities.images.webp)}
						</span>
						<span>
							<h5>WEB GPU</h5>
							{returnSupportedTag(capabilities.apis.webgpu)}
						</span>
						<span>
							<h5>WEBGL2</h5>
							{returnSupportedTag(capabilities.apis.webgl2)}
						</span>
						<span>
							<h5>WEBGL</h5>
							{returnSupportedTag(capabilities.apis.webgl)}
						</span>
					</DriversContainer>
				</InfoCard>
			</div>
		</PageContainer>
	)
}