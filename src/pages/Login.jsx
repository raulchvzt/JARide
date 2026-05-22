import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import bmwlogin from '../assets/BMW M4 GT4 – Born to Race 🏁 _ Ultimate Cinematic Edit in 4K.mp4';

const GOOGLE_CLIENT_ID = '1032892362121-71ep1vasopum4jiqi0lm2k5o0ngftpcr.apps.googleusercontent.com';

function LoginContent() {
  const videoUrl = bmwlogin;

  // Estados login normal
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastOk, setToastOk] = useState(true);

  // Estados 2FA
  const [pantalla2FA, setPantalla2FA] = useState(false);
  const [emailPendiente, setEmailPendiente] = useState('');
  const [codigo2FA, setCodigo2FA] = useState('');
  const [error2FA, setError2FA] = useState('');

  // ----------------------------------------------------------------
  const mostrarToast = (msg, ok = true) => {
    setToastMessage(msg);
    setToastOk(ok);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const guardarSesion = (data, emailUsado = '') => {
    localStorage.setItem('usuarioNombre', data.nombre);
    localStorage.setItem('usuarioFoto', data.foto || '');
    localStorage.setItem('usuarioRol', data.rol);
    localStorage.setItem('usuarioEmail', emailUsado || data.email || '');
    localStorage.setItem('estaAutenticado', 'true');
  };

  // Login email/password
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
        mostrarToast('¡Sesión iniciada con éxito! 🎉', true);
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        mostrarToast('Error: ' + data.message, false);
      }
    } catch {
      mostrarToast('No se pudo conectar con el servidor.', false);
    }
  };

  // Login Google
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
        mostrarToast('¡Sesión iniciada con Google! 🎉', true);
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        mostrarToast('Error con Google: ' + data.message, false);
      }
    } catch {
      mostrarToast('Error al conectar con Google.', false);
    }
  };

  // Verificar código 2FA
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
        mostrarToast('¡Sesión iniciada con éxito! 🎉', true);
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        setError2FA(data.message || 'Código incorrecto');
      }
    } catch {
      setError2FA('Error de conexión');
    }
  };

  // ----------------------------------------------------------------
  // PANTALLA 2FA
  // ----------------------------------------------------------------
  if (pantalla2FA) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', fontFamily: 'sans-serif', color: '#fff' }}>
          <h1 style={{ color: '#f1c98a', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>JARide</h1>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Verificación en dos pasos</h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.6 }}>
            Enviamos un código a <strong style={{ color: '#f1c98a' }}>{emailPendiente}</strong>. Revisa tu correo e ingrésalo abajo.
          </p>

          <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Código de 6 dígitos</label>
          <input
            type="text"
            maxLength={6}
            value={codigo2FA}
            onChange={e => setCodigo2FA(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="000000"
            style={{ width: '100%', padding: '16px', background: '#1a1a1a', border: '1px solid #f1c98a', borderRadius: '12px', color: '#fff', fontSize: '28px', fontWeight: 800, letterSpacing: '10px', textAlign: 'center', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
          />

          {error2FA && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>{error2FA}</p>}

          <button
            onClick={verificar2FA}
            disabled={codigo2FA.length !== 6}
            style={{ width: '100%', padding: '14px', background: codigo2FA.length === 6 ? '#f1c98a' : '#1a1a1a', border: 'none', borderRadius: '12px', color: codigo2FA.length === 6 ? '#000' : '#6b7280', fontSize: '15px', fontWeight: 700, cursor: codigo2FA.length === 6 ? 'pointer' : 'default', marginBottom: '12px' }}
          >
            Verificar e ingresar
          </button>
          <button
            onClick={() => { setPantalla2FA(false); setCodigo2FA(''); setError2FA(''); }}
            style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer' }}
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // PANTALLA LOGIN NORMAL
  // ----------------------------------------------------------------
  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-black text-white font-sans overflow-hidden">

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
                  onError={() => mostrarToast('Error al iniciar sesión con Google', false)}
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
                <a href="#" className="text-[10px] text-[#f1c98a] hover:underline">¿Olvidaste tu contraseña?</a>
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

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-[#0a0a0a] border border-[#f1c98a]/20 rounded-xl p-4 shadow-2xl max-w-sm">
            <div className="flex items-center gap-3">
              <div className="bg-[#f1c98a]/10 p-2 rounded-full">
                <span className="text-[#f1c98a] text-lg">{toastOk ? '✅' : '❌'}</span>
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