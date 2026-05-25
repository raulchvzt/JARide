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
        <p className="text-[#e7b476] font-bold">{payload[0].value} autos</p>
      </div>
    );
  }
  return null;
};

const TooltipUsuarios = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-xs">
        <p className="text-white/50 mb-1">{label}</p>
        <p className="text-[#a78bfa] font-bold">{payload[0].value} usuarios</p>
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
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(Array.isArray(d) ? d : []); setCargando(false); })
      .catch(err => { console.error('Error categorias:', err); setCargando(false); });
  }, []);

  return (
    <div className="bg-[#111] rounded-3xl border border-white/5 p-8">
      <h3 className="text-lg font-medium mb-1">Autos por Categoría</h3>
      <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-6">Solo aprobados</p>
      {cargando ? (
        <div className="flex items-center justify-center" style={{ height: '224px' }}>
          <p className="text-white/20 text-sm">Cargando...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: '224px' }}>
          <p className="text-white/20 text-sm">Sin datos aún</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: '224px' }}>
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
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(Array.isArray(d) ? d : []); setCargando(false); })
      .catch(err => { console.error('Error marcas:', err); setCargando(false); });
  }, []);

  return (
    <div className="bg-[#111] rounded-3xl border border-white/5 p-8">
      <h3 className="text-lg font-medium mb-1">Autos por Marca</h3>
      <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-6">Top 6 marcas</p>
      {cargando ? (
        <div className="flex items-center justify-center" style={{ height: '224px' }}>
          <p className="text-white/20 text-sm">Cargando...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: '224px' }}>
          <p className="text-white/20 text-sm">Sin datos aún</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: '224px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
            >
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#ffffff50', fontSize: 11 }}
                width={80}
              />
                          <Tooltip content={<TooltipCustom />} cursor={{ fill: '#ffffff05' }} />

              <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={18}>
                {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
              </Bar>
            </BarChart>
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
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(Array.isArray(d) ? d : []); setCargando(false); })
      .catch(err => { console.error('Error usuarios-mes:', err); setCargando(false); });
  }, []);

  const tickFormatter = (val, i) => i % 5 === 0 ? val : '';

  return (
    <div className="bg-[#111] rounded-3xl border border-white/5 p-8 lg:col-span-3">
      <h3 className="text-lg font-medium mb-1">Nuevos Usuarios Registrados</h3>
      <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-6">Últimos 30 días</p>
      {cargando ? (
        <div className="flex items-center justify-center" style={{ height: '224px' }}>
          <p className="text-white/20 text-sm">Cargando...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: '224px' }}>
          <p className="text-white/20 text-sm">Sin datos aún</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: '224px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#ffffff20', fontSize: 9 }}
                dy={8}
                tickFormatter={tickFormatter}
              />
              <YAxis hide allowDecimals={false} />
              <Tooltip content={<TooltipUsuarios />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#a78bfa"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsuarios)"
              />
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