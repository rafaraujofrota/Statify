import styled from "styled-components";

export const PageContainer = styled.div`
  .infoCardContainer {
    display: flex;
    gap: 2rem;
    align-items: center;
    @media (max-width: 1052px) {
      flex-direction: column;
    }
  }

  .buttonContainer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .TestButton {
    &:hover {
      transform: scale(1.05);
    }
    cursor: pointer;
    width: 200px;
    height: 36px;
    background-color: CanvasText;
    border-radius: 12px;
    color: Canvas;
    font-weight: 400;
    border: 0;
  }

  .TestButtonActive {
  cursor: pointer;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 100%;
  background-color: var(--background);
  color: CanvasText;
  font-size: 90px;
  font-weight: 900;
  border: none;
  outline: none;
}

  .loadingContainer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export const SystemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  > span {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    padding: 12px;
    border: 2px solid var(--infoBlue);
    color: var(--infoBlue);
  } 

  hr {
    background-color: var(--darkGray);
    height: 2px;
    border: 0;
    margin-bottom: 8px;
  }

  .infoContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .info > p {
    font-weight: 400;
    text-transform: uppercase;
    font-size: 20px;
  }

  .info > h5 {
    color: var(--accentColor);
    font-weight: 300;
  }
`

export const BrowserContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  .browserInfo {
    display: flex;
    gap: 1rem;
    > span {
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--infoBlue);
      border-radius: 50%;
    }
  }

  .browserInfoContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;

    p { 
      font-size: 14px;
      color: var(--accentColor);
    }
  }
`

export const LocationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
  gap: 1rem;

  .infoContainer {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  h5, h6 {
    font-weight: 500;
    color: var(--accentColor);
  }

  span { 
    width: 50%;
  }
`
interface SplitContainerProps {
  $direction?: "row" | "column";
}

interface SplitBoxProps {
  $ratio?: number;
}

interface SplitContainerProps {
  $direction?: "row" | "column";
}

interface SplitBoxProps {
  $ratio?: number;
}

export const SplitContainer = styled.div<SplitContainerProps>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction ?? "row"};
  gap: 12px;
  width: 100%;
  min-width: 0;
  min-height: 275px;

  ${({ $direction }) =>
    $direction === "column" &&
    `
    height: 275px;
  `}
`;

export const TestContainer = styled.div<SplitBoxProps>`
  flex: ${({ $ratio }) => $ratio ?? 1} 1 0%;
  min-width: 0;
  min-height: 0;
  display: flex;

  > span {
    flex: 1;
    width: 100%;
    height: 100%;
    min-height: 0;
    background-color: var(--background);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid var(--darkGray, #334155);

    > h5 {
      margin: 0;
      text-align: center;
    }
  }
`;