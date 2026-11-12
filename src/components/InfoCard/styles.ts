import styled from "styled-components";

export const CardContainer = styled.section`
  width: 100%;
  background-color: var(--backgroundLight);
  margin-top: 1rem;
  border-radius: 12px;
  height: fit-content;

  .titleBar {
    height: 4rem;
    padding: 8px 16px 8px 16px;
    display: flex;
    align-items: center;
    border-radius: 12px 12px 0 0;
    gap: 1rem;
    border: 2px solid var(--darkGray);
  }

  .cardContent {
    padding: 1rem;
    border-radius: 0 0 12px 12px;
    border: 2px solid var(--darkGray);
    border-top: 0px;
  }

  .iconBorder {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: 1px solid;
    border-radius: 8px;
  }
`