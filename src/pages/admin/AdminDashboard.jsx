import React from "react";
// Importación de componentes locales
import Sidebar from "../../components/admin/Sidebar";
import StatCard from "../../components/admin/StatCard";
import DashboardChart from "../../components/admin/DashboardChart";
import { ValidationRow, ReportItem, ActividadItem } from "../../components/admin/UIElements";

// Importación de iconos
import { 
  LuCar, 
  LuTrendingUp, 
  LuUsers, 
  LuCircleAlert, 
  LuSearch, 
  LuBell, 
  LuPlus, 
  LuHistory 
} from "react-icons/lu";

export default function AdminDashboard() {
  
  // Lógica para la fecha dinámica
  const obtenerFechaActual = () => {
    const fecha = new Date();
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    const fechaString = fecha.toLocaleDateString("es-ES", opciones);
    return fechaString.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      
      {/* 1. Barra Lateral Fija */}
      <Sidebar />

      {/* 2. Contenedor de Contenido (con margen izquierdo para no quedar bajo la sidebar) */}
      <main className="flex-1 ml-64 p-10 bg-[#0c0c0c]">
        
        {/* HEADER: Buscador, Notificaciones y Bienvenida */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-[30px]">Vista General</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-white/40 text-[12px] tracking-[0.2em] uppercase font-bold">
                Hoy, {obtenerFechaActual()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative flex-1 md:w-64 group">
              <input 
                type="text" 
                placeholder="Buscar en JARide..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-5 text-xs focus:outline-none focus:border-[#e7b476]/40 transition-all font-light"
              />
              <LuSearch className="absolute right-4 top-2.5 text-white/10 group-focus-within:text-[#e7b476] transition-colors" size={14} />
            </div>

            {/* Notificaciones */}
            <button className="relative p-2.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all">
              <LuBell size={18} className="text-white/40" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-[#0c0c0c] rounded-full"></span>
            </button>

            {/* Acción Principal */}
            <button className="flex items-center gap-2 bg-[#e7b476] text-black px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg shadow-[#e7b476]/10">
              <LuPlus size={14} /> Nuevo Registro
            </button>
          </div>
        </header>

        {/* SECCIÓN DE ESTADÍSTICAS (StatCards) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Autos en Renta"
            value="1,250"
            trend="+12%"
            subtext="desde el mes pasado"
            icon={<LuCar />}
          />
          <StatCard
            title="Autos Vendidos"
            value="342"
            trend="+5%"
            subtext="desde el mes pasado"
            icon={<LuTrendingUp />}
          />
          <StatCard
            title="Nuevos Usuarios"
            value="89"
            subtext="Últimos 30 días"
            icon={<LuUsers />}
          />
          <StatCard
            title="Reportes Activos"
            value="12"
            alert
            subtext="Atención urgente"
            icon={<LuCircleAlert />}
          />
        </div>

        {/* GRÁFICA DE RENDIMIENTO */}
        <DashboardChart />

        {/* GRID INFERIOR: Validación y Lateral de Reportes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* TABLA DE VALIDACIÓN (Izquierda) */}
          <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-white/5 p-8 shadow-2xl shadow-black/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[20px] font-medium">Validación de Vehículos</h3>
              <button className="text-white/40 text-[11px] uppercase tracking-widest hover:text-white transition font-black">
                Ver todos
              </button>
            </div>

            <div className="space-y-6">
              <ValidationRow
                img="/src/assets/audiq8.jpg"
                name="Audi Q8 S-Line 2023"
                info="Subido por Carlos M. • Colima • $1,200 MXN/día"
              />
              <ValidationRow
                img="/src/assets/mercedes.png"
                name="Mercedes-Benz C-Class 2022"
                info="Subido por AutoPremium MX • Colima • $950 MXN/día"
              />
              <ValidationRow
                img="/src/assets/pors.jpg"
                name="Porsche 911 Carrera 2021"
                info="Subido por ExoticRents • Colima • $4,500 MXN/día"
              />
            </div>
          </div>

          {/* COLUMNA DERECHA: Reportes y Actividad */}
          <div className="flex flex-col gap-6">
            
            {/* Gestión de Reportes */}
            <div className="bg-[#111] rounded-2xl border border-white/5 p-8 shadow-2xl shadow-black/50">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-medium">Gestión de Reportes</h3>
                <span className="bg-[#e7b476]/10 text-[#e7b476] text-[11px] px-2 py-0.5 rounded font-black uppercase tracking-widest border border-[#e7b476]/20">
                  3 PENDIENTES
                </span>
              </div>

              <div className="space-y-8">
                <ReportItem
                  user="Carlos Méndez"
                  status="REVISIÓN"
                  msg="El auto fue entregado con retraso de 2 horas."
                  time="Hace 2 horas"
                />
                <ReportItem
                  user="Juan V."
                  status="RESUELTO"
                  msg="Intento de cobro fuera de plataforma."
                  time="Ayer"
                  resolved
                />
              </div>
            </div>

            {/* Feed de Actividad Reciente */}
            <div className="bg-[#111]/50 rounded-2xl border border-white/5 p-8">
              <div className="flex items-center gap-2 mb-6 text-white/60">
                <LuHistory size={14} />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Actividad</h3>
              </div>
              <div className="space-y-2">
                <ActividadItem texto="Nuevo usuario registrado: Ana P." tiempo="10m" />
                <ActividadItem texto="Pago procesado #8829" tiempo="1h" />
                <ActividadItem texto="Reporte cerrado por soporte" tiempo="2h" />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}