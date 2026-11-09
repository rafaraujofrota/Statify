import TitleBar from "../../components/TitleBar";

import { PageContainer } from "./styles";

export function Recommendations() {
	return (
		<PageContainer>
			<TitleBar diagnosis={100} subtitle="PRÓXIMAS AÇÕES" title="Comparações e Recomendações"/>
		</PageContainer>
	)
}