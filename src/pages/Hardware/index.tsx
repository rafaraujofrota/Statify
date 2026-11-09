import TitleBar from "../../components/TitleBar";

import { PageContainer } from "./styles";

export function Hardware() {
	return (
		<PageContainer>
			<TitleBar diagnosis={100} subtitle="RECURSOS DETECTADOS" title="Informações de Hardware"/>
		</PageContainer>
	)
}