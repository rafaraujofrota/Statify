import { UAParser } from "ua-parser-js";

import { FaComputer, FaGlobe } from "react-icons/fa6";
import InfoCard from "../../components/InfoCard";
import TitleBar from "../../components/TitleBar";
import ProgressBar from "../../components/ProgressBar";

import { BrowserContainer, PageContainer, SystemContainer } from "./styles";
import { getBrowserIcon, getOSIcon } from "../../utils/getIcons";
import { getBrowserCompatibility, getUADataUndefinedAmount } from "../../utils/compatibility";

export function System() {
	const systemData = UAParser()
	const compatibility = getBrowserCompatibility()
	const undefinedAmount = getUADataUndefinedAmount(systemData)
	const diagnosisPercentage = Math.floor((7 - undefinedAmount) / 7 * 100) 

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
		</PageContainer>
	)
}