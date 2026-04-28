import React, { useState } from 'react';
import { 
  LuSearch, 
  LuCar, 
  LuCheck, // Cambiado: LuCheckCircle no existe en tu versión
  LuPause, 
  LuTrash2, 
  LuPlus 
} from "react-icons/lu";

export default function Vehiculos() {
  const [autos] = useState([
    { id: 1, modelo: "Porsche GT3 RS", precio: "4,500", status: "Activo", dueño: "Exotic Rents", img: "/src/assets/Porsche-GT3-RS-041.jpg" },
    { id: 2, modelo: "Audi Q8 S-Line", precio: "1,200", status: "Pendiente", dueño: "Carlos M.", img: "/src/assets/audiq8.jpg" }
  ]);

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-medium text-white">Vehículos</h1>
        <button className="bg-[#e7b476] text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase">
         Añadir Vehículo
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {autos.map((auto) => (
          <div key={auto.id} className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden group">
            <div className="relative h-48">
              <img src={auto.img} className="w-full h-full object-cover opacity-60" alt={auto.modelo} />
            </div>
            <div className="p-6">
              <h4 className="font-bold text-lg text-white">{auto.modelo}</h4>
              <div className="flex gap-4 mt-4 border-t border-white/5 pt-4">
                <button className="text-white/20 hover:text-green-500"><LuCheck size={18} /></button>
                <button className="text-white/20 hover:text-yellow-500"><LuPause size={18} /></button>
                <button className="text-white/20 hover:text-red-500"><LuTrash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}