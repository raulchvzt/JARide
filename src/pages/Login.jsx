import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import bmwlogin from '../assets/BMW M4 GT4 – Born to Race 🏁 _ Ultimate Cinematic Edit in 4K.mp4';

const GOOGLE_CLIENT_ID = '1032892362121-71ep1vasopum4jiqi0lm2k5o0ngftpcr.apps.googleusercontent.com';

function LoginContent() {
  const videoUrl = bmwlogin;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [pantalla2FA, setPantalla2FA] = useState(false);
  const [emailPendiente, setEmailPendiente] = useState('');
  const [codigo2FA, setCodigo2FA] = useState('');
  const [error2FA, setError2FA] = useState('');

  const [modalRecuperar, setModalRecuperar] = useState(false);
  const [pasoRecuperar, setPasoRecuperar] = useState(1);
  const [emailRecuperar, setEmailRecuperar] = useState('');
  const [codigoRecuperar, setCodigoRecuperar] = useState('');
  const [nuevaPass, setNuevaPass] = useState('');
  const [errorRecuperar, setErrorRecuperar] = useState('');
  const [loadingRecuperar, setLoadingRecuperar] = useState(false);

  // Modal de éxito
  const [modalExito, setModalExito] = useState(false);
  const [nombreBienvenida, setNombreBienvenida] = useState('');
  const [esGoogle, setEsGoogle] = useState(false);

  // Toast para errores
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const mostrarError = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const mostrarExito = (nombre, google = false) => {
    setNombreBienvenida(nombre);
    setEsGoogle(google);
    setModalExito(true);
    setTimeout(() => { window.location.href = '/'; }, 3500);
  };

  const guardarSesion = (data, emailUsado = '') => {
    sessionStorage.setItem('usuarioNombre', data.nombre);
    sessionStorage.setItem('usuarioFoto', data.foto || '');
    sessionStorage.setItem('usuarioRol', data.rol);
    sessionStorage.setItem('usuarioEmail', emailUsado || data.email || '');
    sessionStorage.setItem('estaAutenticado', 'true');
  };

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.requiere2FA) {
        setEmailPendiente(email);
        setPantalla2FA(true);
        return;
      }
      if (data.success) {
        guardarSesion(data, email);
        mostrarExito(data.nombre, false);
      } else {
        mostrarError(data.message || 'Correo o contraseña incorrectos');
      }
    } catch {
      mostrarError('No se pudo conectar con el servidor.');
    }
  };

  const manejarGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (data.success) {
        guardarSesion(data);
        mostrarExito(data.nombre, true);
      } else {
        mostrarError('Error con Google: ' + data.message);
      }
    } catch {
      mostrarError('Error al conectar con Google.');
    }
  };

  const verificar2FA = async () => {
    setError2FA('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/2fa/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailPendiente, codigo: codigo2FA, activar: true })
      });
      const data = await res.json();
      if (data.success) {
        const res2 = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/perfil?email=${emailPendiente}`);
        const user = await res2.json();
        guardarSesion({ nombre: user.nombre, foto: user.fotoPerfil, rol: user.rol }, emailPendiente);
        mostrarExito(user.nombre, false);
      } else {
        setError2FA(data.message || 'Código incorrecto');
      }
    } catch {
      setError2FA('Error de conexión');
    }
  };

  const enviarCodigoRecuperar = async () => {
    setLoadingRecuperar(true);
    setErrorRecuperar('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/password/recuperar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailRecuperar })
      });
      const data = await res.json();
      if (data.success) setPasoRecuperar(2);
      else setErrorRecuperar(data.message);
    } catch { setErrorRecuperar('Error de conexión'); }
    setLoadingRecuperar(false);
  };

  const resetearPassword = async () => {
    setLoadingRecuperar(true);
    setErrorRecuperar('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailRecuperar, codigo: codigoRecuperar, nuevaPassword: nuevaPass })
      });
      const data = await res.json();
      if (data.success) {
        setModalRecuperar(false);
        setPasoRecuperar(1);
        setEmailRecuperar('');
        setCodigoRecuperar('');
        setNuevaPass('');
        mostrarError('✓ Contraseña actualizada. Inicia sesión con tu nueva contraseña.');
      } else setErrorRecuperar(data.message);
    } catch { setErrorRecuperar('Error de conexión'); }
    setLoadingRecuperar(false);
  };

  // ── MODAL ÉXITO (compartido) ──
  const ModalExito = () => (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
        @keyframes slideUp     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse       { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes shimmer     { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes progressBar { from{width:0%} to{width:100%} }
        @keyframes floatDot    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <div style={{
        background: 'linear-gradient(160deg, #111 0%, #0d0d0d 100%)',
        border: '1px solid #2a2a2a',
        borderRadius: '32px',
        padding: '56px 48px 44px',
        maxWidth: '440px',
        width: '92%',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        animation: 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px #ffffff08',
      }}>

        {/* Glow superior */}
        <div style={{
          position: 'absolute', top: '-80px', left: '50%',
          transform: 'translateX(-50%)',
          width: '260px', height: '260px',
          background: 'radial-gradient(circle, #f1c98a25 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Partículas */}
        {[
          { top: '18%', left: '12%',  delay: '0s',   size: 6 },
          { top: '14%', right: '10%', delay: '0.3s', size: 4 },
          { top: '70%', left: '8%',   delay: '0.6s', size: 5 },
          { top: '75%', right: '6%',  delay: '0.2s', size: 3 },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: p.top, left: p.left, right: p.right,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: '#f1c98a',
            opacity: 0.4,
            animation: `floatDot 2.4s ease-in-out ${p.delay} infinite`,
          }} />
        ))}

        {/* Icono */}
        <div style={{
          width: '88px', height: '88px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f1c98a 0%, #c9971a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          fontSize: '38px',
          boxShadow: '0 0 0 12px #f1c98a12, 0 0 40px #f1c98a40',
          animation: 'pulse 2s ease-in-out infinite',
          position: 'relative', zIndex: 1,
        }}>
          {esGoogle ? '🚀' : '🏁'}
        </div>

        {/* Título shimmer */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 800,
          margin: '0 0 10px',
          letterSpacing: '-0.6px',
          background: 'linear-gradient(90deg, #f1c98a 0%, #fff 40%, #f1c98a 80%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shimmer 2.8s linear infinite',
          position: 'relative', zIndex: 1,
        }}>
          ¡Bienvenido, {nombreBienvenida}!
        </h2>

        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          margin: '0 0 10px',
          lineHeight: 1.75,
          position: 'relative', zIndex: 1,
        }}>
          {esGoogle
            ? <>Sesión iniciada con <span style={{ color: '#f1c98a', fontWeight: 700 }}>Google</span> correctamente.<br />Listo para explorar JARide.</>
            : <>Sesión iniciada en <span style={{ color: '#f1c98a', fontWeight: 700 }}>JARide</span> correctamente.<br />Bienvenido de vuelta a Colima.</>
          }
        </p>

        {/* Separador */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #2a2a2a, transparent)',
          margin: '28px 0 24px',
        }} />

        {/* Chips */}
        <div style={{
          display: 'flex', gap: '8px',
          justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: '28px',
          position: 'relative', zIndex: 1,
        }}>
          {['✓ Sesión activa', '✓ Acceso seguro', '✓ JARide Colima'].map((tag, i) => (
            <span key={i} style={{
              background: '#22c55e0d',
              border: '1px solid #22c55e22',
              color: '#4ade80',
              fontSize: '11px',
              fontWeight: 600,
              padding: '5px 14px',
              borderRadius: '30px',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Barra de progreso */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '11px', color: '#4b5563',
            marginBottom: '8px',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <span>Entrando al inicio</span>
            <span>3s</span>
          </div>
          <div style={{ height: '3px', background: '#1c1c1c', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #f1c98a, #e2a84b)',
              borderRadius: '99px',
              animation: 'progressBar 3.5s linear forwards',
              width: '0%',
            }} />
          </div>
        </div>
      </div>
    </div>
  );

  // ── PANTALLA 2FA ──
  if (pantalla2FA) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
        {modalExito && <ModalExito />}
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', fontFamily: 'sans-serif', color: '#fff' }}>
          <h1 style={{ color: '#f1c98a', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>JARide</h1>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Verificación en dos pasos</h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.6 }}>
            Enviamos un código a <strong style={{ color: '#f1c98a' }}>{emailPendiente}</strong>. Revisa tu correo e ingrésalo abajo.
          </p>
          <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Código de 6 dígitos</label>
          <input
            type="text" maxLength={6} value={codigo2FA}
            onChange={e => setCodigo2FA(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="000000"
            style={{ width: '100%', padding: '16px', background: '#1a1a1a', border: '1px solid #f1c98a', borderRadius: '12px', color: '#fff', fontSize: '28px', fontWeight: 800, letterSpacing: '10px', textAlign: 'center', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
          />
          {error2FA && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>{error2FA}</p>}
          <button onClick={verificar2FA} disabled={codigo2FA.length !== 6}
            style={{ width: '100%', padding: '14px', background: codigo2FA.length === 6 ? '#f1c98a' : '#1a1a1a', border: 'none', borderRadius: '12px', color: codigo2FA.length === 6 ? '#000' : '#6b7280', fontSize: '15px', fontWeight: 700, cursor: codigo2FA.length === 6 ? 'pointer' : 'default', marginBottom: '12px' }}>
            Verificar e ingresar
          </button>
          <button onClick={() => { setPantalla2FA(false); setCodigo2FA(''); setError2FA(''); }}
            style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer' }}>
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  // ── PANTALLA LOGIN NORMAL ──
  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-black text-white font-sans overflow-hidden">

      {modalExito && <ModalExito />}

      {/* IZQUIERDA: VIDEO */}
      <div className="relative overflow-hidden hidden md:flex flex-col justify-end p-12 h-full">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10"></div>
        <div className="relative z-20 max-w-lg mb-8">
          <h1 className="text-6xl font-black tracking-tighter mb-4 italic">JARide</h1>
          <p className="text-xl text-gray-200 leading-relaxed font-light">
            Accede a tu cuenta y encuentra la forma más exclusiva y segura de vender y rentar vehículos en{' '}
            <span className="text-[#f1c98a] font-semibold">Colima</span>.
          </p>
        </div>
      </div>

      {/* DERECHA: FORMULARIO */}
      <div className="flex flex-col justify-center items-center px-8 lg:px-20 bg-[#0a0a0a] z-30 h-full">
        <div className="w-full max-w-md">
          <h1 className="md:hidden text-4xl font-black text-[#f1c98a] mb-6 italic text-center">JARide</h1>
          <h2 className="text-3xl font-bold mb-1 tracking-tight">Iniciar sesión</h2>
          <p className="text-gray-400 mb-6 text-base font-light">Ingresa con tu cuenta para continuar.</p>

          {/* Botones OAuth */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <div className="flex items-center justify-center gap-3 py-2 px-4 border border-gray-800 rounded-xl bg-transparent hover:bg-gray-900 transition-all duration-300 group text-sm cursor-pointer h-full">
                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-300">Google</span>
              </div>
              <div className="absolute inset-0 opacity-0 overflow-hidden rounded-xl">
                <GoogleLogin
                  onSuccess={manejarGoogleLogin}
                  onError={() => mostrarError('Error al iniciar sesión con Google')}
                  useOneTap={false}
                  width="300"
                />
              </div>
            </div>
            <button type="button" className="flex items-center justify-center gap-3 py-2 px-4 border border-gray-800 rounded-xl hover:bg-gray-900 transition-all duration-300 group text-sm">
              <img src="https://authjs.dev/img/providers/apple.svg" alt="Apple" className="h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-300">Apple</span>
            </button>
          </div>

          {/* Separador */}
          <div className="relative mb-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <span className="relative z-10 bg-[#0a0a0a] px-4 text-[10px] text-gray-500 uppercase tracking-widest">
              O continúa con tu email
            </span>
          </div>

          {/* FORMULARIO */}
          <form className="space-y-4" onSubmit={manejarLogin}>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Correo electrónico</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ejemplo@jaride.com"
                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Contraseña</label>
                <button type="button" onClick={() => { setModalRecuperar(true); setPasoRecuperar(1); setErrorRecuperar(''); setEmailRecuperar(''); }}
                  className="text-[10px] text-[#f1c98a] hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
              />
            </div>
            <button type="submit" className="w-full p-3 bg-[#f1c98a] text-black font-bold text-base rounded-xl hover:bg-[#e2bc7d] active:scale-[0.98] transition-all shadow-lg">
              Entrar
            </button>
          </form>

          {/* Banner seguridad */}
          <div className="mt-6 p-3 bg-[#111] rounded-xl border border-gray-800 flex items-center gap-4">
            <div className="bg-[#f1c98a]/10 p-2 rounded-lg">
              <span className="text-[#f1c98a] text-lg">🛡️</span>
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-gray-200 italic uppercase tracking-tighter">ACCESO PROTEGIDO</h4>
              <p className="text-[10px] text-gray-500">Validación de seguridad activa para Colima.</p>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm">
            ¿No tienes cuenta?{' '}
            <a href="/CrearCuenta" className="text-[#f1c98a] font-bold hover:underline ml-1">Crear cuenta ahora</a>
          </div>
        </div>
      </div>

      {/* MODAL RECUPERAR CONTRASEÑA */}
      {modalRecuperar && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-1">Recuperar contraseña</h2>
            <p className="text-gray-500 text-sm mb-6">
              {pasoRecuperar === 1
                ? 'Ingresa tu correo y te enviaremos un código.'
                : `Ingresa el código enviado a ${emailRecuperar} y tu nueva contraseña.`}
            </p>
            {pasoRecuperar === 1 ? (
              <>
                <input type="email" placeholder="tu@correo.com" value={emailRecuperar}
                  onChange={e => setEmailRecuperar(e.target.value)}
                  className="w-full p-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] text-sm mb-4" />
                {errorRecuperar && <p className="text-red-400 text-xs mb-3">{errorRecuperar}</p>}
                <button onClick={enviarCodigoRecuperar} disabled={loadingRecuperar || !emailRecuperar}
                  className="w-full p-3 bg-[#f1c98a] text-black font-bold rounded-xl mb-3 disabled:opacity-50">
                  {loadingRecuperar ? 'Enviando...' : 'Enviar código'}
                </button>
              </>
            ) : (
              <>
                <input type="text" placeholder="Código de 6 dígitos" maxLength={6} value={codigoRecuperar}
                  onChange={e => setCodigoRecuperar(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full p-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] text-sm mb-3 text-center tracking-widest text-lg" />
                <input type="password" placeholder="Nueva contraseña" value={nuevaPass}
                  onChange={e => setNuevaPass(e.target.value)}
                  className="w-full p-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] text-sm mb-4" />
                {errorRecuperar && <p className="text-red-400 text-xs mb-3">{errorRecuperar}</p>}
                <button onClick={resetearPassword} disabled={loadingRecuperar || codigoRecuperar.length !== 6 || !nuevaPass}
                  className="w-full p-3 bg-[#f1c98a] text-black font-bold rounded-xl mb-3 disabled:opacity-50">
                  {loadingRecuperar ? 'Actualizando...' : 'Cambiar contraseña'}
                </button>
              </>
            )}
            <button onClick={() => setModalRecuperar(false)}
              className="w-full p-3 bg-transparent border border-gray-800 text-gray-400 rounded-xl text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* TOAST ERRORES */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-[#0a0a0a] border border-[#f1c98a]/20 rounded-xl p-4 shadow-2xl max-w-sm" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="flex items-center gap-3">
              <div className="bg-[#ef4444]/10 p-2 rounded-full">
                <span className="text-lg">❌</span>
              </div>
              <p className="text-white text-sm font-medium flex-1">{toastMessage}</p>
              <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}