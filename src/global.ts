import { createGlobalStyle } from "styled-components"

import dotSans from "./assets/fonts/42dotSans.ttf"

export const GlobalStyle = createGlobalStyle`
  * {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
  }

	body {
		font-family: "Montserrat";
	}

	:root {
		--accentColor20: color-mix(in srgb, var(--accentColor) 20%, transparent);
		--darkGray: #262E35;
		--activeGreen: #41C16D;
		--activeGreen20: color-mix(in srgb, var(--activeGreen) 20%, transparent);
		--warningYellow: #D37A1E;
		--warningYellow20: color-mix(in srgb, var(--warningYellow) 20%, transparent);
		--infoBlue: #2FA7F3;
		--infoBlue20: color-mix(in srgb, var(--infoBlue) 20%, transparent);
	}

	:root {
		color-scheme: light;

		--accentColor: #105AC1;
		--background: #F1F5F9;
		--backgroundLight: #FFFFFF;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			color-scheme: dark;

			--accentColor: #90A1B9;
			--background: #020617;
			--backgroundLight: #0E162A;
		}
	}

	// Fontes

	@font-face {
		font-family: "42dot Sans";
		src: url(${dotSans}) format("truetype");
		font-weight: 100 900;
		font-style: normal;
		font-display: swap;
	}

  // Preparei isso para caso for usar os modais, remover depois se não acabar usando

	.Modal {
    inset: 0;
    display: flex;
    flex-direction: column;
    margin: auto;
    background-color: var(--backgroundLight);
    border-radius: 8px;
    padding: 2rem;
		outline: none;
		position: relative;
  }

	.Overlay {
    inset: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.2);
    overflow: auto;
    display: flex;
    padding: 12px;
    z-index: 10000;
    justify-content: center;
    align-items: center;
  }
`