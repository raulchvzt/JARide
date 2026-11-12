import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para redireccionar al salir
import defaultAdminImg from "../../assets/adminEx.jpg";
import { LuLogOut } from "react-icons/lu"; // Icono de salida

export default function Sidebar({ setVista, vistaActiva }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState({
    nombre: "Admin Principal",
    rol: "Soporte JARide",
    foto: null
  });

  useEffect(() => {
    const nombreLocal = sessionStorage.getItem('usuarioNombre');
    const rolLocal = sessionStorage.getItem('usuarioRol');
    const fotoLocal = sessionStorage.getItem('usuarioFoto');

    if (nombreLocal) {
      setUsuario({
        nombre: nombreLocal,
        rol: rolLocal === 'admin' ? "Soporte JARide" : rolLocal,
        foto: fotoLocal
      });
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    sessionStorage.clear(); // Limpia todo (nombre, rol, etc.)
    navigate("/login");   // Te manda de vuelta al login
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "usuarios", label: "Usuarios" },
    { id: "vehiculos", label: "Vehículos" },
    { id: "reportes", label: "Reportes" },
    { id: "mensajes", label: "Mensajes" },
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
            onClick={() => setVista(item.id)}
          />
        ))}
      </nav>

      {/* SECCIÓN DE PERFIL CON DROPDOWN */}
      <div className="relative pt-6 border-t border-white/5">
        
        {/* MENÚ FLOTANTE (Solo se ve si menuAbierto es true) */}
        {menuAbierto && (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <LuLogOut size={14} />
              Cerrar Sesión
            </button>
          </div>
        )}

        {/* BOTÓN DE PERFIL */}
        <div 
          onClick={() => setMenuAbierto(!menuAbierto)}
          className={`flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all ${menuAbierto ? 'bg-white/5' : 'hover:bg-white/5'}`}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#e7b476] shrink-0">
            <img
              src={usuario.foto || defaultAdminImg}
              alt="Perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{usuario.nombre}</p>
            <p className="text-[10px] text-white/40 font-medium">{usuario.rol}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ label, active = false, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 
      ${active ? "bg-white/5 text-white" : "text-white/30 hover:bg-white/5 hover:text-white"}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#e7b476]" : "bg-transparent"}`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}