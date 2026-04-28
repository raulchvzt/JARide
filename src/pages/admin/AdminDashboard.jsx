import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import VistaGeneral from "./VistaGeneral";
import Usuarios from "./Usuarios";
import Vehiculos from "./Vehiculos"; // El que hicimos antes
import Reportes from "./Reportes";
import Configuracion from "./Configuracion";

export default function AdminDashboard() {
  const [vistaActiva, setVistaActiva] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Sidebar setVista={setVistaActiva} vistaActiva={vistaActiva} />
      <main className="flex-1 ml-64 p-10 bg-[#0c0c0c]">
        {vistaActiva === "dashboard" && <VistaGeneral />}
        {vistaActiva === "usuarios" && <Usuarios />}
        {vistaActiva === "vehiculos" && <Vehiculos />}
        {vistaActiva === "reportes" && <Reportes />}
        {vistaActiva === "config" && <Configuracion />}
      </main>
    </div>
  );
}