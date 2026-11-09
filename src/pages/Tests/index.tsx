import TitleBar from "../../components/TitleBar";

import { PageContainer } from "./styles";

export function Tests() {
	return (
		<PageContainer>
			<TitleBar diagnosis={100} subtitle="TESTE SEUS PERIFERICOS" title="Área de Testes"/>
		</PageContainer>
	)
}