import { useEffect, useState } from "react";
import { BsBatteryFull, BsDisplay, BsGpuCard, BsMemory } from "react-icons/bs";
import { IoMdFlash, IoMdFlashOff } from "react-icons/io";

import InfoCard from "../../components/InfoCard";
import TitleBar from "../../components/TitleBar";

import { DisplayContainer, PageContainer } from "./styles";
import { getGPUInfo, measureRefreshRate } from "../../utils/getInfo";
import ProgressBar from "../../components/ProgressBar";

function calculateTime(b: BatteryInfo): string {
	if(b.charging) {
		if(!Number.isFinite(b.chargingTime)) return "Calculando..."
		const minutes = Math.floor(b.chargingTime / 60)
		if(minutes == 0) return ""
		return `${minutes} Minutos`
	} else {
		if(!Number.isFinite(b.dischargingTime)) return "Calculando..."
		return `${Math.floor(b.dischargingTime / 60)} Minutos`
	}
}

function getOrientationName(type: OrientationType): string {
  switch (type) {
    case "landscape-primary":
      return "Paisagem";
    case "landscape-secondary":
      return "Paisagem invertida";
    case "portrait-primary":
      return "Retrato";
    case "portrait-secondary":
      return "Retrato invertido";
  }
}

export function Hardware() {
	const gpuInfo = getGPUInfo()
	const [battery, setBattery] = useState<BatteryInfo>()
	const [freeStorage, setFreeStorage] = useState<number>()
	const [refreshRate, setRefreshRate] = useState<number>()

	useEffect(() => {
		if(!navigator.getBattery) return;
		let batteryManager: BatteryInfo | undefined;

		function readBattery() {
			if(!batteryManager) return

			setBattery({
				charging: batteryManager.charging, 
				chargingTime: batteryManager.chargingTime,
				dischargingTime: batteryManager.dischargingTime,
				level: batteryManager.level
			})
		}	

		navigator.getBattery().then((b: BatteryInfo) => {
			batteryManager = b
			readBattery()
		})

		const id = setInterval(() => readBattery(), 3000);
		return () => clearInterval(id);
	}, [])

	useEffect(() => {
		navigator.storage.estimate().then(({ quota = 0 }) => {
			setFreeStorage(quota / (1024 ** 3));
		});
	}, []);

	useEffect(() => {
  	measureRefreshRate().then(setRefreshRate);
	}, []);

	return (
		<PageContainer>
			<TitleBar diagnosis={100} subtitle="RECURSOS DETECTADOS" title="Informações de Hardware"/>
			<div className="infoCardContainer">
				<InfoCard Icon={BsGpuCard} title="Placa Gráfica / Processador">
					<div className="simpleInfoContainer">
						<h1>{gpuInfo.gpu}</h1>
						<p style={{marginBottom: "1rem"}}>API Gráfica: {gpuInfo.api}</p>
						<h4>Quantidade de Núcleos: { navigator.hardwareConcurrency }</h4>
					</div>
				</InfoCard>
				<InfoCard Icon={BsBatteryFull} title="Energia">
					<div className="energyContainer">
						{battery == undefined ? 
						(<h1 style={{textAlign: "center"}}>Indisponível</h1>) : (
							<>
								<h1>{battery.charging ? "Carregando" : "Descarregando"}</h1>
								<ProgressBar 
									percentage={Math.round(battery.level * 100)} 
									color="#F5BA26"
									title={calculateTime(battery)}
									percentageStyle={{
										text: `${Math.round(battery.level * 100)}%`, isBig: true, 
										Icon: battery.charging ? IoMdFlash : IoMdFlashOff
									}}
								/>
							</>
						)}
					</div>
				</InfoCard>
			</div>
			<div className="infoCardContainer">
				<InfoCard title="Memória" Icon={BsMemory}>
					<div className="simplesInfoContainer">
						<h1>
							Memória RAM: {navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Indisponível"}
						</h1>
						<h1>
							Memória Livre Estimada: 
							{freeStorage ? ` ${freeStorage.toFixed(1)} GB` : "Desconhecido"}
						</h1>
					</div>
				</InfoCard>
				<InfoCard title="Monitor" Icon={BsDisplay}>
					<DisplayContainer>
						<h1 style={{textAlign: "center"}}>
							{screen.width * window.devicePixelRatio}
							<br />
							X
							<br />
							{screen.height * window.devicePixelRatio}				
						</h1>
						<div className="screenData">
							<span>
								<h5>ESCALA</h5>
								<p>{window.devicePixelRatio * 100}%</p>
							</span>
							<span>
								<h5>POSSUI HDR</h5>
								<p>{matchMedia("(dynamic-range: high)").matches ? "Sim" : "Não"}</p>
							</span>
						</div>
						<div className="screenData">
							<span>
								<h5>ORIENTAÇÃO</h5>
								<p>{getOrientationName(screen.orientation.type)}</p>
							</span>
							<span>
								<h5>TAXA DE ATUALIZAÇÃO</h5>
								<p>{refreshRate ? `${refreshRate}Hz` : "Calculando..."}</p>
							</span>
						</div>
					</DisplayContainer>
				</InfoCard>
			</div>
		</PageContainer>
	)
}