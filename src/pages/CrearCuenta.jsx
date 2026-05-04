import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CrearCuenta() {
    const navigate = useNavigate();
    const videoUrl = "/src/assets/BMW M4 GT4 – Born to Race 🏁 _ Ultimate Cinematic Edit in 4K.mp4";

    const options = [
        { id: "vendedor", label: "Vendedor", icon: "🚗" },
        { id: "comprador", label: "Comprador", icon: "🛒" },
    ];

    // --- ESTADOS PARA CAPTURAR DATOS ---
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
    const debounceRef = useRef(null);

    // --- LÓGICA DE REGISTRO ---
    const manejarRegistro = async (e) => {
        e.preventDefault();

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!regexEmail.test(email)) {
        alert("El formato del correo no es válido. Ejemplo: usuario@dominio.com");
        return; // Detiene el registro si el correo está mal escrito
         }

        // Validación simple de contraseñas
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        if (!selected) {
            alert("Por favor selecciona si eres Vendedor o Comprador");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre: `${nombre} ${apellido}`, // Combinamos para el JSON
                    email, 
                    password,
                    telefono,
                    direccion,
                    rol: selected 
                })
            });

            const data = await response.json();

            if (data.success) {
                alert("¡Cuenta creada con éxito! Bienvenido a JARide.");
                navigate('/login');
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
                const url = `/api/nominatim/search?q=${encodeURIComponent(texto)}&format=json&countrycodes=mx&addressdetails=1&limit=6&dedupe=1`;
                const res = await fetch(url);
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
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10"></div>
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
                                                <p className="font-medium">{s.display_name.split(",").slice(0,2).join(",")}</p>
                                                <p className="text-[11px] text-gray-500">{s.display_name.split(",").slice(2,4).join(",")}</p>
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
        </div>
    );
}