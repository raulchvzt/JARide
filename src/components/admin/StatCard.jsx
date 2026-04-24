import React from "react";

export default function StatCard({ title, value, trend, subtext, icon, alert }) {
  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 group hover:border-white/10 transition-all text-white">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[11px] uppercase tracking-widest font-black text-white/30">{title}</p>
        <span className={`${alert ? "text-red-500" : "text-white/10 group-hover:text-[#e7b476]"} text-xl transition-colors`}>
          {icon}
        </span>
      </div>
      <h2 className="text-5xl font-light mb-2 tracking-tighter">{value}</h2>
      <p className="text-[13px] leading-relaxed">
        {trend && <span className="text-green-500 font-bold mr-1">{trend}</span>}
        <span className={`${alert ? "text-red-500" : "text-white/20"} font-medium`}>{subtext}</span>
      </p>
    </div>
  );
}