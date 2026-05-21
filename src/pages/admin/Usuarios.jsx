import React, { useState, useEffect } from 'react';
import { LuSearch, LuUserPlus, LuTrash2, LuMail } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/usuarios`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/usuarios/${id}`, { method: 'DELETE' });
    cargarUsuarios();
  };

  const usuariosFiltrados = users.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const rolLabel = (rol) => {
    if (rol === 'admin') return 'Admin';
    if (rol === 'vendedor') return 'Vendedor';
    return 'Comprador';
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-medium tracking-tight">Gestión de Usuarios</h1>

      </div>

      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/2 flex gap-4">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-sm outline-none focus:border-[#e7b476]/40 transition-all"
            />
            <LuSearch className="absolute left-4 top-3.5 text-white/20 group-focus-within:text-[#e7b476]" size={18} />
          </div>
        </div>

        {cargando ? (
          <div className="py-20 text-center text-white/20 text-sm">Cargando usuarios...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-white/40">
              <tr>
                <th className="px-8 py-4">Usuario</th>
                <th className="px-8 py-4">Rol</th>
                <th className="px-8 py-4">Teléfono</th>
                <th className="px-8 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {usuariosFiltrados.map(user => (
                <tr key={user.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs overflow-hidden">
                        {user.fotoPerfil
                          ? <img src={user.fotoPerfil} alt={user.nombre} className="w-full h-full object-cover" />
                          : user.nombre.charAt(0).toUpperCase()
                        }
                      </div>
                      <div>
                        <p className="text-sm font-bold">{user.nombre}</p>
                        <p className="text-[11px] text-white/30">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                      user.rol === 'admin'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : user.rol === 'vendedor'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-white/5 text-white/40 border-white/10'
                    }`}>
                      {rolLabel(user.rol)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-white/40">{user.telefono || '—'}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => navigate('/mensajes', { state: { para_email: user.email, para_nombre: user.nombre, asunto: '' } })} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white">
                        <LuMail size={16} />
                      </button>
                      <button
                        onClick={() => eliminarUsuario(user.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!cargando && usuariosFiltrados.length === 0 && (
          <div className="py-20 text-center text-white/20 text-sm">No se encontraron usuarios</div>
        )}
      </div>
    </div>
  );
}
