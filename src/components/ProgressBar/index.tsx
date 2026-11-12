import type { IconType } from "react-icons";
import { Bar, ProgressBarContainer } from "./styles";

interface percentageStyle {
  text?: string
  Icon?: IconType
  isBig: boolean
}

interface ProgressBarProps {
  color?: string;
  title?: string;
  percentage: number;
  percentageStyle: percentageStyle
}

export default function ProgressBar({ color, title, percentage, percentageStyle} : ProgressBarProps) {
  const per = Math.min(100, Math.max(0, percentage))

  return (
    <ProgressBarContainer $color={color}>
      <div className="progressBarInfo">
        <p style={{paddingBottom: "6px"}}>{title}</p>
        <span style={{flex: 1}}/>
        <span className={percentageStyle.isBig ? "fColored" : ""}>
          <p>{percentageStyle.text}</p>
          {percentageStyle.Icon && (<percentageStyle.Icon/>)}
        </span>
      </div>
      <div className="progressBar">
        <Bar $percentage={per} className="bColored"/>
      </div>
    </ProgressBarContainer>
  )
}