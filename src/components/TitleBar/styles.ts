import styled from "styled-components";

export const TitleContainer = styled.div<{$percentage: number}>`
  width: 100%;

  div {
    display: flex;
    align-items: center;
  }

  h2 {
    color: ${({ $percentage }) => $percentage > 50 ? "var(--activeGreen)" : "var(--warningYellow)"};
  }

  hr {
    background-color: var(--darkGray);
    height: 2px;
    border: 0;
    margin-top: 1rem;
  }
`