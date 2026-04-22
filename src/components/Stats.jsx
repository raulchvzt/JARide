import React from 'react';
import { FiTarget, FiCamera, FiZap } from 'react-icons/fi';

export default function Stats() {
  return (
    <section className="bg-black py-32 px-10 md:px-20 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-32">
        <Feature icon={<FiTarget/>} title="Confianza visible" desc="Inspecciones técnicas de 150 puntos en cada vehículo." />
        <Feature icon={<FiCamera/>} title="Fotos protagonistas" desc="Estética editorial que resalta cada detalle de tu auto." />
        <Feature icon={<FiZap/>} title="Listo para convertir" desc="Proceso de compra y venta optimizado para Colima." />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center bg-[#0a0a0a] p-16 rounded-3xl border border-white/5">
        <div>
          <h2 className="text-5xl text-white font-extralight mb-8 leading-tight tracking-tight">Diseñado para compradores y vendedores que <span className="text-[#e7b476] font-normal">esperan algo mejor.</span></h2>
          <div className="flex gap-16 mt-12">
            <div><p className="text-5xl text-white font-bold tracking-tighter">1,250+</p><p className="text-white/40 text-[10px] uppercase tracking-widest mt-4">Autos Verificados</p></div>
            <div><p className="text-5xl text-white font-bold tracking-tighter">24h</p><p className="text-white/40 text-[10px] uppercase tracking-widest mt-4">Soporte Activo</p></div>
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974" className="w-full h-[500px] object-cover rounded-2xl grayscale opacity-50 shadow-2xl" alt="Lujo" />
      </div>
    </section>
  );
}

const Feature = ({ icon, title, desc }) => (
  <div className="text-left">
    <div className="text-[#e7b476] text-3xl mb-6">{icon}</div>
    <h4 className="text-white text-xl font-medium mb-4">{title}</h4>
    <p className="text-white/40 text-sm leading-relaxed font-light">{desc}</p>
  </div>
);