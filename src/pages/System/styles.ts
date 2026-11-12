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