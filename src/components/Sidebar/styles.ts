import styled from "styled-components";

export const Container = styled.aside<{ $open: boolean }>`
  height: 100vh;
  background: var(--backgroundLight);
  display: flex;
  flex-direction: column;
  padding: 1rem 0 1rem 0;
  gap: 1rem;
  ${({ $open }) => $open ? "width: 20rem;" : "width: 6rem;"}

  hr {
    height: 2px;
    background-color: var(--darkGray);
    font-size: 0;
    border: 0;
  }

  *[data-hide-p="true"] {
    display: none;
  }

  h5 {
    font-weight: 500;
    font-family: "42dot Sans";
    color: var(--accentColor);
    margin-left: 2rem;
  }

  .Title {
    span {
      background-color: var(--accentColor20);
      border: 2px solid var(--accentColor);
      border-radius: 25%;
      width: 4rem;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      img {
        width: 3rem;
        height: 3rem;
      }
    }

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    font-family: "42dot Sans";
    font-weight: 100;
  }
`

export const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 0 1rem 0 1rem;
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
  user-select: none;


  &[data-hide="true"] {
    p {
      display: none !important;
    }
    svg {
      margin: auto;
    }
  }

  svg {
    padding: 4px;
    background-color: var(--accentColor20);
    border-radius: 25%;
  }

  .link {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-weight: 500;
    color: var(--accentColor);
    border-radius: 8px;
    padding: 10px 12px;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .active {
    border: 2px solid var(--accentColor);
    animation: pop 0.3s ease;
    background: var(--accentColor20);
  }
`

export const MonitoringContainer = styled.div<{ $active: boolean }>`
  height: 3rem;
  width: 90%;
  margin: auto;

  display: flex;
  align-items: center;
  padding-left: 1rem;
  gap: 1rem;
  border-radius: 8px;
  background-color: ${({ $active }) => $active ? "var(--activeGreen20)" : "var(--warningYellow20)"};

  span {
    height: 12px;
    width: 12px;
    border-radius: 100%;
    background-color: ${({ $active }) => $active ? "var(--activeGreen)" : "var(--warningYellow)"};
  }

  p, h6 {
    font-weight: 500;
  }

  h6 {
    font-size: 12px;
    color: ${({ $active }) => $active ? "var(--activeGreen)" : "var(--warningYellow)"};
  }

  p {
    font-size: 12px;
    color: var(--accentColor);
  }


  &[data-hide="true"] {
    padding: 4px;

    h6 {
      font-size: 9px;
      text-align: center;
    }

    p, span {
      display: none !important;
    }
  }
`