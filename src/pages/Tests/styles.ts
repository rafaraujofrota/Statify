import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const TestCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

export const ControlHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .statusText {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accentColor);
      font-weight: 600;
    }

    h4 {
      font-size: 15px;
      font-weight: 500;
      color: CanvasText;
    }
  }

  .actionArea {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .percentage {
    font-size: 22px;
    font-weight: 700;
    font-family: monospace;
    color: var(--accentColor);
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.65rem 1.4rem;
  border-radius: 8px;
  border: 1px solid var(--darkGray);
  background-color: var(--background);
  color: CanvasText;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: var(--accentColor);
    box-shadow: 0 4px 12px var(--accentColor20);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
  width: 100%;
`;

export const MetricCard = styled.div<{ $highlight?: boolean }>`
  background-color: var(--background);
  border: 1px solid ${({ $highlight }) => ($highlight ? "var(--activeGreen)" : "var(--darkGray)")};
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: border-color 0.2s;

  .label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--accentColor);
  }

  .valueWrapper {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;

    .value {
      font-size: 26px;
      font-weight: 700;
      color: ${({ $highlight }) => ($highlight ? "var(--activeGreen)" : "inherit")};
      font-family: monospace;
    }

    .unit {
      font-size: 13px;
      color: var(--accentColor);
      font-weight: 500;
    }
  }

  .description {
    font-size: 12px;
    color: var(--accentColor);
    margin-top: auto;
  }
`;

export const RatingBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background-color: var(--background);
  border-left: 4px solid var(--infoBlue);
  border-radius: 6px;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;

  .ratingTitle {
    font-size: 13px;
    font-weight: 600;
    color: var(--accentColor);
    text-transform: uppercase;
  }

  .ratingValue {
    font-size: 14px;
    font-weight: 700;
    color: var(--infoBlue);
  }
`;
