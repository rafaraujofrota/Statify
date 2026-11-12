import styled from "styled-components";

export const ProgressBarContainer = styled.div<{ $color?: string }>`
  width: 100%;
  color: var(--accentColor);

  .progressBar {
    width: 100%;
    height: 6px;
    border-radius: 4px;
    background-color: var(--darkGray);
  }

  .progressBarInfo {
    display: flex;
    align-items: flex-end;

    span {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .bColored {
    background-color: ${({ $color }) => $color || "Canvas" };
  }

  .fColored {
    font-size: 42px;
    font-weight: bold;
    color: ${({ $color }) => $color || "Canvas" };
  }
`

export const Bar = styled.div<{ $percentage: number }>`
  height: 100%;
  border-radius: 4px;
  width: ${({ $percentage}) => $percentage + "%"};
`