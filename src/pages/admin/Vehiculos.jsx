import React, { useState, useEffect } from 'react';
import { LuSearch, LuCheck, LuPause, LuTrash2, LuInfo } from "react-icons/lu";

export default function Vehiculos() {
  const [autos, setAutos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  
  // ESTADO PARA EL MENSAJE DE NOTIFICACIÓN
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: '' });

  const mostrarMensaje = (msg, tipo = 'success') => {
    setNotificacion({ visible: true, mensaje: msg, tipo });
    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      setNotificacion({ visible: false, mensaje: '', tipo: '' });
    }, 3000);
  };

  const cargarAutos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/vehiculos`);
      const data = await res.json();
      setAutos(data);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAutos();
  }, []);

  const eliminarAuto = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este vehículo?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/vehiculos/${id}`, { method: 'DELETE' });
      mostrarMensaje("Vehículo eliminado correctamente", "error"); // Color rojo para eliminar
      cargarAutos();
    } catch (error) {
      mostrarMensaje("Error al eliminar", "error");
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/vehiculos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      });
      mostrarMensaje(`Estado actualizado a: ${estado}`);
      cargarAutos();
    } catch (error) {
      mostrarMensaje("Error al actualizar estado", "error");
    }
  };

  const autosFiltrados = autos.filter(a =>
    `${a.marca} ${a.modelo}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const estadoColor = (estado) => {
    if (estado === 'aprobado') return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (estado === 'pendiente') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    if (estado === 'rechazado') return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-white/5 text-white/40 border-white/10';
  };

  return (
    <div className="animate-in fade-in duration-700 relative">
      
      {/* --- COMPONENTE DE NOTIFICACIÓN FLOTANTE --- */}
      {notificacion.visible && (
        <div className={`fixed bottom-10 right-10 z-100 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right duration-300 ${
          notificacion.tipo === 'error' 
          ? 'bg-red-950 border-red-500/50 text-red-200' 
          : 'bg-[#1a1a1a] border-[#e7b476]/30 text-[#e7b476]'
        }`}>
          <div className={`p-2 rounded-full ${notificacion.tipo === 'error' ? 'bg-red-500/20' : 'bg-[#e7b476]/20'}`}>
            <LuInfo size={18} />
          </div>
          <p className="text-sm font-medium tracking-wide">{notificacion.mensaje}</p>
        </div>
      )}

      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-medium text-white">Vehículos</h1>
        <span className="text-white/20 text-sm">{autos.length} en total</span>
      </header>

      {/* Buscador */}
      <div className="relative mb-8 group">
        <input
          type="text"
          placeholder="Buscar por marca o modelo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full bg-[#111] border border-white/10 rounded-xl py-3 px-12 text-sm outline-none focus:border-[#e7b476]/40 transition-all"
        />
        <LuSearch className="absolute left-4 top-3.5 text-white/20 group-focus-within:text-[#e7b476]" size={18} />
      </div>

      {cargando ? (
        <div className="py-20 text-center text-white/20 text-sm">Cargando vehículos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {autosFiltrados.map((auto) => (
            <div key={auto.id} className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden group">
              <div className="relative h-48">
                <img
                  src={auto.photos?.[0] || 'https://via.placeholder.com/600x400?text=Sin+Foto'}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                  alt={auto.modelo}
                />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${estadoColor(auto.estado)}`}>
                  {auto.estado}
                </span>
              </div>

              <div className="p-6">
                <div className="mb-1 text-[10px] text-white/30 uppercase tracking-widest">{auto.marca}</div>
                <h4 className="font-bold text-lg text-white">{auto.modelo}</h4>
                <div className="flex gap-3 text-[11px] text-white/30 mt-1">
                  <span>{auto.anio}</span>
                  <span>·</span>
                  <span>USD$ {parseInt(auto.precio).toLocaleString()}</span>
                  <span>·</span>
                  <span>{auto.vendedor}</span>
                </div>

                <div className="flex gap-3 mt-5 border-t border-white/5 pt-4">
                  <button
                    onClick={() => cambiarEstado(auto.id, 'aprobado')}
                    title="Aprobar"
                    className="p-2 hover:bg-green-500/10 rounded-lg text-white/20 hover:text-green-500 transition-colors"
                  >
                    <LuCheck size={18} />
                  </button>
                  <button
                    onClick={() => cambiarEstado(auto.id, 'pendiente')}
                    title="Pausar"
                    className="p-2 hover:bg-yellow-500/10 rounded-lg text-white/20 hover:text-yellow-500 transition-colors"
                  >
                    <LuPause size={18} />
                  </button>
                  <button
                    onClick={() => eliminarAuto(auto.id)}
                    title="Eliminar"
                    className="p-2 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-500 transition-colors ml-auto"
                  >
                    <LuTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!cargando && autosFiltrados.length === 0 && (
        <div className="py-20 text-center text-white/20 text-sm">No se encontraron vehículos</div>
      )}
    </div>
  );
}