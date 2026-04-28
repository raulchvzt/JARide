import React from "react";
// Importación de componentes locales
import StatCard from "../../components/admin/StatCard";
import DashboardChart from "../../components/admin/DashboardChart";
import { ValidationRow, ReportItem, ActividadItem } from "../../components/admin/UIElements";

// Importación de iconos (Asegúrate de que existan para evitar pantalla blanca)
import { 
  LuCar, 
  LuTrendingUp, 
  LuUsers, 
  LuCircleAlert ,
  LuSearch, 
  LuBell, 
  LuPlus, 
  LuHistory 
} from "react-icons/lu";

export default function VistaGeneral() {
  
  const obtenerFechaActual = () => {
    const fecha = new Date();
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    const fechaString = fecha.toLocaleDateString("es-ES", opciones);
    return fechaString.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };

  return (
    /* Eliminamos el flex y el ml-64 porque el AdminDashboard ya los maneja */
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

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
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
            <button className="text-white/40 text-[10px] uppercase tracking-widest hover:text-white transition font-black">Ver todos</button>
          </div>
          <div className="space-y-6">
            <ValidationRow img="/src/assets/audiq8.jpg" name="Audi Q8 S-Line 2023" info="Subido por Carlos M. • Colima • $1,200 MXN/día" />
            <ValidationRow img="/src/assets/mercedes.png" name="Mercedes-Benz C-Class 2022" info="Subido por AutoPremium MX • Colima • $950 MXN/día" />
            <ValidationRow img="/src/assets/pors.jpg" name="Porsche 911 Carrera 2021" info="Subido por ExoticRents • Colima • $4,500 MXN/día" />
          </div>
        </div>

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