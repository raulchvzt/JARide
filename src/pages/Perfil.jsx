import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import AnimacionPagina from '../components/AnimacionPagina';

const API = import.meta.env.VITE_API_URL;

// ------------------------------------------------------------------
// COMPONENTE: Mis Publicaciones (Rediseñado como rejilla estética)
// ------------------------------------------------------------------
function MisPublicaciones({ email, navigate }) {
  const [autos, setAutos] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);

  React.useEffect(() => {
    if (!email) return;
    fetch(`${API}/api/autos`)
      .then(r => r.json())
      .then(data => {
        const mios = data.filter(a => a.vendedor_email === email);
        setAutos(mios);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [email]);

  const estadoColor = {
    aprobado:  { color: '#22c55e', bg: '#22c55e10', label: 'Aprobado' },
    pendiente: { color: '#f59e0b', bg: '#f59e0b10', label: 'Pendiente' },
    rechazado: { color: '#ef4444', bg: '#ef444410', label: 'Rechazado' },
  };

  return (
    
    <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '24px', padding: '32px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Mis publicaciones</h2>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Autos activos en el catálogo de JARide</p>
        </div>
        <button onClick={() => navigate('/vender')}
          style={{ background: '#f1c98a', border: 'none', borderRadius: '12px', padding: '10px 18px', color: '#000', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif', transition: 'transform 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          + Publicar auto
        </button>
      </div>

      {cargando ? (
        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>Cargando tus vehículos...</p>
      ) : autos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed #222', borderRadius: '16px' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>No has publicado ningún auto aún</p>
          <button onClick={() => navigate('/vender')}
            style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '10px 24px', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', fontFamily: 'sans-serif' }}>
            Publicar mi primer auto
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100%, 1fr))', gap: '12px' }}>
          {autos.map(a => {
            const s = estadoColor[a.estado] || estadoColor.pendiente;
            return (
              <div key={a.id} onClick={() => navigate(`/auto/${a.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: '#161616', border: '1px solid #222', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = '#1a1a1a'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.background = '#161616'; }}
              >
                <div style={{ width: '70px', height: '50px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#222' }}>
                  {a.photos?.[0]
                    ? <img src={a.photos[0]} alt={a.modelo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🚗</div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.marca} {a.modelo}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {a.anio} · {parseInt(a.km).toLocaleString()} km · <span style={{ color: '#f1c98a', fontWeight: 600 }}>USD$ {parseInt(a.precio).toLocaleString()}</span>
                  </div>
                </div>
                <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}25`, fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '30px', textTransform: 'uppercase', flexShrink: 0 }}>
                  {s.label}
                </span>
                <span style={{ color: '#4b5563', fontSize: '18px', flexShrink: 0, marginLeft: '4px' }}>›</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const ESTADO_COLOR = {
  pendiente: { color: '#f59e0b', bg: '#f59e0b10', label: 'Pendiente' },
  urgente:   { color: '#ef4444', bg: '#ef444410', label: 'Urgente' },
  revision:  { color: '#3b82f6', bg: '#3b82f610', label: 'En Revisión' },
  resuelto:  { color: '#22c55e', bg: '#22c55e10', label: 'Resuelto' },
};

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL: Perfil (Dashboard Modular de 2 Columnas)
// ------------------------------------------------------------------
export default function Perfil() {
  const navigate = useNavigate();
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [rol, setRol] = useState('');
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Modales states
  const [modalPassword, setModalPassword] = useState(false);
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirmar, setPassConfirmar] = useState('');
  const [passError, setPassError] = useState('');
  const [passExito, setPassExito] = useState(false);

  const [modalEliminar, setModalEliminar] = useState(false);

  const [dosPasos, setDosPasos] = useState(false);
  const [modal2FA, setModal2FA] = useState(false);
  const [codigo2FA, setCodigo2FA] = useState('');
  const [accion2FA, setAccion2FA] = useState('activar');
  const [enviando2FA, setEnviando2FA] = useState(false);
  const [error2FA, setError2FA] = useState('');
  const [exito2FA, setExito2FA] = useState(false);

  const [misReportes, setMisReportes] = useState([]);
  const [cargandoReportes, setCargandoReportes] = useState(false);

  const fileRef = useRef(null);

  useEffect(() => {
    const emailGuardado = localStorage.getItem('usuarioEmail');
    if (!emailGuardado) { setCargando(false); return; }

    fetch(`${API}/api/usuario/perfil?email=${emailGuardado}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setNombre(data.nombre || '');
          setEmail(data.email || '');
          setTelefono(data.telefono || '');
          setUbicacion(data.direccion || '');
          setFoto(data.fotoPerfil || null);
          setRol(data.rol || 'comprador');
          fetch(`${API}/api/usuario/2fa/estado?email=${emailGuardado}`)
            .then(r => r.json()).then(d => { if (d.success) setDosPasos(d.activado); });
        }
      })
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setCargando(false));

    setCargandoReportes(true);
    fetch(`${API}/api/reportes/mis-reportes?email=${emailGuardado}`)
      .then(r => r.json()).then(setMisReportes).catch(() => {})
      .finally(() => setCargandoReportes(false));
  }, []);

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    const res = await fetch(`${API}/api/subir-foto`, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) setFoto(data.url);
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`${API}/api/usuario/perfil`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre, telefono, direccion: ubicacion, fotoPerfil: foto })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('usuarioNombre', nombre);
        localStorage.setItem('usuarioFoto', foto || '');
        setEditando(false);
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
      }
    } catch { setError('Error al guardar los cambios'); }
  };

  const handleCambiarPassword = async () => {
    setPassError('');
    if (passNueva !== passConfirmar) return setPassError('Las contraseñas no coinciden');
    if (passNueva.length < 6) return setPassError('Mínimo 6 caracteres');
    const res = await fetch(`${API}/api/usuario/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passwordActual: passActual, passwordNuevo: passNueva })
    });
    const data = await res.json();
    if (data.success) {
      setPassExito(true);
      setPassActual(''); setPassNueva(''); setPassConfirmar('');
      setTimeout(() => { setPassExito(false); setModalPassword(false); }, 2000);
    } else { setPassError(data.message || 'Error al cambiar contraseña'); }
  };

  const handleToggle2FA = async () => {
    setError2FA('');
    setEnviando2FA(true);
    setAccion2FA(dosPasos ? 'desactivar' : 'activar');
    try {
      const res = await fetch(`${API}/api/usuario/2fa/enviar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) setModal2FA(true);
      else setError2FA(data.message || 'Error al enviar el código');
    } catch { setError2FA('Error de conexión'); }
    finally { setEnviando2FA(false); }
  };

  const handleVerificar2FA = async () => {
    setError2FA('');
    const res = await fetch(`${API}/api/usuario/2fa/verificar`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo: codigo2FA, activar: accion2FA === 'activar' })
    });
    const data = await res.json();
    if (data.success) {
      setDosPasos(accion2FA === 'activar');
      setExito2FA(true);
      setCodigo2FA('');
      setTimeout(() => { setExito2FA(false); setModal2FA(false); }, 2000);
    } else { setError2FA(data.message || 'Código incorrecto'); }
  };

  const handleEliminarCuenta = async () => {
    await fetch(`${API}/api/usuario/cuenta`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    localStorage.clear();
    window.location.href = '/';
  };

  const inputStyle = (activo) => ({
    width: '100%', padding: '14px 16px',
    background: activo ? '#161616' : '#0e0e0e',
    border: activo ? '1px solid #f1c98a' : '1px solid #222',
    borderRadius: '12px', color: activo ? '#fff' : '#888',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'sans-serif', cursor: activo ? 'text' : 'default', 
    transition: 'all 0.2s',
  });

  const rolLabel = { admin: 'Administrador', vendedor: 'Vendedor', comprador: 'Comprador' };

  if (cargando) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <p style={{ color: '#6b7280', fontSize: '14px', fontFamily: 'sans-serif' }}>Cargando perfil de usuario...</p>
    </div>
  );

  return (
     <AnimacionPagina>
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingBottom: '80px' }}>
      <Navbar />

      {/* CONTENEDOR GRID DE DOS COLUMNAS */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '120px 20px 40px 20px', 
        display: 'grid', 
        gridTemplateColumns: '320px 1fr', 
        gap: '40px',
        alignItems: 'flex-start'
      }}>
        
        {/* ================= COLUMNA IZQUIERDA (SIDEBAR DE PERFIL) ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '120px' }}>
          
          {/* Tarjeta de Identidad Principal */}
          <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '24px', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #f1c98a', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}>
                {foto ? <img src={foto} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '42px', fontWeight: 800, color: '#f1c98a' }}>{nombre.charAt(0).toUpperCase()}</span>}
              </div>
              <button onClick={() => fileRef.current.click()} style={{ position: 'absolute', bottom: '4px', right: '4px', width: '32px', height: '32px', borderRadius: '50%', background: '#f1c98a', border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>✎</button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>{nombre}</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px 0', wordBreak: 'break-all', width: '100%' }}>{email}</p>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '100%' }}>
              <span style={{ background: '#22c55e10', border: '1px solid #22c55e30', color: '#22c55e', fontSize: '11px', fontWeight: 600, padding: '5px 12px', borderRadius: '30px' }}>✓ Verificado</span>
              <span style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#9ca3af', fontSize: '11px', padding: '5px 12px', borderRadius: '30px', fontWeight: 500 }}>{rolLabel[rol] || 'Comprador'}</span>
            </div>

            <button onClick={() => editando ? handleGuardar() : setEditando(true)}
              style={{ width: '100%', marginTop: '24px', padding: '12px', borderRadius: '12px', border: 'none', background: editando ? '#f1c98a' : '#1a1a1a', color: editando ? '#000' : '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
              {editando ? '✓ Guardar Cambios' : '✎ Editar perfil'}
            </button>
          </div>

          {/* Tarjeta de Atajos Rápidos de Seguridad */}
          <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setModalPassword(true)} style={{ width: '100%', background: '#161616', border: '1px solid #222', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '13px', textAlign: 'left', cursor: 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🔒 Cambiar Contraseña</span>
              <span style={{ color: '#4b5563' }}>›</span>
            </button>
            <button onClick={handleToggle2FA} disabled={enviando2FA} style={{ width: '100%', background: dosPasos ? '#ef444405' : '#161616', border: `1px solid ${dosPasos ? '#ef444420' : '#222'}`, borderRadius: '12px', padding: '12px 16px', color: dosPasos ? '#ef4444' : '#fff', fontSize: '13px', textAlign: 'left', cursor: 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🛡️ 2FA: {dosPasos ? 'Desactivar' : 'Activar'}</span>
              <span style={{ color: '#4b5563' }}>›</span>
            </button>
          </div>
        </div>

        {/* ================= COLUMNA DERECHA (CONTENIDO DINÁMICO) ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Alertas de Notificación Globales */}
          {guardado && <div style={{ background: '#16a34a15', border: '1px solid #16a34a30', borderRadius: '16px', padding: '16px', fontSize: '14px', color: '#4ade80' }}>✓ Tus datos de perfil se actualizaron con éxito de forma local.</div>}
          {error && <div style={{ background: '#ef444415', border: '1px solid #ef444430', borderRadius: '16px', padding: '16px', fontSize: '14px', color: '#ef4444' }}>⚠️ {error}</div>}

          {/* Bloque 1: Información Personal (Inputs estilizados) */}
          <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '24px', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>Información personal</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 28px 0' }}>Datos generales guardados de tu cuenta de cliente</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                ['Nombre completo', nombre, setNombre], 
                ['Teléfono celular', telefono, setTelefono], 
                ['Ubicación / Dirección', ubicacion, setUbicacion]
              ].map(([label, val, setter], i) => (
                <div key={i} style={{ gridColumn: i === 2 ? '1 / -1' : 'auto' }}>
                  <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', fontWeight: 600 }}>{label}</label>
                  <input value={val} onChange={e => setter(e.target.value)} disabled={!editando} style={inputStyle(editando)} />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Correo electrónico (No modificable)</label>
                <input value={email} disabled style={inputStyle(false)} />
              </div>
            </div>
          </div>

          {/* Bloque 2: Reportes de Soporte */}
          <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>Mis reportes de soporte</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Historial de tickets abiertos para asistencia</p>
              </div>
              <button onClick={() => navigate('/reportes')}
                style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '10px 18px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>
                + Nuevo reporte
              </button>
            </div>

            {cargandoReportes ? (
              <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>Buscando reportes...</p>
            ) : misReportes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', border: '2px dashed #222', borderRadius: '16px' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>No tienes tickets de soporte registrados</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {misReportes.slice(0, 5).map(r => {
                  const s = ESTADO_COLOR[r.estado] || ESTADO_COLOR.pendiente;
                  return (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#161616', border: '1px solid #222', borderRadius: '14px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>{r.titulo}</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>
                          Enviado el {new Date(r.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}20`, fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '30px', textTransform: 'uppercase', flexShrink: 0, marginLeft: '12px' }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
                {misReportes.length > 5 && (
                  <button onClick={() => navigate('/reportes')} style={{ background: 'none', border: 'none', color: '#f1c98a', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '8px 0', textAlign: 'left', fontFamily: 'sans-serif' }}>
                    Ver todos los reportes ({misReportes.length}) →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bloque 3: Módulo de publicaciones condicional*/}
          {(rol === 'vendedor' || rol === 'admin') && (
            <MisPublicaciones email={email} navigate={navigate} />
          )}

          {/* Bloque 4: Zona de peligro */}
          <div style={{ background: '#111', border: '1px solid #ef444420', borderRadius: '24px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: '#ef4444' }}>Desactivar o eliminar cuenta</h4>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, maxWidth: '500px', lineHeight: 1.5 }}>Esta acción removerá de forma definitiva tu historial de publicaciones, accesos y configuraciones en JARide.</p>
            </div>
            <button onClick={() => setModalEliminar(true)}
              style={{ background: '#ef444410', border: '1px solid #ef444430', borderRadius: '12px', padding: '12px 24px', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 700, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ef444410'; e.currentTarget.style.color = '#ef4444'; }}>
              Eliminar cuenta
            </button>
          </div>
        </div>

      </div>

      {/* ================= MODALES ================= */}
      {modalPassword && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000e6', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px 0', letterSpacing: '-0.3px' }}>Cambiar contraseña</h3>
            {['Contraseña actual', 'Nueva contraseña', 'Confirmar nueva contraseña'].map((label, i) => (
              <div key={i} style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', fontWeight: 600 }}>{label}</label>
                <input type="password" value={[passActual, passNueva, passConfirmar][i]} onChange={e => [setPassActual, setPassNueva, setPassConfirmar][i](e.target.value)} style={inputStyle(true)} />
              </div>
            ))}
            {passError && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '14px' }}>⚠️ {passError}</p>}
            {passExito && <p style={{ color: '#4ade80', fontSize: '12px', marginBottom: '14px' }}>✓ Contraseña actualizada correctamente</p>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button onClick={() => { setModalPassword(false); setPassError(''); }} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 600 }}>Cancelar</button>
              <button onClick={handleCambiarPassword} style={{ flex: 1, padding: '12px', background: '#f1c98a', border: 'none', borderRadius: '12px', color: '#000', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>Actualizar</button>
            </div>
          </div>
        </div>
      )}

      {modal2FA && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000e6', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>{accion2FA === 'activar' ? 'Activar seguridad' : 'Desactivar seguridad'}</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 24px 0', lineHeight: 1.6 }}>
              Te enviamos un código a <strong style={{ color: '#f1c98a' }}>{email}</strong>. Ingrésalo para verificar tu identidad.
            </p>
            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Código Token de 6 dígitos</label>
            <input type="text" maxLength={6} value={codigo2FA} onChange={e => setCodigo2FA(e.target.value.replace(/\D/g, ''))} placeholder="000000"
              style={{ ...inputStyle(true), fontSize: '28px', fontWeight: 800, letterSpacing: '8px', textAlign: 'center', marginBottom: '16px', background: '#050505' }} />
            {error2FA && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '14px' }}>⚠️ {error2FA}</p>}
            {exito2FA && <p style={{ color: '#4ade80', fontSize: '12px', marginBottom: '14px' }}>✓ Estado 2FA modificado</p>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => { setModal2FA(false); setCodigo2FA(''); setError2FA(''); }} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 600 }}>Cancelar</button>
              <button onClick={handleVerificar2FA} disabled={codigo2FA.length !== 6}
                style={{ flex: 1, padding: '12px', background: codigo2FA.length === 6 ? '#f1c98a' : '#1a1a1a', border: 'none', borderRadius: '12px', color: codigo2FA.length === 6 ? '#000' : '#4b5563', fontSize: '13px', fontWeight: 700, cursor: codigo2FA.length === 6 ? 'pointer' : 'default', fontFamily: 'sans-serif' }}>
                Verificar Token
              </button>
            </div>
          </div>
        </div>
      )}

      {modalEliminar && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000e6', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#111', border: '1px solid #ef444430', borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px 0', color: '#ef4444', letterSpacing: '-0.3px' }}>¿Confirmas eliminar cuenta?</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px 0', lineHeight: 1.6 }}>Esta acción borrará de manera irreversible todos tus registros en el servidor. No podrás restaurar esta información después.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setModalEliminar(false)} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 600 }}>Cancelar</button>
              <button onClick={handleEliminarCuenta} style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>Eliminar Definitivamente</button>
            </div>
          </div>
        </div>
      )}
    </div>
     </AnimacionPagina>
  );
}