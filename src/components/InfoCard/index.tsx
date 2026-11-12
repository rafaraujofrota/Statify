import type { IconType } from "react-icons";
import { CardContainer } from "./styles"

interface InfoCardProps {
  title: string;
  Icon: IconType;
  InfoTag?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function InfoCard({ title, Icon, InfoTag, children, style }: InfoCardProps){
  return(
    <CardContainer style={style}>
      <div className="titleBar">
        <span className="iconBorder">
          <Icon/>
        </span>
        <h3>{title}</h3>
        <span style={{flex: 1}}/>
        {InfoTag}
      </div>
      <div className="cardContent">
        {children}
      </div>
    </CardContainer>
  )
}