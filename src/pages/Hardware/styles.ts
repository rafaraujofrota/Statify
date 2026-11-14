import styled from "styled-components";

export const PageContainer = styled.div`
  .infoCardContainer {
    display: flex;
    align-items: center;
    gap: 1rem;
    @media (max-width: 1100px) {
      flex-direction: column;
    }
  }

  .simpleInfoContainer {
    p { color: var(--accentColor)}
  }

  .energyContainer {
    display: flex;
    flex-direction: column;
  }
`

export const DisplayContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;

  h1 {
    padding-left: 2rem;
    padding-right: 4rem;
  }

  .screenData {
    display: flex;
    gap: 2rem;
    flex: 1;
    flex-direction: column;
  }

  h5 {
    font-weight: 400;
    color: var(--accentColor);
    font-size: 16px;
  }

  p {
    font-size: 24px;
  }
`