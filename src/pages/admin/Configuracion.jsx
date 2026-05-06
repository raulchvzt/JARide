import React, { useState } from 'react';
import { LuUser, LuLock, LuDownload, LuArrowLeft, LuCheck, LuUpload } from 'react-icons/lu';

// ------------------------------------------------------------------
// SECCIÓN: Perfil del Admin
// ------------------------------------------------------------------
function SeccionPerfil({ onVolver }) {
  const emailAdmin = localStorage.getItem('usuarioEmail') || '';
  const [nombre, setNombre] = useState(localStorage.getItem('usuarioNombre') || '');
  const [foto, setFoto] = useState(localStorage.getItem('usuarioFoto') || '');
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const subirFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subir-foto`, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) setFoto(data.url);
  };

  const guardar = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/perfil`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAdmin, nombre, fotoPerfil: foto })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('usuarioNombre', nombre);
        localStorage.setItem('usuarioFoto', foto);
        setExito(true);
        setTimeout(() => setExito(false), 3000);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onVolver} className="flex items-center gap-2 text-[#e7b476] text-[10px] font-black uppercase tracking-widest mb-8 hover:underline">
        <LuArrowLeft size={12} /> Volver a Configuración
      </button>
      <h1 className="text-3xl font-medium mb-10">Perfil del Administrador</h1>

      <div className="bg-[#111] border border-white/5 rounded-3xl p-10 max-w-xl space-y-8">
        {/* Foto */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-2xl font-bold">
            {foto ? <img src={foto} alt="foto" className="w-full h-full object-cover" /> : nombre.charAt(0)}
          </div>
          <div>
            <label className="cursor-pointer flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
              <LuUpload size={13} /> Cambiar foto
              <input type="file" accept="image/*" onChange={subirFoto} className="hidden" />
            </label>
            <p className="text-white/20 text-[10px] mt-2">JPG, PNG — máx 2MB</p>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block mb-2">Nombre</label>
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#e7b476]/40 transition-all"
          />
        </div>

        {/* Email (solo lectura) */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block mb-2">Correo</label>
          <input
            value={emailAdmin}
            disabled
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm text-white/30 cursor-not-allowed"
          />
        </div>

        <button
          onClick={guardar}
          disabled={cargando}
          className="w-full bg-[#e7b476] text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {exito ? <><LuCheck size={14} /> Guardado</> : cargando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// SECCIÓN: Cambiar contraseña
// ------------------------------------------------------------------
function SeccionPassword({ onVolver }) {
  const emailAdmin = localStorage.getItem('usuarioEmail') || '';
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const guardar = async () => {
    setError('');
    if (nueva !== confirmar) return setError('Las contraseñas nuevas no coinciden');
    if (nueva.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
    setCargando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAdmin, passwordActual: actual, passwordNuevo: nueva })
      });
      const data = await res.json();
      if (data.success) {
        setExito(true);
        setActual(''); setNueva(''); setConfirmar('');
        setTimeout(() => setExito(false), 3000);
      } else {
        setError(data.message || 'Error al cambiar contraseña');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onVolver} className="flex items-center gap-2 text-[#e7b476] text-[10px] font-black uppercase tracking-widest mb-8 hover:underline">
        <LuArrowLeft size={12} /> Volver a Configuración
      </button>
      <h1 className="text-3xl font-medium mb-10">Cambiar Contraseña</h1>

      <div className="bg-[#111] border border-white/5 rounded-3xl p-10 max-w-xl space-y-6">
        {[
          { label: 'Contraseña actual', value: actual, set: setActual },
          { label: 'Nueva contraseña', value: nueva, set: setNueva },
          { label: 'Confirmar nueva contraseña', value: confirmar, set: setConfirmar },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block mb-2">{label}</label>
            <input
              type="password"
              value={value}
              onChange={e => set(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#e7b476]/40 transition-all"
            />
          </div>
        ))}

        {error && <p className="text-red-400 text-xs font-bold">{error}</p>}

        <button
          onClick={guardar}
          disabled={cargando}
          className="w-full bg-[#e7b476] text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {exito ? <><LuCheck size={14} /> Contraseña actualizada</> : cargando ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// SECCIÓN: Exportar datos
// ------------------------------------------------------------------
function SeccionExportar({ onVolver }) {
  const [descargando, setDescargando] = useState('');

  const exportar = async (tipo) => {
    setDescargando(tipo);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/exportar/${tipo}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tipo}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDescargando('');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onVolver} className="flex items-center gap-2 text-[#e7b476] text-[10px] font-black uppercase tracking-widest mb-8 hover:underline">
        <LuArrowLeft size={12} /> Volver a Configuración
      </button>
      <h1 className="text-3xl font-medium mb-10">Exportar Datos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {[
          { tipo: 'usuarios', titulo: 'Usuarios', desc: 'Exporta todos los usuarios registrados con su nombre, correo, rol y teléfono.' },
          { tipo: 'autos', titulo: 'Autos', desc: 'Exporta todos los vehículos con marca, modelo, precio, estado y vendedor.' },
        ].map(({ tipo, titulo, desc }) => (
          <div key={tipo} className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col gap-4">
            <div className="w-10 h-10 bg-[#e7b476]/10 rounded-xl flex items-center justify-center">
              <LuDownload size={18} className="text-[#e7b476]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{titulo}</h3>
              <p className="text-sm text-white/40 mt-1 leading-relaxed">{desc}</p>
            </div>
            <button
              onClick={() => exportar(tipo)}
              disabled={descargando === tipo}
              className="mt-auto bg-white/5 hover:bg-[#e7b476]/10 border border-white/10 hover:border-[#e7b476]/30 text-white/60 hover:text-[#e7b476] py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LuDownload size={13} />
              {descargando === tipo ? 'Descargando...' : `Descargar ${titulo}.csv`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// MENÚ PRINCIPAL
// ------------------------------------------------------------------
export default function Configuracion() {
  const [seccion, setSeccion] = useState('menu');

  const secciones = [
    { id: 'perfil',    title: 'Perfil del Admin',   desc: 'Cambia tu nombre y foto de perfil.',         icon: <LuUser size={18} />,     symbol: 'P' },
    { id: 'password',  title: 'Contraseña',          desc: 'Actualiza tu contraseña de acceso.',         icon: <LuLock size={18} />,     symbol: 'C' },
    { id: 'exportar',  title: 'Exportar Datos',      desc: 'Descarga usuarios y autos en formato CSV.',  icon: <LuDownload size={18} />, symbol: 'E' },
  ];

  if (seccion === 'perfil')   return <SeccionPerfil    onVolver={() => setSeccion('menu')} />;
  if (seccion === 'password') return <SeccionPassword  onVolver={() => setSeccion('menu')} />;
  if (seccion === 'exportar') return <SeccionExportar  onVolver={() => setSeccion('menu')} />;

  return (
    <div className="animate-in fade-in duration-700">
      <h1 className="text-3xl font-medium tracking-tight mb-10 text-white">Configuración del Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {secciones.map((s) => (
          <div
            key={s.id}
            onClick={() => setSeccion(s.id)}
            className="bg-[#111] border border-white/5 p-8 rounded-3xl hover:bg-white/4 hover:border-[#e7b476]/30 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#e7b476] mb-6 group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">{s.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}