import React from 'react';
import { FiSearch } from 'react-icons/fi';

export default function Searchbar() {
  return (
    <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-y border-white/5 py-6 px-10 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex gap-10 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">
        {['Marca', 'Año', 'Precio', 'Kilometraje'].map((filter) => (
          <span key={filter} className="hover:text-white cursor-pointer transition flex items-center gap-2">
            {filter} <span className="text-[8px]">▼</span>
          </span>
        ))}
      </div>
      <button className="bg-[#e7b476] text-black text-[15px] font-black uppercase tracking-widest px-10 py-3 rounded-full hover:bg-[#d49f65] transition flex items-center gap-2">
        <FiSearch /> Buscar Vehículo
      </button>
    </div>
  );
}