import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { LuInbox, LuSend, LuPencil, LuTrash2, LuX, LuCheck } from 'react-icons/lu';

const API = import.meta.env.VITE_API_URL;

const rolColor = {
  admin:     { bg: '#a78bfa15', border: '#a78bfa30', color: '#c084fc', label: 'Admin' },
  vendedor:  { bg: '#3b82f615', border: '#3b82f630', color: '#60a5fa', label: 'Vendedor' },
  comprador: { bg: '#10b98115', border: '#10b98130', color: '#34d399', label: 'Comprador' },
};

function Badge({ rol }) {
  const s = rolColor[rol] || rolColor.comprador;
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '30px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
      {s.label}
    </span>
  );
}

function Avatar({ nombre, foto, size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: '#161616', border: '1px solid #262626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: size * 0.35, fontWeight: 700, color: '#e7b476', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
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

  const inputStyle = { width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid #262626', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif', transition: 'border-color 0.2s', ':focus': { borderColor: '#e7b476' } };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#0e0e0e', border: '1px solid #222', borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '520px', color: '#fff', fontFamily: 'sans-serif', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>Redactar Mensaje</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: '50%', transition: 'background 0.2s' }}><LuX size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Destinatario</label>
            <select value={para} onChange={e => setPara(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}>
              <option value="">Selecciona un usuario de JARide...</option>
              {usuarios.map(u => (
                <option key={u.email} value={u.email} style={{ background: '#0e0e0e' }}>{u.nombre} ({u.rol}) — {u.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Asunto</label>
            <input value={asunto} onChange={e => setAsunto(e.target.value)} placeholder="¿De qué trata tu mensaje?" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mensaje</label>
            <textarea value={cuerpo} onChange={e => setCuerpo(e.target.value)} placeholder="Escribe tu mensaje aquí detalladamente..." rows={5}
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />
          </div>
          <button onClick={enviar} disabled={enviando || !para || !asunto || !cuerpo}
            style={{ padding: '14px', background: exito ? '#10b981' : (!para || !asunto || !cuerpo) ? '#181818' : '#e7b476', border: 'none', borderRadius: '12px', color: exito ? '#fff' : (!para || !asunto || !cuerpo) ? '#555' : '#000', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', marginTop: '8px', boxShadow: exito ? '0 4px 20px rgba(16,185,129,0.3)' : (!para || !asunto || !cuerpo) ? 'none' : '0 4px 20px rgba(231,180,118,0.2)' }}>
            {exito ? <><LuCheck size={16} /> ¡Mensaje Enviado!</> : enviando ? 'Transmitiendo...' : <><LuSend size={16} /> Enviar Mensaje</>}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={onVolver} style={{ background: 'none', border: '1px solid #222', borderRadius: '10px', padding: '8px 16px', color: '#aaa', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'sans-serif', transition: 'all 0.2s' }}>← Volver</button>
        <button onClick={onEliminar} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '8px 16px', color: '#f87171', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'sans-serif', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
          <LuTrash2 size={14} /> Eliminar conversación
        </button>
      </div>
      <div style={{ background: '#0e0e0e', border: '1px solid #1c1c1c', borderRadius: '20px', padding: '36px', flex: 1, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{mensaje.asunto}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #1a1a1a' }}>
          <Avatar nombre={nombre} foto={foto} size={48} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{nombre || 'Usuario Anónimo'}</span>
              <Badge rol={rol} />
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', fontWeight: 400 }}>{fecha}</div>
          </div>
        </div>
        <p style={{ fontSize: '15px', color: '#dcdcdc', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'sans-serif', fontVariantLigatures: 'common-ligatures' }}>{mensaje.cuerpo}</p>
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
    <div style={{ background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingTop: '40px' }}>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em' }}>Bandeja de Entrada</h1>
            <p style={{ fontSize: '14px', color: '#666', margin: 0, fontWeight: 400 }}>Gestiona tus conversaciones y transacciones en JARide</p>
          </div>
          <button onClick={() => setModalNuevo(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e7b476', color: '#000', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(231,180,118,0.25)' }}>
            <LuPencil size={15} /> Nuevo mensaje
          </button>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>

          {/* MENÚ LATERAL */}
          <div style={{ width: '300px', flexShrink: 0 }}>
            <div style={{ background: '#0e0e0e', border: '1px solid #1c1c1c', borderRadius: '16px', overflow: 'hidden', padding: '6px', marginBottom: '16px' }}>
              {[
                { id: 'recibidos', label: 'Mensajes Recibidos', icon: <LuInbox size={16} /> },
                { id: 'enviados',  label: 'Mensajes Enviados',  icon: <LuSend size={16} /> },
              ].map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setSeleccionado(null); }}
                  style={{ width: '100%', padding: '12px 14px', background: tab === t.id ? '#161616' : 'none', border: 'none', borderRadius: '10px', color: tab === t.id ? '#e7b476' : '#888', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'sans-serif', transition: 'all 0.2s' }}>
                  {t.icon} <span style={{ flex: 1, textAlign: 'left' }}>{t.label}</span>
                  {t.id === 'recibidos' && noLeidos > 0 && (
                    <span style={{ background: '#e7b476', color: '#000', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(231,180,118,0.3)' }}>{noLeidos}</span>
                  )}
                </button>
              ))}
            </div>

            {/* LISTADO DE MENSAJES */}
            <div style={{ background: '#0e0e0e', border: '1px solid #1c1c1c', borderRadius: '16px', overflow: 'hidden', maxHeight: '600px', overflowY: 'auto' }}>
              {cargando ? (
                <div style={{ padding: '40px 24px', textAlign: 'center', color: '#555', fontSize: '13px', fontWeight: 500 }}>Sincronizando...</div>
              ) : mensajes.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: '#555', fontSize: '13px', lineHeight: 1.5 }}>
                  {tab === 'recibidos' ? 'No tienes correspondencia recibida por el momento.' : 'Aún no has enviado ningún mensaje.'}
                </div>
              ) : mensajes.map((m, i) => {
                const nombre = tab === 'recibidos' ? m.de_nombre : m.para_nombre;
                const foto   = tab === 'recibidos' ? m.de_foto   : m.para_foto;
                const activo  = seleccionado?.id === m.id;
                const noLeido = tab === 'recibidos' && !m.leido;
                return (
                  <div key={m.id} onClick={() => abrirMensaje(m)}
                    style={{ padding: '16px', borderBottom: i < mensajes.length - 1 ? '1px solid #161616' : 'none', cursor: 'pointer', background: activo ? '#141414' : 'transparent', borderLeft: noLeido ? '3px solid #e7b476' : '3px solid transparent', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                      <Avatar nombre={nombre} foto={foto} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px',尊fontStyle: 'normal', fontWeight: noLeido ? 700 : 500, color: noLeido ? '#fff' : '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre || 'Usuario'}</span>
                          <span style={{ fontSize: '11px', color: '#555', flexShrink: 0, marginLeft: '8px', fontWeight: 500 }}>{formatFecha(m.fecha)}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: noLeido ? '#dcdcdc' : '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: noLeido ? 600 : 400 }}>
                          {m.asunto}
                        </div>
                      </div>
                      {noLeido && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e7b476', flexShrink: 0, marginTop: '6px', boxShadow: '0 0 10px #e7b476' }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL DE LECTURA */}
          {seleccionado ? (
            <DetalleMensaje
              mensaje={seleccionado}
              tipo={tab}
              onVolver={() => setSeleccionado(null)}
              onEliminar={() => eliminarMensaje(seleccionado.id)}
            />
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e0e', border: '1px solid #1c1c1c', borderRadius: '20px', minHeight: '480px', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.4)' }}>
              <div style={{ textAlign: 'center', color: '#444' }}>
                <LuInbox size={48} style={{ marginBottom: '16px', opacity: 0.2, color: '#e7b476' }} />
                <p style={{ fontSize: '14px', margin: 0, fontWeight: 500, color: '#666' }}>Lector de Mensajes</p>
                <p style={{ fontSize: '12px', margin: '6px 0 0', color: '#444' }}>Selecciona una conversación del menú para desplegar su contenido</p>
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
  );
}