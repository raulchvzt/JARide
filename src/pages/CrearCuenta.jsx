import React, { useState, useRef } from 'react';

export default function CrearCuenta() {

    const videoUrl = "/src/assets/BMW M4 GT4 – Born to Race 🏁 _ Ultimate Cinematic Edit in 4K.mp4";

    const options = [
        { id: "vendedor", label: "Vendedor", icon: "🚗" },
        { id: "comprador", label: "Comprador", icon: "🛒" },
    ];

    const [selected, setSelected] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [direccion, setDireccion] = useState("");
    const [sugerencias, setSugerencias] = useState([]);
    const debounceRef = useRef(null);

    const buscarDireccion = async (texto) => {
        setDireccion(texto);
        setSugerencias([]);
        if (texto.length < 4) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(texto)}&format=json&countrycodes=mx&addressdetails=1&limit=6&dedupe=1`;
                const res = await fetch(
                    `https://corsproxy.io/?${encodeURIComponent(url)}`,
                    { headers: { "Accept-Language": "es" } }
                );
                const data = await res.json();
                setSugerencias(data);
            } catch {
                setSugerencias([]);
            }
        }, 600);
    };

    return (
        <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-black text-white font-sans">

            {/* PARTE IZQUIERDA */}
            <div className="relative overflow-hidden hidden md:flex flex-col justify-end p-12 h-full">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
                    <source src={videoUrl} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
                <div className="relative z-20 max-w-lg mb-8">
                    <h1 className="text-6xl font-black tracking-tighter mb-4 italic">JARide</h1>
                    <p className="text-xl text-gray-200 leading-relaxed font-light">
                        La forma mas exclusiva y segura de vender vehículos en Colima
                    </p>
                </div>
            </div>

            {/* PARTE DERECHA */}
            <div className="flex flex-col items-center px-8 lg:px-20 bg-[#0a0a0a] z-30 h-full overflow-y-auto py-10">
                <div className="w-full max-w-md">

                    <h1 className="md:hidden text-4xl font-black text-[#f1c98a] mb-6 italic text-center">JARide</h1>
                    <h2 className="text-3xl font-bold mb-1 tracking-tight">Crear cuenta</h2>
                    <p className="text-gray-400 mb-6 text-base font-light">Ingresa tus datos para crear tu cuenta.</p>

                    {/* Botones redes sociales */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button className="flex items-center justify-center gap-3 py-2 px-4 border border-gray-800 rounded-xl hover:bg-gray-900 transition-all duration-300 group text-sm">
                            <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-gray-300">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 py-2 px-4 border border-gray-800 rounded-xl hover:bg-gray-900 transition-all duration-300 group text-sm">
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

                    {/* Formulario */}
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

                        {/* Nombre */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Nombre</label>
                            <input type="text" placeholder="Ej. Juan"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm" />
                        </div>

                        {/* Apellido */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Apellido</label>
                            <input type="text" placeholder="Ej. Pérez"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm" />
                        </div>

                        {/* Correo */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Correo electrónico</label>
                            <input type="email" placeholder="ejemplo@jaride.com"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm" />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Número de teléfono</label>
                            <input type="tel" placeholder="Ej. 312-123-4567"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm" />
                        </div>

                        {/* Dirección */}
                        <div className="space-y-1 relative">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Dirección</label>
                            <input
                                type="text"
                                value={direccion}
                                onChange={(e) => buscarDireccion(e.target.value)}
                                placeholder="Colima, México"
                                autoComplete="off"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
                            />
                            {sugerencias.length > 0 && (
                                <ul className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                                    {sugerencias.map((s) => {
                                        const partes = s.display_name.split(",");
                                        const titulo = partes.slice(0, 2).join(",");
                                        const subtitulo = partes.slice(2, 4).join(",");
                                        return (
                                            <li key={s.place_id}
                                                onClick={() => { setDireccion(s.display_name); setSugerencias([]); }}
                                                className="px-4 py-3 text-sm text-gray-300 hover:bg-[#252525] cursor-pointer border-t border-gray-800 first:border-0 flex items-start gap-2">
                                                <span className="mt-0.5 text-[#f1c98a]">📍</span>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 500 }}>{titulo}</p>
                                                    <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>{subtitulo}</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm pr-10"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Confirmar contraseña</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm pr-10"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Recuadros vendedor/comprador */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">¿Cómo quieres usar JARide?</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                {options.map((opt) => (
                                    <div key={opt.id} onClick={() => setSelected(opt.id)}
                                        style={{
                                            border: selected === opt.id ? "1.5px solid #C8882A" : "1.5px solid #374151",
                                            borderRadius: "12px", padding: "1.25rem 1rem", cursor: "pointer",
                                            textAlign: "center", display: "flex", flexDirection: "column",
                                            alignItems: "center", gap: "10px",
                                            background: selected === opt.id ? "#1a1a1a" : "#111",
                                        }}>
                                        <span style={{ fontSize: "24px" }}>{opt.icon}</span>
                                        <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "#fff" }}>
                                            {opt.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="w-full p-3 bg-[#f1c98a] text-black font-bold text-base rounded-xl hover:bg-[#e2bc7d] active:scale-[0.98] transition-all shadow-lg">
                            Crear cuenta
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
                        ¿Ya tienes cuenta?{' '}
                        <a href="/login" className="text-[#f1c98a] font-bold hover:underline ml-1">
                            Iniciar sesión
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}