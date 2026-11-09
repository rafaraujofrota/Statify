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

export const WifiContainer = styled.span<{$online: boolean}>`
  border-radius: 24px;
  padding: 8px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ $online }) => $online? "var(--activeGreen20)" : "var(--warningYellow20)"};
  border: 2px solid ${({ $online }) => $online ? "var(--activeGreen)" : "var(--warningYellow)"};
  color: ${({ $online }) => $online ? "var(--activeGreen)" : "var(--warningYellow)"};
`