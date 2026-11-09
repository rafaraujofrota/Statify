import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-left: 2px solid var(--darkGray);

  > footer {
		width: 100%;
		display: flex;
		align-items: center;
		height: 3rem;
    padding: 0 1rem 0 1rem;
		background-color: var(--background);
		border-top: 2px solid var(--darkGray);
		text-align: center;
	}
`