import React from 'react';

export default function Reportes() {
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-medium tracking-tight mb-10 text-white">Centro de Reportes</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {[1, 2].map((item) => (
          <div key={item} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-red-500/20 transition-all shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 font-bold">
                  !
                </div>
                <div>
                  <h3 className="font-bold text-white">Incidente en Renta #8829</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-black mt-1">Reportado por: Juan Pérez</p>
                </div>
              </div>
              <span className="bg-red-500/20 text-red-500 text-[9px] px-3 py-1 rounded-full font-black uppercase border border-red-500/20">Urgente</span>
            </div>
            
            <div className="bg-white/3 rounded-xl p-4 mb-6 border border-white/5">
              <p className="text-sm text-white/70 leading-relaxed italic">
                "El vehículo fue entregado con el tanque vacío y hay un rayón en la puerta derecha que no estaba en las fotos de validación."
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-white/30 text-[11px] font-bold uppercase tracking-tighter">
                <span>• Hace 2 horas</span>
                <span>• 3 Comentarios</span>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white hover:bg-white/10 transition">Ignorar</button>
                <button className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-[#e7b476] transition">Resolver Caso</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}