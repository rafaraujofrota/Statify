import type { IconType } from "react-icons";
import { TagContainer } from "./styles";

interface InfoTagProps {
  color: string;
  Icon?: IconType;
  text: string;
}

export default function InfoTag({color, text, Icon }: InfoTagProps) {
  return (
    <TagContainer $color={color}>
      {Icon && (<Icon size={16}/>)}
      {text}
    </TagContainer>
  )
}