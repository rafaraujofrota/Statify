import type { IconType } from "react-icons";
import { TagContainer } from "./styles";

interface InfoTagProps {
  color: string;
  Icon?: IconType;
  children: React.ReactNode;
}

export default function InfoTag({color, children, Icon }: InfoTagProps) {
  return (
    <TagContainer $color={color}>
      {Icon && (<Icon size={16}/>)}
      {children}
    </TagContainer>
  )
}