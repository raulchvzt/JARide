import React, { useState, useEffect } from "react";
import StatCard from "../../components/admin/StatCard";
import DashboardChart from "../../components/admin/DashboardChart";
import { ValidationRow, ReportItem, ActividadItem } from "../../components/admin/UIElements";

import { 
  LuCar, 
  LuTrendingUp, 
  LuUsers, 
  LuCircleAlert,
  LuHistory 
} from "react-icons/lu";

export default function VistaGeneral() {
  const [pendientes, setPendientes] = useState([]);

  // 1. Cargar autos reales del servidor
  const cargarPendientes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/autos`);
      const data = await res.json();
      // Solo mostramos los que tienen estado "pendiente"
      const soloPendientes = data.filter(auto => auto.estado === "pendiente");
      setPendientes(soloPendientes);
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  useEffect(() => {
    cargarPendientes();
  }, []);

  // 2. Función para Aprobar o Rechazar (Conectada a los botones del componente)
  const manejarDecision = async (id, nuevoEstado) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/revisar-auto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nuevoEstado })
      });
      cargarPendientes(); // Refresca la lista automáticamente
    } catch (error) {
      console.error("Error al procesar la revisión:", error);
      alert("Error al procesar la revisión");
    }
  };

  const obtenerFechaActual = () => {
    const fecha = new Date();
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    const fechaString = fecha.toLocaleDateString("es-ES", opciones);
    return fechaString.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Vista General</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-white/40 text-[11px] tracking-[0.2em] uppercase font-black">
              Hoy, {obtenerFechaActual()}
            </p>
          </div>
        </div>
      </header>

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Autos en Renta" value="1,250" trend="+12%" subtext="desde el mes pasado" icon={<LuCar />} />
        <StatCard title="Autos Vendidos" value="342" trend="+5%" subtext="desde el mes pasado" icon={<LuTrendingUp />} />
        <StatCard title="Nuevos Usuarios" value="89" subtext="Últimos 30 días" icon={<LuUsers />} />
        <StatCard title="Reportes Activos" value="12" alert subtext="Atención urgente" icon={<LuCircleAlert  />} />
      </div>

      {/* GRÁFICA */}
      <div className="mb-10 bg-[#111] rounded-3xl border border-white/5 p-8 shadow-2xl overflow-hidden">
        <DashboardChart />
      </div>

      {/* GRID INFERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-[#111] rounded-3xl border border-white/5 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-medium">Validación de Vehículos</h3>
            <span className="bg-[#e7b476]/10 text-[#e7b476] text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest border border-[#e7b476]/20">
              {pendientes.length} POR REVISAR
            </span>
          </div>
          
          <div className="space-y-6">
            {pendientes.length > 0 ? (
              pendientes.map((auto) => (
                <ValidationRow 
                  key={auto.id}
                  img={auto.photos[0] || "/placeholder-car.jpg"} 
                  name={`${auto.marca} ${auto.modelo}`} 
                  info={`Subido por ${auto.vendedor} • KM: ${auto.km} • $${auto.precio}`} 
                  onAccept={() => manejarDecision(auto.id, 'aprobado')}
                  onReject={() => manejarDecision(auto.id, 'rechazado')}
                />
              ))
            ) : (
              <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                 <p className="text-white/20 text-xs font-black uppercase tracking-widest">No hay solicitudes pendientes</p>
              </div>
            )}
          </div>
        </div>

        {/* REPORTE Y ACTIVIDAD (Se mantienen igual) */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#111] rounded-3xl border border-white/5 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-medium">Gestión de Reportes</h3>
              <span className="bg-[#e7b476]/10 text-[#e7b476] text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest border border-[#e7b476]/20">3 PENDIENTES</span>
            </div>
            <div className="space-y-8">
              <ReportItem user="Carlos Méndez" status="REVISIÓN" msg="El auto fue entregado con retraso de 2 horas." time="Hace 2 horas" />
              <ReportItem user="Juan V." status="RESUELTO" msg="Intento de cobro fuera de plataforma." time="Ayer" resolved />
            </div>
          </div>

          <div className="bg-[#111]/50 rounded-3xl border border-white/5 p-8">
            <div className="flex items-center gap-2 mb-6 text-white/60">
              <LuHistory size={14} />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Actividad</h3>
            </div>
            <div className="space-y-3">
              <ActividadItem texto="Nuevo usuario registrado: Ana P." tiempo="10m" />
              <ActividadItem texto="Pago procesado #8829" tiempo="1h" />
              <ActividadItem texto="Reporte cerrado por soporte" tiempo="2h" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}