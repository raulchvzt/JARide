import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-10   py-6 bg-transparent backdrop-blur-sm">
      <a href="/" className="text-white font-black italic text-2xl tracking-tighter">JARide</a>
      <div className="hidden md:flex gap-8 text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold">
        <a href="/comprar" className="hover:text-white transition group relative">
          Comprar
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#e7b476] group-hover:w-full transition-all"></span>
        </a>
        <a href="/vender" className="hover:text-white transition">Vender</a>
        <a href="/verificados" className="hover:text-white transition">Verificados</a>
        <a href="/finanzas" className="hover:text-white transition">Financiamiento</a>
      </div>
      <div className="flex gap-4">
        <a href="/login" className="text-white text-[10px] uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition" >Ingresar</a>
      </div>
    </nav>
  );
}