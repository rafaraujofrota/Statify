import styled from "styled-components";

export const TagContainer = styled.span<{ $color: string}>`
  border-radius: 24px;
  padding: 8px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ $color }) => `color-mix(in srgb, ${$color} 20%, transparent)`};
  border: 2px solid ${({ $color }) => $color};
  color: ${({ $color }) => $color };
`