import TitleBar from "../../components/TitleBar";

import { PageContainer } from "./styles";

export function Peripheral() {
	return (
		<PageContainer>
			<TitleBar diagnosis={100} subtitle="DISPOSITIVOS CONECTADOS" title="Informações do Periféricos"/>
		</PageContainer>
	)
}