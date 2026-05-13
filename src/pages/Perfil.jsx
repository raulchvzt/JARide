import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function Perfil() {
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

  // Modal cambiar contraseña
  const [modalPassword, setModalPassword] = useState(false);
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirmar, setPassConfirmar] = useState('');
  const [passError, setPassError] = useState('');
  const [passExito, setPassExito] = useState(false);

  // Modal eliminar cuenta
  const [modalEliminar, setModalEliminar] = useState(false);

  // 2FA
  const [dosPasos, setDosPasos] = useState(false);
  const [modal2FA, setModal2FA] = useState(false);
  const [codigo2FA, setCodigo2FA] = useState('');
  const [accion2FA, setAccion2FA] = useState('activar'); // 'activar' o 'desactivar'
  const [enviando2FA, setEnviando2FA] = useState(false);
  const [error2FA, setError2FA] = useState('');
  const [exito2FA, setExito2FA] = useState(false);

  const fileRef = useRef(null);

  // Cargar datos del usuario al montar
  useEffect(() => {
    const emailGuardado = localStorage.getItem('usuarioEmail');
    if (!emailGuardado) { setCargando(false); return; }

    fetch(`${import.meta.env.VITE_API_URL}/api/usuario/perfil?email=${emailGuardado}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setNombre(data.nombre || '');
          setEmail(data.email || '');
          setTelefono(data.telefono || '');
          setUbicacion(data.direccion || '');
          setFoto(data.fotoPerfil || null);
          setRol(data.rol || 'comprador');
        // Cargar estado 2FA
        fetch(`${import.meta.env.VITE_API_URL}/api/usuario/2fa/estado?email=${emailGuardado}`)
          .then(r => r.json())
          .then(d => { if (d.success) setDosPasos(d.activado); });
        }
      })
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setCargando(false));
  }, []);

  // Subir foto al servidor
  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subir-foto`, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) setFoto(data.url);
  };

  // Guardar cambios
  const handleGuardar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/perfil`, {
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
    } catch {
      setError('Error al guardar los cambios');
    }
  };

  // Cambiar contraseña
  const handleCambiarPassword = async () => {
    setPassError('');
    if (passNueva !== passConfirmar) return setPassError('Las contraseñas no coinciden');
    if (passNueva.length < 6) return setPassError('Mínimo 6 caracteres');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passwordActual: passActual, passwordNuevo: passNueva })
    });
    const data = await res.json();
    if (data.success) {
      setPassExito(true);
      setPassActual(''); setPassNueva(''); setPassConfirmar('');
      setTimeout(() => { setPassExito(false); setModalPassword(false); }, 2000);
    } else {
      setPassError(data.message || 'Error al cambiar contraseña');
    }
  };

  // Activar/desactivar 2FA
  const handleToggle2FA = async () => {
    setError2FA('');
    setEnviando2FA(true);
    setAccion2FA(dosPasos ? 'desactivar' : 'activar');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/2fa/enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/2fa/verificar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo: codigo2FA, activar: accion2FA === 'activar' })
    });
    const data = await res.json();
    if (data.success) {
      setDosPasos(accion2FA === 'activar');
      setExito2FA(true);
      setCodigo2FA('');
      setTimeout(() => { setExito2FA(false); setModal2FA(false); }, 2000);
    } else {
      setError2FA(data.message || 'Código incorrecto');
    }
  };

  // Eliminar cuenta
  const handleEliminarCuenta = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/cuenta`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    localStorage.clear();
    window.location.href = '/';
  };

  const inputStyle = (activo) => ({
    width: '100%', padding: '12px 14px',
    background: activo ? '#1a1a1a' : '#111',
    border: activo ? '1px solid #f1c98a' : '1px solid #2a2a2a',
    borderRadius: '10px', color: activo ? '#fff' : '#9ca3af',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'sans-serif', cursor: activo ? 'text' : 'default', transition: 'all 0.2s',
  });

  const rolLabel = { admin: 'Administrador', vendedor: 'Vendedor', comprador: 'Comprador' };

  if (cargando) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <p style={{ color: '#6b7280', fontSize: '14px' }}>Cargando perfil...</p>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingTop: '56px' }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Mi perfil</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Administra tu información personal y preferencias</p>
        </div>

        {/* Tarjeta foto */}
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '32px', display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '24px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #f1c98a', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {foto
                ? <img src={foto} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '36px', fontWeight: 800, color: '#f1c98a' }}>{nombre.charAt(0).toUpperCase()}</span>
              }
            </div>
            <button onClick={() => fileRef.current.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: '30px', height: '30px', borderRadius: '50%', background: '#f1c98a', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{nombre}</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{email}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: '#f1c98a20', border: '1px solid #f1c98a40', color: '#f1c98a', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' }}>✓ Verificado</span>
              <span style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#9ca3af', fontSize: '11px', padding: '4px 12px', borderRadius: '20px' }}>{rolLabel[rol] || 'Comprador'}</span>
            </div>
          </div>

          {/* Botón editar/guardar */}
          <button
            onClick={() => editando ? handleGuardar() : setEditando(true)}
            style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: editando ? '#f1c98a' : '#1a1a1a', color: editando ? '#000' : '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
          >
            {editando ? '✓ Guardar' : '✎ Editar perfil'}
          </button>
        </div>

        {/* Toast guardado */}
        {guardado && (
          <div style={{ background: '#16a34a20', border: '1px solid #16a34a40', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#4ade80', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✓ Perfil actualizado correctamente
          </div>
        )}
        {error && (
          <div style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#ef4444', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {/* Información personal */}
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 24px' }}>Información personal</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Nombre completo</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} disabled={!editando} style={inputStyle(editando)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Correo electrónico</label>
              <input value={email} disabled style={inputStyle(false)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Teléfono</label>
              <input value={telefono} onChange={e => setTelefono(e.target.value)} disabled={!editando} style={inputStyle(editando)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Ubicación</label>
              <input value={ubicacion} onChange={e => setUbicacion(e.target.value)} disabled={!editando} style={inputStyle(editando)} />
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 24px' }}>Seguridad</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #1f1f1f' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Contraseña</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>••••••••••</div>
              </div>
              <button
                onClick={() => setModalPassword(true)}
                style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 16px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif' }}
              >
                Cambiar
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Verificación en dos pasos</div>
                <div style={{ fontSize: '12px', color: dosPasos ? '#4ade80' : '#6b7280' }}>
                  {dosPasos ? '✓ Activada' : 'No activada'}
                </div>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={enviando2FA}
                style={{ background: dosPasos ? '#ef444420' : 'none', border: `1px solid ${dosPasos ? '#ef444460' : '#2a2a2a'}`, borderRadius: '8px', padding: '8px 16px', color: dosPasos ? '#ef4444' : '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif' }}
              >
                {enviando2FA ? 'Enviando...' : dosPasos ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>

        {/* Zona peligrosa */}
        <div style={{ background: '#111', border: '1px solid #ef444430', borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: '#ef4444' }}>Zona peligrosa</h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>
            Una vez que elimines tu cuenta no hay vuelta atrás. Por favor asegúrate de estar seguro.
          </p>
          <button
            onClick={() => setModalEliminar(true)}
            style={{ background: 'none', border: '1px solid #ef444460', borderRadius: '10px', padding: '10px 20px', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 600 }}
          >
            Eliminar cuenta
          </button>
        </div>
      </div>

      {/* MODAL: Cambiar contraseña */}
      {modalPassword && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 24px' }}>Cambiar contraseña</h3>
            {['Contraseña actual', 'Nueva contraseña', 'Confirmar nueva contraseña'].map((label, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>{label}</label>
                <input
                  type="password"
                  value={[passActual, passNueva, passConfirmar][i]}
                  onChange={e => [setPassActual, setPassNueva, setPassConfirmar][i](e.target.value)}
                  style={inputStyle(true)}
                />
              </div>
            ))}
            {passError && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>{passError}</p>}
            {passExito && <p style={{ color: '#4ade80', fontSize: '12px', marginBottom: '12px' }}>✓ Contraseña actualizada</p>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => { setModalPassword(false); setPassError(''); }} style={{ flex: 1, padding: '11px', background: 'none', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif' }}>Cancelar</button>
              <button onClick={handleCambiarPassword} style={{ flex: 1, padding: '11px', background: '#f1c98a', border: 'none', borderRadius: '10px', color: '#000', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>Actualizar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Verificar código 2FA */}
      {modal2FA && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px' }}>
              {accion2FA === 'activar' ? 'Activar verificación' : 'Desactivar verificación'}
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>
              Te enviamos un código de 6 dígitos a <strong style={{ color: '#f1c98a' }}>{email}</strong>. Ingrésalo para continuar.
            </p>
            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Código de verificación</label>
            <input
              type="text"
              maxLength={6}
              value={codigo2FA}
              onChange={e => setCodigo2FA(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              style={{ ...inputStyle(true), fontSize: '24px', fontWeight: 800, letterSpacing: '8px', textAlign: 'center', marginBottom: '16px' }}
            />
            {error2FA && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>{error2FA}</p>}
            {exito2FA && <p style={{ color: '#4ade80', fontSize: '12px', marginBottom: '12px' }}>✓ {accion2FA === 'activar' ? 'Verificación activada' : 'Verificación desactivada'}</p>}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setModal2FA(false); setCodigo2FA(''); setError2FA(''); }} style={{ flex: 1, padding: '11px', background: 'none', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif' }}>Cancelar</button>
              <button onClick={handleVerificar2FA} disabled={codigo2FA.length !== 6} style={{ flex: 1, padding: '11px', background: codigo2FA.length === 6 ? '#f1c98a' : '#1a1a1a', border: 'none', borderRadius: '10px', color: codigo2FA.length === 6 ? '#000' : '#6b7280', fontSize: '13px', fontWeight: 700, cursor: codigo2FA.length === 6 ? 'pointer' : 'default', fontFamily: 'sans-serif' }}>Verificar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar eliminar cuenta */}
      {modalEliminar && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#111', border: '1px solid #ef444430', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#ef4444' }}>¿Eliminar tu cuenta?</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>
              Esta acción es permanente. Se borrarán todos tus datos y no podrás recuperar tu cuenta.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setModalEliminar(false)} style={{ flex: 1, padding: '11px', background: 'none', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif' }}>Cancelar</button>
              <button onClick={handleEliminarCuenta} style={{ flex: 1, padding: '11px', background: '#ef4444', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}