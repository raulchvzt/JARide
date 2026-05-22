import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const CATEGORIAS = [
  { val: 'vehiculo', label: '🚗 Vehículo', desc: 'Problemas con un auto publicado' },
  { val: 'usuario',  label: '👤 Usuario',  desc: 'Comportamiento inapropiado de otro usuario' },
  { val: 'pago',     label: '💳 Pago',     desc: 'Problemas con pagos o cobros' },
  { val: 'fraude',   label: '⚠️ Fraude',   desc: 'Actividad sospechosa o engaño' },
  { val: 'general',  label: '📋 General',  desc: 'Otro tipo de problema' },
];

export default function CrearReporte() {
  const navigate = useNavigate();
  const emailActual = sessionStorage.getItem('usuarioEmail') || '';
  const [misReportes, setMisReportes] = useState([]);

  const [categoria, setCategoria] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!emailActual) return;
    fetch(`${API}/api/reportes/mis-reportes?email=${emailActual}`)
      .then(r => r.json()).then(setMisReportes).catch(() => {});
  }, [emailActual, exito]);

  const enviar = async () => {
    if (!emailActual) { navigate('/login'); return; }
    if (!categoria || !titulo || !descripcion) { setError('Completa todos los campos'); return; }
    setError('');
    setEnviando(true);
    try {
      const res = await fetch(`${API}/api/reportes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_email: emailActual, titulo, descripcion, categoria })
      });
      const data = await res.json();
      if (data.success) {
        setExito(true);
        setCategoria(''); setTitulo(''); setDescripcion('');
        setTimeout(() => setExito(false), 4000);
      }
    } catch { setError('Error de conexión'); }
    finally { setEnviando(false); }
  };

  const estadoColor = {
    pendiente: { color: '#f59e0b', bg: '#f59e0b15' },
    urgente:   { color: '#ef4444', bg: '#ef444415' },
    revision:  { color: '#3b82f6', bg: '#3b82f615' },
    resuelto:  { color: '#22c55e', bg: '#22c55e15' },
  };

  const inputStyle = { width: '100%', padding: '12px 14px', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif' };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingTop: '56px' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Centro de Reportes</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Reporta cualquier problema y nuestro equipo lo atenderá a la brevedad</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

          {/* FORMULARIO */}
          <div>
            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '28px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 24px' }}>Nuevo reporte</h2>

              {/* Categoría */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>Categoría</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CATEGORIAS.map(c => (
                    <div key={c.val} onClick={() => setCategoria(c.val)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: categoria === c.val ? '#f1c98a10' : '#141414', border: `1px solid ${categoria === c.val ? '#f1c98a40' : '#2a2a2a'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <span style={{ fontSize: '16px' }}>{c.label.split(' ')[0]}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: categoria === c.val ? '#f1c98a' : '#fff' }}>{c.label.split(' ').slice(1).join(' ')}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Título */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Título del reporte</label>
                <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Describe brevemente el problema..." style={inputStyle} />
              </div>

              {/* Descripción */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Descripción detallada</label>
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Explica con detalle qué ocurrió, cuándo y cómo podemos ayudarte..." rows={5}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
              {exito && (
                <div style={{ background: '#22c55e15', border: '1px solid #22c55e40', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#4ade80', marginBottom: '16px' }}>
                  ✓ Reporte enviado correctamente. Te responderemos pronto.
                </div>
              )}

              <button onClick={enviar} disabled={enviando}
                style={{ width: '100%', padding: '14px', background: '#f1c98a', border: 'none', borderRadius: '12px', color: '#000', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif', opacity: enviando ? 0.7 : 1 }}>
                {enviando ? 'Enviando...' : !emailActual ? 'Inicia sesión para reportar' : 'Enviar reporte'}
              </button>
            </div>
          </div>

          {/* MIS REPORTES */}
          <div>
            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '28px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 24px' }}>Mis reportes</h2>

              {!emailActual ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b7280', fontSize: '13px' }}>
                  Inicia sesión para ver tus reportes
                </div>
              ) : misReportes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b7280', fontSize: '13px' }}>
                  No has enviado ningún reporte aún
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {misReportes.map(r => {
                    const s = estadoColor[r.estado] || estadoColor.pendiente;
                    return (
                      <div key={r.id} style={{ padding: '14px', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{r.titulo}</span>
                          <span style={{ background: s.bg, color: s.color, fontSize: '9px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', flexShrink: 0, marginLeft: '8px' }}>
                            {r.estado}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {r.descripcion}
                        </p>
                        <span style={{ fontSize: '10px', color: '#4b5563' }}>
                          {new Date(r.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}