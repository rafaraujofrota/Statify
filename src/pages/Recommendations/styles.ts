import styled from "styled-components";

export const PageContainer = styled.div`
  .infoCardContainer {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    @media (max-width: 1100px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .loadingContainer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .allGood {
    color: var(--activeGreen);
    font-weight: 500;
  }

  .actionsContainer {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .refreshButton {
    &:hover {
      transform: scale(1.05);
    }
    transition: 0.2s;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 200px;
    height: 36px;
    background-color: CanvasText;
    border-radius: 12px;
    color: Canvas;
    font-weight: 400;
    border: 0;
  }
`

export const ComparisonList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .recommended {
    margin-top: 6px;
    font-size: 12px;
    color: var(--accentColor);
  }
`

export const RecommendationList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const RecommendationItem = styled.li<{ $color: string }>`
  display: flex;
  gap: 1rem;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--background);
  border: 1px solid var(--darkGray);
  border-left: 4px solid ${({ $color }) => $color};

  .icon {
    display: flex;
    padding-top: 2px;
    color: ${({ $color }) => $color};
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    h4 {
      flex: 1;
      font-size: 16px;
    }
  }

  p {
    font-size: 14px;
    line-height: 1.4;
    color: var(--accentColor);
  }
`