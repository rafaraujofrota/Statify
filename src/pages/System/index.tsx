import TitleBar from "../../components/TitleBar";

import { PageContainer } from "./styles";

export function System() {
	return (
		<PageContainer>
			<TitleBar diagnosis={100} subtitle="INFORMAÇÕES COLETADAS" title="Informações do Sistema"/>
		</PageContainer>
	)
}