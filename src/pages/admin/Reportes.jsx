import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const ESTADOS = {
  pendiente:   { label: 'Pendiente',   bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  urgente:     { label: 'Urgente',     bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20' },
  revision:    { label: 'En Revisión', bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  resuelto:    { label: 'Resuelto',    bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
};

const CATEGORIAS = {
  general:   '📋 General',
  vehiculo:  '🚗 Vehículo',
  usuario:   '👤 Usuario',
  pago:      '💳 Pago',
  fraude:    '⚠️ Fraude',
};

function EstadoBadge({ estado }) {
  const s = ESTADOS[estado] || ESTADOS.pendiente;
  return (
    <span className={`${s.bg} ${s.text} border ${s.border} text-[9px] px-3 py-1 rounded-full font-black uppercase`}>
      {s.label}
    </span>
  );
}

function ModalResponder({ reporte, onClose, onEnviado }) {
  const emailAdmin = sessionStorage.getItem('usuarioEmail') || '';
  const [mensaje, setMensaje] = useState(`Hola, sobre tu reporte "${reporte.titulo}":\n\n`);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const enviar = async () => {
    setEnviando(true);
    await fetch(`${API}/api/mensajes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        de_email: emailAdmin,
        para_email: reporte.usuario_email,
        asunto: `Respuesta a tu reporte: ${reporte.titulo}`,
        cuerpo: mensaje
      })
    });
    setExito(true);
    setTimeout(() => { onEnviado(); onClose(); }, 1500);
    setEnviando(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Responder al usuario</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-1">Reporte de {reporte.usuario_nombre}</p>
          <p className="text-sm text-white/70 italic">"{reporte.titulo}"</p>
        </div>

        <textarea
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          rows={6}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-[#e7b476]/40 resize-none mb-4"
        />

        {exito && <p className="text-green-400 text-xs mb-4 font-bold">✓ Mensaje enviado correctamente</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-white/5 rounded-xl text-white/60 text-xs font-black uppercase hover:bg-white/10 transition">Cancelar</button>
          <button onClick={enviar} disabled={enviando} className="flex-2 px-8 py-3 bg-[#e7b476] rounded-xl text-black text-xs font-black uppercase hover:brightness-110 transition disabled:opacity-50">
            {enviando ? 'Enviando...' : 'Enviar respuesta'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reportes() {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [reporteResponder, setReporteResponder] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [rRes, sRes] = await Promise.all([
        fetch(`${API}/api/admin/reportes`),
        fetch(`${API}/api/admin/reportes/stats`)
      ]);
      setReportes(await rRes.json());
      setStats(await sRes.json());
    } catch {}
    finally { setCargando(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiarEstado = async (id, estado) => {
    await fetch(`${API}/api/admin/reportes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
    cargar();
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este reporte?')) return;
    await fetch(`${API}/api/admin/reportes/${id}`, { method: 'DELETE' });
    cargar();
  };

  const reportesFiltrados = filtro === 'todos' ? reportes : reportes.filter(r => r.estado === filtro);

  const formatFecha = (f) => new Date(f).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-medium tracking-tight">Centro de Reportes</h1>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',       val: stats.total,      color: 'text-white' },
            { label: 'Pendientes',  val: stats.pendientes, color: 'text-yellow-400' },
            { label: 'Urgentes',    val: stats.urgentes,   color: 'text-red-400' },
            { label: 'Resueltos',   val: stats.resueltos,  color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-white/5 rounded-2xl p-5 text-center">
              <div className={`text-3xl font-light ${s.color} mb-1`}>{s.val}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[['todos', 'Todos'], ['pendiente', 'Pendientes'], ['urgente', 'Urgentes'], ['revision', 'En Revisión'], ['resuelto', 'Resueltos']].map(([val, label]) => (
          <button key={val} onClick={() => setFiltro(val)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition ${filtro === val ? 'bg-[#e7b476]/10 text-[#e7b476] border-[#e7b476]/30' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {cargando ? (
        <div className="py-20 text-center text-white/20 text-sm">Cargando reportes...</div>
      ) : reportesFiltrados.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
          <p className="text-white/20 text-xs font-black uppercase tracking-widest">No hay reportes {filtro !== 'todos' ? `con estado "${filtro}"` : ''}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reportesFiltrados.map(r => (
            <div key={r.id} className={`bg-[#111] border rounded-2xl p-6 transition-all ${r.estado === 'urgente' ? 'border-red-500/20 hover:border-red-500/40' : 'border-white/5 hover:border-white/10'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg overflow-hidden ${r.estado === 'urgente' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/40'}`}>
                    {r.usuario_foto
                      ? <img src={r.usuario_foto} alt={r.usuario_nombre} className="w-full h-full object-cover" />
                      : r.usuario_nombre?.charAt(0).toUpperCase() || '?'
                    }
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{r.titulo}</h3>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-black mt-1">
                      {r.usuario_nombre} · {CATEGORIAS[r.categoria] || r.categoria}
                    </p>
                  </div>
                </div>
                <EstadoBadge estado={r.estado} />
              </div>

              <div className="bg-white/3 rounded-xl p-4 mb-4 border border-white/5">
                <p className="text-sm text-white/70 leading-relaxed italic">"{r.descripcion}"</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/30 text-[11px] font-bold uppercase tracking-tighter">• {formatFecha(r.fecha)}</span>

                <div className="flex gap-2 flex-wrap justify-end">
                  {/* Cambiar estado */}
                  <select
                    value={r.estado}
                    onChange={e => cambiarEstado(r.id, e.target.value)}
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-800 text-white transition cursor-pointer"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="urgente">Urgente</option>
                    <option value="revision">En Revisión</option>
                    <option value="resuelto">Resuelto</option>
                  </select>

                  <button
                    onClick={() => setReporteResponder(r)}
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white hover:bg-white/10 transition cursor-pointer">
                    ✉ Responder
                  </button>
                  <button
                    onClick={() => cambiarEstado(r.id, 'resuelto')}
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-400 text-black hover:bg-[#9aec97c2] transition cursor-pointer">
                    ✓ Resolver
                  </button>
                  <button
                    onClick={() => eliminar(r.id)}
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reporteResponder && (
        <ModalResponder
          reporte={reporteResponder}
          onClose={() => setReporteResponder(null)}
          onEnviado={cargar}
        />
      )}
    </div>
  );
}