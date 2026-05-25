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
    <div className="animate-in fade-in duration-500 p-4 sm:p-0">
      <div className="flex justify-between items-center mb-6 sm:mb-10">
        <h1 className="text-xl sm:text-3xl font-medium tracking-tight">Gestión de Usuarios</h1>
      </div>

      <div className="bg-[#111] rounded-lg sm:rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-3 sm:p-6 border-b border-white/5 bg-white/2 flex gap-4">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2 sm:py-3 px-8 sm:px-12 text-xs sm:text-sm outline-none focus:border-[#e7b476]/40 transition-all"
            />
            <LuSearch className="absolute left-2 sm:left-4 top-2.5 sm:top-3.5 text-white/20 group-focus-within:text-[#e7b476]" size={18} />
          </div>
        </div>

        {cargando ? (
          <div className="py-12 sm:py-20 text-center text-white/20 text-xs sm:text-sm">Cargando usuarios...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/5 text-[8px] sm:text-[10px] uppercase tracking-widest sm:tracking-[0.2em] text-white/40">
                <tr>
                  <th className="px-3 sm:px-8 py-3 sm:py-4">Usuario</th>
                  <th className="px-3 sm:px-8 py-3 sm:py-4 hidden sm:table-cell">Rol</th>
                  <th className="px-3 sm:px-8 py-3 sm:py-4 hidden md:table-cell">Teléfono</th>
                  <th className="px-3 sm:px-8 py-3 sm:py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usuariosFiltrados.map(user => (
                  <tr key={user.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-3 sm:px-8 py-3 sm:py-5">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 sm:w-9 h-7 sm:h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] sm:text-xs overflow-hidden shrink-0">
                          {user.fotoPerfil
                            ? <img src={user.fotoPerfil} alt={user.nombre} className="w-full h-full object-cover" />
                            : user.nombre.charAt(0).toUpperCase()
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold truncate">{user.nombre}</p>
                          <p className="text-[9px] sm:text-[11px] text-white/30 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-8 py-3 sm:py-5 hidden sm:table-cell">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-[7px] sm:text-[9px] font-black uppercase border whitespace-nowrap ${
                        user.rol === 'admin'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : user.rol === 'vendedor'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}>
                        {rolLabel(user.rol)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-8 py-3 sm:py-5 hidden md:table-cell text-[9px] sm:text-xs text-white/40">{user.telefono || '—'}</td>
                    <td className="px-3 sm:px-8 py-3 sm:py-5 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button onClick={() => navigate('/mensajes', { state: { para_email: user.email, para_nombre: user.nombre, asunto: '' } })} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                          <LuMail size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => eliminarUsuario(user.id)}
                          className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500 transition-colors"
                        >
                          <LuTrash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!cargando && usuariosFiltrados.length === 0 && (
          <div className="py-12 sm:py-20 text-center text-white/20 text-xs sm:text-sm">No se encontraron usuarios</div>
        )}
      </div>
    </div>
  );
}
