import React from "react";
import { LuLayoutDashboard, LuUsers, LuCar, LuFlag, LuSettings } from "react-icons/lu";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/5 flex flex-col p-6 fixed h-full bg-[#0a0a0a] z-50">
      <div className="flex items-center gap-2 mb-10 px-2">
        <a href="/" className="text-2xl font-black italic tracking-tighter text-white">JARide</a>
        <span className="bg-white/10 text-[8px] uppercase px-2 py-1 rounded font-bold tracking-widest text-white/50">Admin</span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon={<LuLayoutDashboard />} label="Dashboard" active />
        <NavItem icon={<LuUsers />} label="Usuarios" />
        <NavItem icon={<LuCar />} label="Vehículos" />
        <NavItem icon={<LuFlag />} label="Reportes" />
        <NavItem icon={<LuSettings />} label="Configuración" />
      </nav>

      <div className="pt-6 border-t border-white/5 flex items-center gap-3 px-2">
        <img src="/src/assets/adminEx.jpg" className="w-10 h-10 rounded-full border border-white/10" alt="avatar" />
        <div>
          <p className="text-xs font-bold text-white">Admin Principal</p>
          <p className="text-[12px] text-white/40 font-medium">Soporte JARide</p>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${active ? "bg-white/5 text-white" : "text-white/30 hover:bg-white/5 hover:text-white"}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}