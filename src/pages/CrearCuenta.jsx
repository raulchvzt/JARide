import React, { useState } from 'react';

export default function CrearCuenta() {

    const videoUrl = "/src/assets/BMW M4 GT4 – Born to Race 🏁 _ Ultimate Cinematic Edit in 4K.mp4";

                {/*iconos que se utilizan en los recuadros de como usar JARide*/}

    const options = [
        { id: "vendedor", label: "Vendedor", icon: "🚗" },
        { id: "comprador", label: "Comprador", icon: "🛒" },
    ];

    /*manda a llamar esa constante*/
    const [selected, setSelected] = useState(null);
    
    return (

        
/*cambie para que se vea completa la pagina y no se vea cortada por el video, ademas de que se vea mas ordenada y con un fondo*/
        <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-black text-white font-sans">


            {/* --- AQUI INICIA LA PARTE IZQUIERDA --- */}
            <div className="relative overflow-hidden hidden md:flex flex-col justify-end p-12 h-full">

                {/* Este es el video de fondo */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Tu navegador no soporta videos.
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

                {/* Esta es la parte del lado izquierdo de la interfaz, donde esta el video y el lorem */}

                <div className="relative z-20 max-w-lg mb-8">
                    <h1 className="text-6xl font-black tracking-tighter mb-4 italic">
                        JARide
                    </h1>
                    <p className="text-xl text-gray-200 leading-relaxed font-light">
                        La forma mas exclusiva y segura de vender vehículos en Colima
                    </p>
                </div>
            </div>

<div className="flex flex-col items-center px-8 lg:px-20 bg-[#0a0a0a] z-30 h-full overflow-y-auto py-10">


                <div className="w-full max-w-md">
                    <h1 className="md:hidden text-4xl font-black text-[#f1c98a] mb-6 italic text-center">JARide</h1>

                    {/* Aqui inicia la seccion de crear cuenta del lado derecho */}

                    <h2 className="text-3xl font-bold mb-1 tracking-tight">
                        Crear cuenta
                    </h2>
                    <p className="text-gray-400 mb-6 text-base font-light">
                        Ingresa tus datos para crear tu cuenta.
                    </p>

                    {/* Aqui inicia la seccion de los botones de Redes Sociales */}

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button className="flex items-center justify-center gap-3 py-2 px-4 border border-gray-800 rounded-xl hover:bg-gray-900 transition-all duration-300 group text-sm">
                            <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-gray-300">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 py-2 px-4 border border-gray-800 rounded-xl hover:bg-gray-900 transition-all duration-300 group text-sm">
                            <img src="https://authjs.dev/img/providers/apple.svg" alt="Apple" className="h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-gray-300 ">Apple</span>
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
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Nombre</label>
                            <input
                                type="text"
                                placeholder="Ej. Juan"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Apellido</label>
                            <input
                                type="text"
                                placeholder="Ej. Pérez"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
                            />
                        </div>


                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="ejemplo@jaride.com"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Número de teléfono</label>
                            <input
                                type="tel"
                                placeholder="Ej. 123-456-7890"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Contraseña</label>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Confirmar contraseña</label>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
                            />
                        </div>

                        <div>
                            <p>¿Cómo quieres usar JARide?</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                {options.map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => setSelected(opt.id)}
                                        style={{
                                            border: selected === opt.id
                                                ? "1.5px solid #C8882A"   // color activo
                                                : "1.5px solid #e0e0e0",  // color inactivo
                                            borderRadius: "12px",
                                            padding: "1.25rem 1rem",
                                            cursor: "pointer",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "10px",
                                            background: selected === opt.id ? "#1a1a1a" : "#111",
                                        }}
                                    >
                                        <span style={{ fontSize: "24px" }}>{opt.icon}</span>
                                        <p style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>
                                            {opt.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>






                        <button className="w-full p-3 bg-[#f1c98a] text-black font-bold text-base rounded-xl hover:bg-[#e2bc7d] active:scale-[0.98] transition-all shadow-lg">
                            Entrar
                        </button>
                    </form>

                    {/* Aqui es la seccion del banner de seguridad */}

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