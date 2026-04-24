import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dataRendimiento = [
  { name: 'Lun', ventas: 4000 },
  { name: 'Mar', ventas: 3000 },
  { name: 'Mie', ventas: 5000 },
  { name: 'Jue', ventas: 2780 },
  { name: 'Vie', ventas: 6890 },
  { name: 'Sab', ventas: 2390 },
  { name: 'Dom', ventas: 3490 },
];

export default function DashboardChart() {
  return (
    <div className="bg-[#111] rounded-2xl border border-white/5 p-8 mb-10 shadow-2xl shadow-black/50 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-medium">Rendimiento de la Plataforma</h3>
          <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Ingresos por rentas y ventas (MXN)</p>
        </div>
        <select className="bg-white/5 border border-white/10 rounded-lg text-[10px] px-3 py-1 text-white/40 outline-none cursor-pointer">
          <option>Últimos 7 días</option>
          <option>Último mes</option>
        </select>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataRendimiento}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e7b476" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#e7b476" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ffffff20', fontSize: 10}} dy={10} />
            <YAxis hide={true} />
            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }} itemStyle={{ color: '#e7b476' }} />
            <Area type="monotone" dataKey="ventas" stroke="#e7b476" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
