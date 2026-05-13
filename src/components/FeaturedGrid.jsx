import React, { useRef, useEffect } from 'react';

// Modificamos el componente Card para que soporte video
const Card = ({ title, sub, img, video, span = "", desc = "" }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 5; // Empieza 5 segundos después
    }
  }, []);

  return (
    <div className={`relative overflow-hidden bg-[#111] group rounded-xl ${span}`}>
      
      {/* Lógica: Si hay video, renderiza <video>, si no, renderiza <img> */}
      {video ? (
        <video
          ref={videoRef}
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-1000"
        />
      ) : (
        <img 
          src={img} 
          className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-1000" 
          alt={title} 
        />
      )}

      <div className="absolute inset-0 p-10 flex flex-col justify-end bg-linear-to-t from-black via-black/20 to-transparent">
        <p className="text-[#e7b476] text-[10px] uppercase tracking-[0.4em] mb-3 font-bold">{sub}</p>
        <h3 className="text-3xl text-white font-light tracking-tight">{title}</h3>
        {desc && <p className="text-white/40 text-xs mt-3 font-light max-w-xs">{desc}</p>}
      </div>
    </div>
  );
};

export default function FeaturedGrid() {
  return (
    <section className="bg-black py-24 px-10 md:px-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <h2 className="text-4xl md:text-6xl text-white font-extralight leading-tight max-w-2xl font-sans">
          Inspirado en una estética editorial, <span className="font-normal">pero pensado para vender.</span>
        </h2>
        <p className="text-white/30 uppercase text-[10px] tracking-[0.5em] border-b border-white/10 pb-2">Autos listos para explorar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-250">
        <Card 
            title="Porsche GT3 RS" 
            sub="Selección Premium" 
            img="/src/assets/porscheW.jpg" 
        />
        <Card 
            title="Audi Q3" 
            sub="Innovación" 
            img="/src/assets/audiq3.jpg" 
        />
        <Card 
            title="SUVs Seleccionadas" 
            sub="Versatilidad" 
            img="/src/assets/ca.jpg" 
            span="md:row-span-2" 
            desc="Rendimiento y uso diario. Una selección de SUVs para Colima." 
        />
        
        <Card 
            title="Publica tu auto con mejor presencia" 
            sub="Vendedores" 
            video="/src/assets/Lamborghini Aventador SVJ Terrorizing Miami _ 4K.mp4" 
            span="md:col-span-2" 
            desc="JARide combina la estética editorial para presentar tu auto de manera exclusiva." 
        />
      </div>
    </section>
  );
}