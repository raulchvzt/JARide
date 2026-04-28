import React from "react";
import adminProfileImg from "../../assets/adminEx.jpg";

// Eliminamos LuCheckCircle y otros que daban error en tu consola
// Si quieres usar iconos, asegúrate de que existan en tu versión de react-icons/lu
export default function Sidebar({ setVista, vistaActiva }) {
  
  // Definimos los IDs para que coincidan con los de tu AdminDashboard
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "usuarios", label: "Usuarios" },
    { id: "vehiculos", label: "Vehículos" },
    { id: "reportes", label: "Reportes" },
    { id: "config", label: "Configuración" },
  ];

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col p-6 fixed h-full bg-[#0a0a0a] z-50">
      <div className="flex items-center gap-2 mb-10 px-2">
        <a href="/" className="text-2xl font-black italic tracking-tighter text-white uppercase">JARide</a>
        <span className="bg-white/10 text-[8px] uppercase px-2 py-1 rounded font-bold tracking-widest text-white/50">Admin</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavItem 
            key={item.id}
            label={item.label}
            active={vistaActiva === item.id}
            onClick={() => setVista(item.id)} // <--- Esto activa el cambio de vista
          />
        ))}
      </nav>

      <div className="pt-6 border-t border-white/5 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#e7b476]">
          <img
            src={adminProfileImg}
            alt="Perfil de admin"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Admin Principal</p>
          <p className="text-[10px] text-white/40 font-medium">Soporte JARide</p>
        </div>
      </div>
    </aside>
  );
}

// Actualizamos NavItem para recibir el evento onClick
function NavItem({ label, active = false, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 
      ${active ? "bg-white/5 text-white" : "text-white/30 hover:bg-white/5 hover:text-white"}`}
    >
      {/* Indicador visual simple en lugar de icono propenso a errores */}
      <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#e7b476]" : "bg-transparent"}`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}