import React from "react";
import { LuX, LuCheck } from "react-icons/lu";

// --- COMPONENTE: FILA DE VALIDACIÓN DE AUTOS ---
export function ValidationRow({ img, name, info, onAccept, onReject }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className="w-24 h-16 rounded-lg overflow-hidden bg-white/5">
          <img
            src={img}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500 scale-110"
            alt={name}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-tight text-white">{name}</h4>
          <p className="text-[10px] text-white/30 font-medium">{info}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onReject} className="text-white/20 hover:text-red-500 transition-colors p-2" title="Rechazar">
          <LuX size={18} />
        </button>
        <button onClick={onAccept} className="bg-[#e7b476] text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg shadow-[#e7b476]/5">
          Aceptar
        </button>
      </div>
    </div>
  );
}

// --- COMPONENTE: ITEM DE REPORTE ---
export function ReportItem({ user, status, msg, time, resolved, onGestionar }) {
  return (
    <div className={`space-y-2 border-l-2 pl-4 transition-opacity ${resolved ? "opacity-30 border-white/10" : "border-[#e7b476]"}`}>
      <div className="flex justify-between items-center">
        <h5 className="text-[10px] font-black uppercase tracking-tight text-white/80">
          Reporte a: {user}
        </h5>
        <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded ${resolved ? "border-white/10 text-white/40" : "border-[#e7b476] text-[#e7b476]"}`}>
          {status}
        </span>
      </div>
      <p className="text-xs italic text-white/50 leading-snug font-light line-clamp-2">
        "{msg}"
      </p>
      <div className="flex justify-between items-center pt-2">
        <span className="text-[9px] text-white/20 font-bold uppercase tracking-tighter">{time}</span>
        {!resolved && onGestionar && (
          <button
            onClick={onGestionar}
            className="text-[9px] font-black uppercase text-[#e7b476] hover:underline transition-all"
          >
            Resolver
          </button>
        )}
      </div>
    </div>
  );
}

// --- COMPONENTE: ITEM DE FEED DE ACTIVIDAD ---
export function ActividadItem({ texto, tiempo }) {
  return (
    <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0 mb-3 last:mb-0">
      <p className="text-[11px] text-white/40 font-medium leading-tight">{texto}</p>
      <span className="text-[9px] text-white/10 font-bold whitespace-nowrap uppercase tracking-tighter">{tiempo}</span>
    </div>
  );
}