import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bmwlogin from '../assets/BMW M4 GT4 – Born to Race 🏁 _ Ultimate Cinematic Edit in 4K.mp4';


export default function CrearCuenta() {
    const navigate = useNavigate();
    const videoUrl = bmwlogin;

    const options = [
        { id: "vendedor", label: "Vendedor", icon: "🚗" },
        { id: "comprador", label: "Comprador", icon: "🛒" },
    ];

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selected, setSelected] = useState(null);
    const [direccion, setDireccion] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [sugerencias, setSugerencias] = useState([]);
    const [modalExito, setModalExito] = useState(false);
    const [nombreRegistrado, setNombreRegistrado] = useState('');
    const debounceRef = useRef(null);

    const manejarRegistro = async (e) => {
        e.preventDefault();

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            alert("El formato del correo no es válido. Ejemplo: usuario@dominio.com");
            return;
        }
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        if (!selected) {
            alert("Por favor selecciona si eres Vendedor o Comprador");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: `${nombre} ${apellido}`,
                    email,
                    password,
                    telefono,
                    direccion,
                    rol: selected
                })
            });

            const data = await response.json();

            if (data.success) {
                setNombreRegistrado(nombre);
                setModalExito(true);
                setTimeout(() => navigate('/login'), 3500);
            } else {
                alert("Error: " + data.message);
            }
        } catch {
            alert("No se pudo conectar con el servidor.");
        }
    };

    const buscarDireccion = async (texto) => {
        setDireccion(texto);
        setSugerencias([]);
        if (texto.length < 4) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const url = `${import.meta.env.VITE_API_URL}/api/nominatim/search?q=${encodeURIComponent(texto)}&format=json&countrycodes=mx&addressdetails=1&limit=6&dedupe=1`;
                const res = await fetch(url);
                const data = await res.json();
                setSugerencias(data);
            } catch {
                setSugerencias([]);
            }
        }, 400);
    };

    return (
        <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-black text-white font-sans">

            {/* PARTE IZQUIERDA: VIDEO */}
            <div className="relative overflow-hidden hidden md:flex flex-col justify-end p-12 h-full">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
                    <source src={videoUrl} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10"></div>
                <div className="relative z-20 max-w-lg mb-8">
                    <h1 className="text-6xl font-black tracking-tighter mb-4 italic">JARide</h1>
                    <p className="text-xl text-gray-200 leading-relaxed font-light">
                        La forma más exclusiva y segura de vender vehículos en Colima
                    </p>
                </div>
            </div>

            {/* PARTE DERECHA: FORMULARIO */}
            <div className="flex flex-col items-center px-8 lg:px-20 bg-[#0a0a0a] z-30 h-full overflow-y-auto py-10">
                <div className="w-full max-w-md">
                    <h1 className="md:hidden text-4xl font-black text-[#f1c98a] mb-6 italic text-center">JARide</h1>
                    <h2 className="text-3xl font-bold mb-1 tracking-tight">Crear cuenta</h2>
                    <p className="text-gray-400 mb-6 text-base font-light">Ingresa tus datos para crear tu cuenta.</p>

                    <form className="space-y-4" onSubmit={manejarRegistro}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Nombre</label>
                                <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Juan"
                                    className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-[#f1c98a] outline-none text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Apellido</label>
                                <input type="text" required value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Pérez"
                                    className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-[#f1c98a] outline-none text-sm" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Correo electrónico</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@jaride.com"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-[#f1c98a] outline-none text-sm" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Número de teléfono</label>
                            <input type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="312-123-4567"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-[#f1c98a] outline-none text-sm" />
                        </div>

                        <div className="space-y-1 relative">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Dirección</label>
                            <input type="text" value={direccion} onChange={(e) => buscarDireccion(e.target.value)} placeholder="Colima, México" autoComplete="off"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-[#f1c98a] outline-none text-sm" />
                            {sugerencias.length > 0 && (
                                <ul className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                                    {sugerencias.map((s) => (
                                        <li key={s.place_id} onClick={() => { setDireccion(s.display_name); setSugerencias([]); }}
                                            className="px-4 py-3 text-sm text-gray-300 hover:bg-[#252525] cursor-pointer border-t border-gray-800 first:border-0 flex items-start gap-2">
                                            <span className="mt-0.5 text-[#f1c98a]">📍</span>
                                            <div>
                                                <p className="font-medium">{s.display_name.split(",").slice(0, 2).join(",")}</p>
                                                <p className="text-[11px] text-gray-500">{s.display_name.split(",").slice(2, 4).join(",")}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Contraseña</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                                    className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-[#f1c98a] outline-none text-sm pr-10" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    {showPassword ? "👁️" : "🙈"}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Confirmar contraseña</label>
                            <div className="relative">
                                <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                                    className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-[#f1c98a] outline-none text-sm pr-10" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    {showConfirmPassword ? "👁️" : "🙈"}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">¿Cómo quieres usar JARide?</p>
                            <div className="grid grid-cols-2 gap-3">
                                {options.map((opt) => (
                                    <div key={opt.id} onClick={() => setSelected(opt.id)}
                                        className={`p-4 rounded-xl cursor-pointer text-center flex flex-col items-center gap-2 border-2 transition-all ${selected === opt.id ? "border-[#f1c98a] bg-[#1a1a1a]" : "border-gray-800 bg-[#111]"}`}>
                                        <span className="text-2xl">{opt.icon}</span>
                                        <p className="text-xs font-bold">{opt.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="w-full p-3 bg-[#f1c98a] text-black font-bold text-base rounded-xl hover:bg-[#e2bc7d] transition-all shadow-lg">
                            Crear cuenta
                        </button>
                    </form>

                    <div className="mt-6 text-center text-gray-500 text-sm">
                        ¿Ya tienes cuenta? <a href="/login" className="text-[#f1c98a] font-bold hover:underline">Iniciar sesión</a>
                    </div>
                </div>
            </div>

            {/* ── MODAL ÉXITO ── */}
            {modalExito && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.88)',
                    backdropFilter: 'blur(14px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    <style>{`
                        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
                        @keyframes slideUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
                        @keyframes pulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
                        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
                        @keyframes progressBar { from{width:0%} to{width:100%} }
                        @keyframes floatDot  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
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

                        {/* Partículas decorativas */}
                        {[
                            { top: '18%', left: '12%', delay: '0s',   size: 6 },
                            { top: '14%', right: '10%', delay: '0.3s', size: 4 },
                            { top: '70%', left: '8%',  delay: '0.6s', size: 5 },
                            { top: '75%', right: '6%', delay: '0.2s', size: 3 },
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
                            🎉
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
                            ¡Bienvenido, {nombreRegistrado}!
                        </h2>

                        <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            margin: '0 0 10px',
                            lineHeight: 1.75,
                            position: 'relative', zIndex: 1,
                        }}>
                            Tu cuenta en{' '}
                            <span style={{ color: '#f1c98a', fontWeight: 700 }}>JARide</span>{' '}
                            fue creada con éxito.<br />
                            Ahora formas parte de la comunidad<br />automotriz de Colima.
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
                            {['✓ Cuenta segura', '✓ Acceso inmediato', '✓ Sin costo'].map((tag, i) => (
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
                                <span>Redirigiendo al login</span>
                                <span>3s</span>
                            </div>
                            <div style={{
                                height: '3px',
                                background: '#1c1c1c',
                                borderRadius: '99px',
                                overflow: 'hidden',
                            }}>
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
            )}
        </div>
    );
}