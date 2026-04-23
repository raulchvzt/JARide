import React from 'react';

export default function Hero() {
  return (
    <section className="relative h-screen w-full bg-black flex flex-col items-center justify-center text-center pt-20 px-6">
      <div className="absolute inset-0 opacity-40">
        <img src="/src/assets/herolambo.jpg" className="w-full h-full object-cover" alt="Background" />
      </div>
      <div className="relative z-10 max-w-6xl">
        <h1 className="text-6xl md:text-[120px] font-extralight text-white leading-[0.85] tracking-tighter mb-8">
          Autos para <br/> cada elección
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light mb-12">
          Un marketplace de vehículos seleccionados bajo editorial, confianza y selección cuidada para una experiencia premium.
        </p>


         {/* Esta parte se necesita cambiar despues el # para que se pueda cambiar de pestaña */}
         
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="#" className="bg-white text-black px-12 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:invert transition">Explorar catálogo</a>
          <a href="/vender" className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-12 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition">Vender mi auto</a>
        </div>
      </div>
    </section>
  );
}