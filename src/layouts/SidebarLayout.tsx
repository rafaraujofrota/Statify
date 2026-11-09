import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

import { AppContainer, WifiContainer } from "./styles"
import { useState, useEffect } from "react";

import { MdOutlineWifi, MdOutlineWifiOff } from "react-icons/md";

export default function DashboardLayout() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const online = () => setOnline(true);
    const offline = () => setOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, [])

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <AppContainer>
        <main style={{
          padding: "2rem",
          width: "100%",
          height: "100%",
          background: "var(--background)"
        }}>
          <Outlet />
        </main>
        <footer>
          <p>STATIFY - Versão 1.0 </p>
          <div style={{flex: 1}}></div>
          <WifiContainer $online={online}>
            {online ? (<MdOutlineWifi size={16}/>) : (<MdOutlineWifiOff size={16}/>)}
            {online ? "ONLINE" : "OFFLINE"}
          </WifiContainer>
        </footer>
      </AppContainer>
    </div>
  )
}