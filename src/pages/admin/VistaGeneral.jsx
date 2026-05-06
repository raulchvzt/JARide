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
  const [stats, setStats] = useState(null);

  const cargarPendientes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/autos`);
      const data = await res.json();
      setPendientes(data.filter(auto => auto.estado === "pendiente"));
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  const cargarStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  useEffect(() => {
    cargarPendientes();
    cargarStats();
  }, []);

  const manejarDecision = async (id, nuevoEstado) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/revisar-auto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nuevoEstado })
      });
      cargarPendientes();
      cargarStats(); // Refrescar stats también al aprobar/rechazar
    } catch (error) {
      console.error("Error al procesar la revisión:", error);
    }
  };

  const obtenerFechaActual = () => {
    const fecha = new Date();
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    return fecha.toLocaleDateString("es-ES", opciones).replace(/(^\w|\s\w)/g, m => m.toUpperCase());
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
        <StatCard
          title="Autos Publicados"
          value={stats ? stats.autosAprobados.toLocaleString() : '—'}
          subtext="en catálogo actualmente"
          icon={<LuCar />}
        />
        <StatCard
          title="Total de Autos"
          value={stats ? stats.totalAutos.toLocaleString() : '—'}
          subtext="registrados en plataforma"
          icon={<LuTrendingUp />}
        />
        <StatCard
          title="Usuarios Registrados"
          value={stats ? stats.totalUsuarios.toLocaleString() : '—'}
          subtext={stats ? `${stats.vendedores} vendedores · ${stats.compradores} compradores` : ''}
          icon={<LuUsers />}
        />
        <StatCard
          title="Pendientes de Revisión"
          value={stats ? stats.autosPendientes.toLocaleString() : '—'}
          alert={stats?.autosPendientes > 0}
          subtext={stats?.autosPendientes > 0 ? "Requieren atención" : "Todo al día"}
          icon={<LuCircleAlert />}
        />
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

        {/* REPORTES Y ACTIVIDAD */}
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
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Actividad Reciente</h3>
            </div>
            <div className="space-y-3">
              {stats && (
                <>
                  <ActividadItem texto={`${stats.totalUsuarios} usuarios registrados en total`} tiempo="hoy" />
                  <ActividadItem texto={`${stats.autosAprobados} autos aprobados en catálogo`} tiempo="hoy" />
                  <ActividadItem texto={`${stats.autosPendientes} autos esperando revisión`} tiempo="hoy" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}