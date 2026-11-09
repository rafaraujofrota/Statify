import { NavLink, type NavLinkProps } from "react-router-dom";

import { useState, type ReactNode } from "react";

import { Container, MonitoringContainer, NavContainer } from "./styles";

import { FaLaptop, FaMouse, FaRegLightbulb } from "react-icons/fa";
import { IoHardwareChipSharp } from "react-icons/io5";
import { LuTestTube } from "react-icons/lu";

interface SideBarLinkProps extends NavLinkProps{
  children: ReactNode
}

function SidebarLink({ to, children, end = false } : SideBarLinkProps) {
  return (
    <NavLink 
      to={to} end={end} draggable = "false"
      className={({ isActive }) => isActive ? "link active" : "link"}
    >
      {children}
    </NavLink>
  );
}

export default function Sidebar() {
  // Depois fazer essa parte do Monitoring com algum hook
  const monitoring: boolean = true;
  const [open, setOpen] = useState(() => window.innerWidth > 756)

  return (
    <Container $open={open}>
      <div className="Title">
        <span onClick={() => setOpen(!open)}>
          <img src="/logo.png"/>
        </span>
        <h1 data-hide-p={!open} >STATIFY_</h1>
      </div>

      <hr />

      <h5 data-hide-p={!open}>MÓDULOS DE DIAGNÓSTICO</h5>

      <NavContainer data-hide={!open}>
        <SidebarLink to="/" end>
          <FaLaptop size={28}/> <p>Sistema</p>
        </SidebarLink>
        <SidebarLink to="/hardware">
          <IoHardwareChipSharp size={28}/> <p>Hardware</p>
        </SidebarLink>
        <SidebarLink to="/peripheral">
          <FaMouse size={28}/> <p>Perífericos</p>
        </SidebarLink>
        <SidebarLink to="/tests">
          <LuTestTube size={28}/> <p>Testes</p>
        </SidebarLink>
        <SidebarLink to="/recommendations">
          <FaRegLightbulb size={28}/> <p>Recomendações</p>
        </SidebarLink>
      </NavContainer>

      <hr />

      <MonitoringContainer $active={monitoring} data-hide={!open}>
        <span/>
        <div>
          <h6>Monitoramento { monitoring ? "Ativo" : "Desativado" }</h6>
          <p>Última leitura: Agora</p>
        </div>
      </MonitoringContainer>
    </Container>
  )
}