import React from 'react';

export default function Login() {

    const videoUrl = "/src/assets/BMW M4 GT4 – Born to Race 🏁 _ Ultimate Cinematic Edit in 4K.mp4";

  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-black text-white font-sans overflow-hidden">
      
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
            Accede a tu cuenta y encuentra la forma más exclusiva y segura de vender y rentar vehículos en <span className="text-[#f1c98a] font-semibold">Colima</span>.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center px-8 lg:px-20 bg-[#0a0a0a] z-30 h-full">
        

        <div className="w-full max-w-md">
          <h1 className="md:hidden text-4xl font-black text-[#f1c98a] mb-6 italic text-center">JARide</h1>
          
          <h2 className="text-3xl font-bold mb-1 tracking-tight">
            Iniciar sesión
          </h2>
          <p className="text-gray-400 mb-6 text-base font-light">
            Ingresa con tu cuenta para continuar.
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
              <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Correo electrónico</label>
              <input 
                type="email" 
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
                type="password" 
                placeholder="••••••••"
                className="w-full p-3 bg-[#141414] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f1c98a] transition-all text-sm"
              />
            </div>

            <div className="flex items-center gap-3 py-1">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-800 text-[#f1c98a] focus:ring-[#f1c98a] bg-[#141414] cursor-pointer"
              />
              <label className="text-xs text-gray-500 cursor-pointer select-none">Recordarme en este dispositivo</label>
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
            ¿No tienes cuenta?{' '}
            <a href="/CrearCuenta" className="text-[#f1c98a] font-bold hover:underline ml-1">
              Crear cuenta ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}