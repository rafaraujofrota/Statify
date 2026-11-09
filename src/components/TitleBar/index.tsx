import { TitleContainer } from "./styles";

interface TitleBarProps {
  title: string;
  subtitle: string;
  diagnosis: number;
}

export default function TitleBar({ title, subtitle, diagnosis }: TitleBarProps) {
  return (
    <TitleContainer $percentage={diagnosis}>
      <div style={{ marginBottom: "8px" }}>
        <p>{subtitle}</p>
        <span style={{flex: 1}}/>
        <p>DIAGNÓSTICO BASE</p>
      </div>
      <div>
        <h1>{title}</h1>
        <span style={{flex: 1}}/>
        <h2>{diagnosis} %</h2>
      </div>
      <hr />
    </TitleContainer>
  )
}