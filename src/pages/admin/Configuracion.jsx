import React, { useState } from 'react';

export default function Configuracion() {
  // Este estado guarda qué sección interna estamos viendo
  const [seccionInterna, setSeccionInterna] = useState("menu");

  const secciones = [
    { id: "seguridad", title: "Seguridad", desc: "Autenticación de dos pasos y permisos de admin.", symbol: "S" },
    { id: "notificaciones", title: "Notificaciones", desc: "Configurar alertas de nuevos registros y pagos.", symbol: "N" },
    { id: "apariencia", title: "Apariencia", desc: "Modificar colores de marca y modo oscuro.", symbol: "A" },
    { id: "respaldo", title: "Respaldo", desc: "Exportar base de datos de usuarios y ventas.", symbol: "R" },
  ];

  // Si estamos en una sección específica, mostramos su panel
  if (seccionInterna !== "menu") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSeccionInterna("menu")}
          className="text-[#e7b476] text-[10px] font-black uppercase tracking-widest mb-6 hover:underline"
        >
          ← Volver a Configuración
        </button>
        
        <h1 className="text-3xl font-medium mb-10 capitalize">Ajustes de {seccionInterna}</h1>
        
        <div className="bg-[#111] border border-white/5 rounded-3xl p-10 text-white/60">
          <p>Aquí puedes agregar los inputs y botones para configurar la sección de {seccionInterna}.</p>
          <div className="mt-10 p-4 border border-white/10 rounded-xl bg-white/5 text-xs italic">
            Próximamente: Formulario de {seccionInterna}
          </div>
        </div>
      </div>
    );
  }

  // Si estamos en el "menu", mostramos las 4 tarjetas
  return (
    <div className="animate-in fade-in duration-700">
      <h1 className="text-3xl font-medium tracking-tight mb-10 text-white">Configuración del Sistema</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secciones.map((s) => (
          <div 
            key={s.id} 
            onClick={() => setSeccionInterna(s.id)} // <--- Esto hace que el clic funcione
            className="bg-[#111] border border-white/5 p-8 rounded-3xl hover:bg-white/4 hover:border-[#e7b476]/30 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#e7b476] mb-6 font-bold group-hover:scale-110 transition-transform">
              {s.symbol}
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">{s.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}