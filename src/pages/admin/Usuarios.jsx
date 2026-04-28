import React, { useState } from 'react';
import { LuSearch, LuUserPlus, LuTrash2, LuShieldCheck, LuMail } from "react-icons/lu";

export default function Usuarios() {
  const [users] = useState([
    { id: 1, name: "Carlos Méndez", email: "carlos@mail.com", role: "Vendedor", status: "Verificado" },
    { id: 2, name: "Ana García", email: "ana@mail.com", role: "Cliente", status: "Pendiente" },
    { id: 3, name: "Roberto Solís", email: "rober@mail.com", role: "Vendedor", status: "Verificado" },
  ]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-medium tracking-tight">Gestión de Usuarios</h1>
        <button className="bg-[#e7b476] text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg shadow-[#e7b476]/10 flex items-center gap-2">
          <LuUserPlus size={14} /> Nuevo Usuario
        </button>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/2 flex gap-4">
          <div className="relative flex-1 group">
            <input type="text" placeholder="Buscar por nombre o correo..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-sm outline-none focus:border-[#e7b476]/40 transition-all" />
            <LuSearch className="absolute left-4 top-3.5 text-white/20 group-focus-within:text-[#e7b476]" size={18} />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-white/40">
            <tr>
              <th className="px-8 py-4">Usuario</th>
              <th className="px-8 py-4">Rol</th>
              <th className="px-8 py-4">Estatus</th>
              <th className="px-8 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-white/2 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-[11px] text-white/30">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-xs text-white/60">{user.role}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${user.status === 'Verificado' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white"><LuMail size={16}/></button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500"><LuTrash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}