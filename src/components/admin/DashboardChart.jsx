import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area
} from 'recharts';

const COLORES = ['#e7b476', '#a78bfa', '#34d399', '#60a5fa', '#f87171', '#fbbf24'];

const TooltipCustom = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-xs">
        <p className="text-white/50 mb-1">{label}</p>
        <p className="text-[#e7b476] font-bold">{payload[0].value} {payload[0].name === 'total' ? 'usuarios' : 'autos'}</p>
      </div>
    );
  }
  return null;
};

function GraficaCategorias() {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/graficas/categorias`)
      .then(r => r.json())
      .then(d => { setData(d); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  return (
    <div className="bg-[#111] rounded-3xl border border-white/5 p-8">
      <h3 className="text-lg font-medium mb-1">Autos por Categoría</h3>
      <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-6">Solo aprobados</p>
      {cargando ? (
        <div className="h-56 flex items-center justify-center text-white/20 text-sm">Cargando...</div>
      ) : data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-white/20 text-sm">Sin datos aún</div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff30', fontSize: 10 }} dy={8} />
              <YAxis hide allowDecimals={false} />
              <Tooltip content={<TooltipCustom />} cursor={{ fill: '#ffffff05' }} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function GraficaMarcas() {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/graficas/marcas`)
      .then(r => r.json())
      .then(d => { setData(d); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold">{`${(percent * 100).toFixed(0)}%`}</text>;
  };

  return (
    <div className="bg-[#111] rounded-3xl border border-white/5 p-8">
      <h3 className="text-lg font-medium mb-1">Autos por Marca</h3>
      <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-6">Top 6 marcas</p>
      {cargando ? (
        <div className="h-56 flex items-center justify-center text-white/20 text-sm">Cargando...</div>
      ) : data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-white/20 text-sm">Sin datos aún</div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={90} labelLine={false} label={renderLabel}>
                {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v + ' autos', n]} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#ffffff60', fontSize: 11 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function GraficaUsuarios() {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/graficas/usuarios-mes`)
      .then(r => r.json())
      .then(d => { setData(d); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  // Mostrar solo cada 5 días en el eje X para no saturar
  const tickFormatter = (val, i) => i % 5 === 0 ? val : '';

  return (
    <div className="bg-[#111] rounded-3xl border border-white/5 p-8 lg:col-span-3">
      <h3 className="text-lg font-medium mb-1">Nuevos Usuarios Registrados</h3>
      <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-6">Últimos 30 días</p>
      {cargando ? (
        <div className="h-56 flex items-center justify-center text-white/20 text-sm">Cargando...</div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 9 }} dy={8} tickFormatter={tickFormatter} />
              <YAxis hide allowDecimals={false} />
              <Tooltip content={<TooltipCustom />} />
              <Area type="monotone" dataKey="total" stroke="#a78bfa" strokeWidth={2} fillOpacity={1} fill="url(#colorUsuarios)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function DashboardCharts() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-medium">Estadísticas Visuales</h2>
          <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mt-1">Datos en tiempo real</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GraficaCategorias />
        <GraficaMarcas />
        <GraficaUsuarios />
      </div>
    </div>
  );
}