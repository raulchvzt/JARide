import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { LuInbox, LuSend, LuPencil, LuTrash2, LuX, LuCheck } from 'react-icons/lu';
import AnimacionPagina from '../components/AnimacionPagina';

const API = import.meta.env.VITE_API_URL;

const rolColor = {
  admin:     { bg: '#a78bfa20', border: '#a78bfa40', color: '#a78bfa', label: 'Admin' },
  vendedor:  { bg: '#60a5fa20', border: '#60a5fa40', color: '#60a5fa', label: 'Vendedor' },
  comprador: { bg: '#34d39920', border: '#34d39940', color: '#34d399', label: 'Comprador' },
};

function Badge({ rol }) {
  const s = rolColor[rol] || rolColor.comprador;
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
      {s.label}
    </span>
  );
}

function Avatar({ nombre, foto, size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: size * 0.35, fontWeight: 700, color: '#f1c98a' }}>
      {foto ? <img src={foto} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : nombre?.charAt(0).toUpperCase()}
    </div>
  );
}

// ------------------------------------------------------------------
// MODAL: Nuevo mensaje
// ------------------------------------------------------------------
function ModalNuevoMensaje({ emailActual, onClose, onEnviado, destinatarioInicial }) {
  const [usuarios, setUsuarios] = useState([]);
  const [para, setPara] = useState(destinatarioInicial?.para_email || '');
  const [asunto, setAsunto] = useState(destinatarioInicial?.asunto || '');
  const [cuerpo, setCuerpo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/usuarios/lista?email=${emailActual}`)
      .then(r => r.json()).then(setUsuarios).catch(() => {});
  }, [emailActual]);

  const enviar = async () => {
    if (!para || !asunto || !cuerpo) return;
    setEnviando(true);
    await fetch(`${API}/api/mensajes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ de_email: emailActual, para_email: para, asunto, cuerpo })
    });
    setExito(true);
    setTimeout(() => { onEnviado(); onClose(); }, 1200);
    setEnviando(false);
  };

  const inputStyle = { width: '100%', padding: '10px 14px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif' };

  return (
   
    <div style={{ position: 'fixed', inset: 0, background: '#000000cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Nuevo mensaje</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex' }}><LuX size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Para</label>
            <select value={para} onChange={e => setPara(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Selecciona un destinatario...</option>
              {usuarios.map(u => (
                <option key={u.email} value={u.email}>{u.nombre} ({u.rol}) — {u.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Asunto</label>
            <input value={asunto} onChange={e => setAsunto(e.target.value)} placeholder="Escribe el asunto..." style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Mensaje</label>
            <textarea value={cuerpo} onChange={e => setCuerpo(e.target.value)} placeholder="Escribe tu mensaje..." rows={5}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
          <button onClick={enviar} disabled={enviando || !para || !asunto || !cuerpo}
            style={{ padding: '12px', background: exito ? '#16a34a' : (!para || !asunto || !cuerpo) ? '#1a1a1a' : '#f1c98a', border: 'none', borderRadius: '10px', color: exito ? '#fff' : '#000', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {exito ? <><LuCheck size={16} /> Enviado</> : enviando ? 'Enviando...' : <><LuSend size={16} /> Enviar mensaje</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// DETALLE DE MENSAJE
// ------------------------------------------------------------------
function DetalleMensaje({ mensaje, tipo, onEliminar, onVolver }) {
  const esRecibido = tipo === 'recibidos';
  const nombre = esRecibido ? mensaje.de_nombre : mensaje.para_nombre;
  const foto   = esRecibido ? mensaje.de_foto   : mensaje.para_foto;
  const rol    = esRecibido ? mensaje.de_rol    : mensaje.para_rol;
  const fecha  = new Date(mensaje.fecha).toLocaleString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onVolver} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '6px 14px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif' }}>← Volver</button>
        <button onClick={onEliminar} style={{ background: 'none', border: '1px solid #ef444440', borderRadius: '8px', padding: '6px 14px', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LuTrash2 size={14} /> Eliminar
        </button>
      </div>
      <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '28px', flex: 1 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px', color: '#fff' }}>{mensaje.asunto}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #1f1f1f' }}>
          <Avatar nombre={nombre} foto={foto} size={44} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{nombre || 'Usuario'}</span>
              <Badge rol={rol} />
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{fecha}</div>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>{mensaje.cuerpo}</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// PÁGINA PRINCIPAL
// ------------------------------------------------------------------
export default function Mensajes() {
  const emailActual = sessionStorage.getItem('usuarioEmail') || '';
  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const estadoNav = location.state || {};
  const [tab, setTab] = useState('recibidos');
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [destinatarioInicial, setDestinatarioInicial] = useState(null);
  const [noLeidos, setNoLeidos] = useState(0);

  const cargarNoLeidos = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/mensajes/no-leidos?email=${emailActual}`);
      const data = await res.json();
      setNoLeidos(data.total);
    } catch { /* empty */ }
  }, [emailActual]);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API}/api/mensajes/${tab}?email=${emailActual}`);
      const data = await res.json();
      setMensajes(data);
    } catch { setMensajes([]); }
    finally { setCargando(false); }
  }, [tab, emailActual]);

  useEffect(() => {
    cargar();
    cargarNoLeidos();
  }, [cargar, cargarNoLeidos]);

  // Si viene de DetallesCompra, abrir modal con destinatario prellenado
  useEffect(() => {
    if (estadoNav.para_email) {
      setDestinatarioInicial(estadoNav);
      setModalNuevo(true);
    }
  }, [estadoNav]);

  const abrirMensaje = async (m) => {
    setSeleccionado(m);
    if (tab === 'recibidos' && !m.leido) {
      await fetch(`${API}/api/mensajes/${m.id}/leer`, { method: 'PATCH' });
      cargarNoLeidos();
      setMensajes(prev => prev.map(x => x.id === m.id ? { ...x, leido: 1 } : x));
    }
  };

  const eliminarMensaje = async (id) => {
    await fetch(`${API}/api/mensajes/${id}`, { method: 'DELETE' });
    setSeleccionado(null);
    cargar();
  };

  const formatFecha = (f) => {
    const d = new Date(f);
    const hoy = new Date();
    if (d.toDateString() === hoy.toDateString()) return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  return (
    <AnimacionPagina>
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingTop: '56px' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px' }}>Mensajes</h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Comunicación interna de JARide</p>
          </div>
          <button onClick={() => setModalNuevo(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1c98a', color: '#000', border: 'none', borderRadius: '12px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            <LuPencil size={16} /> Nuevo mensaje
          </button>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>

          {/* SIDEBAR */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }}>
              {[
                { id: 'recibidos', label: 'Recibidos', icon: <LuInbox size={15} /> },
                { id: 'enviados',  label: 'Enviados',  icon: <LuSend size={15} /> },
              ].map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setSeleccionado(null); }}
                  style={{ width: '100%', padding: '14px 16px', background: tab === t.id ? '#1a1a1a' : 'none', border: 'none', borderBottom: '1px solid #1f1f1f', color: tab === t.id ? '#f1c98a' : '#9ca3af', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'sans-serif' }}>
                  {t.icon} {t.label}
                  {t.id === 'recibidos' && noLeidos > 0 && (
                    <span style={{ marginLeft: 'auto', background: '#f1c98a', color: '#000', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '20px' }}>{noLeidos}</span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '14px', overflow: 'hidden' }}>
              {cargando ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>Cargando...</div>
              ) : mensajes.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                  {tab === 'recibidos' ? 'No tienes mensajes recibidos' : 'No has enviado mensajes'}
                </div>
              ) : mensajes.map((m, i) => {
                const nombre = tab === 'recibidos' ? m.de_nombre : m.para_nombre;
                const foto   = tab === 'recibidos' ? m.de_foto   : m.para_foto;
                const activo  = seleccionado?.id === m.id;
                const noLeido = tab === 'recibidos' && !m.leido;
                return (
                  <div key={m.id} onClick={() => abrirMensaje(m)}
                    style={{ padding: '14px 16px', borderBottom: i < mensajes.length - 1 ? '1px solid #1f1f1f' : 'none', cursor: 'pointer', background: activo ? '#1a1a1a' : 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar nombre={nombre} foto={foto} size={34} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: noLeido ? 700 : 500, color: noLeido ? '#fff' : '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre || 'Usuario'}</span>
                          <span style={{ fontSize: '10px', color: '#6b7280', flexShrink: 0, marginLeft: '8px' }}>{formatFecha(m.fecha)}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: noLeido ? '#d1d5db' : '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px', fontWeight: noLeido ? 600 : 400 }}>
                          {m.asunto}
                        </div>
                      </div>
                      {noLeido && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f1c98a', flexShrink: 0 }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL DERECHO */}
          {seleccionado ? (
            <DetalleMensaje
              mensaje={seleccionado}
              tipo={tab}
              onVolver={() => setSeleccionado(null)}
              onEliminar={() => eliminarMensaje(seleccionado.id)}
            />
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', minHeight: '400px' }}>
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                <LuInbox size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <p style={{ fontSize: '14px', margin: 0 }}>Selecciona un mensaje para leerlo</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalNuevo && (
        <ModalNuevoMensaje
          emailActual={emailActual}
          destinatarioInicial={destinatarioInicial}
          onClose={() => { setModalNuevo(false); setDestinatarioInicial(null); }}
          onEnviado={() => { cargar(); cargarNoLeidos(); }}
        />
      )}
    </div>
    </AnimacionPagina>
  );
}