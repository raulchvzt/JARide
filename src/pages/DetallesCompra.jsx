import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Auto estético de fallback (solo se muestra si no hay datos reales)
const AUTO_ESTATICO = {
  marca: "AUDI", modelo: "R8 V10 Performance", precio: "185000", anio: "2021",
  km: "12500", combustible: "Gasolina", condicion: "Usado", transmision: "Automática",
  descripcion: "Un ícono del rendimiento y el diseño automotriz. Este Audi R8 V10 Performance ofrece una experiencia de conducción inigualable.",
  categoria: "Deportivos", vendedor: "Luxury Motors Inc.", estado: "aprobado", verificado: true,
  photos: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80",
           "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
           "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80"],
};

export default function DetallesCompra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auto, setAuto] = useState(AUTO_ESTATICO);
  const [cargando, setCargando] = useState(!id);
  const [imgActiva, setImgActiva] = useState(AUTO_ESTATICO.photos[0]);
  const [error, setError] = useState('');
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !id) return;
    initialized.current = true;

    fetch(`${import.meta.env.VITE_API_URL}/api/autos/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setAuto(data);
          setImgActiva(data.photos?.[0] || 'https://via.placeholder.com/900x400?text=Sin+Foto');
        } else {
          setError('Auto no encontrado');
        }
      })
      .catch(() => setError('Error al cargar el auto'))
      .finally(() => setCargando(false));
  }, [id]);

  const formatPrecio = (p) => 'USD$ ' + parseInt(p).toLocaleString('en-US');
  const formatKm = (k) => parseInt(k).toLocaleString('es-MX') + ' km';

  if (cargando) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <p style={{ color: '#6b7280', fontSize: '14px' }}>Cargando vehículo...</p>
    </div>
  );

  if (error) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <Navbar />
      <p style={{ color: '#ef4444', fontSize: '16px' }}>{error}</p>
      <button onClick={() => navigate('/comprar')} style={{ background: '#f1c98a', color: '#000', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>
        Ver catálogo
      </button>
    </div>
  );

  const galeria = auto.photos || [];
  const imagenPrincipal = imgActiva || galeria[0] || 'https://via.placeholder.com/900x400?text=Sin+Foto';

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingTop: '56px' }}>
      <Navbar />

      {/* BREADCRUMB */}
      <div style={{ padding: '16px 40px', fontSize: '11px', color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '56px' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Inicio</span>
        <span style={{ margin: '0 8px' }}>›</span>
        <span onClick={() => navigate('/comprar')} style={{ cursor: 'pointer' }}>Catálogo</span>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#9ca3af' }}>{auto.marca} {auto.modelo}</span>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ display: 'flex', gap: '48px', padding: '0 40px 80px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* COLUMNA IZQUIERDA */}
        <div style={{ flex: 1 }}>

          {/* Imagen principal */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', height: '400px', marginBottom: '16px', background: '#111' }}>
            <img src={imagenPrincipal} alt="Auto principal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Galería */}
          {galeria.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(galeria.length, 4)}, 1fr)`, gap: '12px', marginBottom: '40px' }}>
              {galeria.map((img, i) => (
                <div key={i} onClick={() => setImgActiva(img)} style={{ height: '110px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: imgActiva === img ? '2px solid #f1c98a' : '2px solid transparent', transition: 'border 0.2s' }}>
                  <img src={img} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Descripción */}
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Descripción del vehículo</h2>
          <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.8, marginBottom: '14px' }}>
            {auto.descripcion || 'Sin descripción disponible.'}
          </p>

          {/* Especificaciones */}
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '36px 0 20px' }}>Especificaciones Técnicas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[
              { label: 'CATEGORÍA',     valor: auto.categoria },
              { label: 'AÑO',           valor: auto.anio },
              { label: 'KILOMETRAJE',   valor: formatKm(auto.km) },
              { label: 'COMBUSTIBLE',   valor: auto.combustible },
              { label: 'TRANSMISIÓN',   valor: auto.transmision },
              { label: 'CONDICIÓN',     valor: auto.condicion },
            ].map((s, i) => s.valor ? (
              <div key={i}>
                <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#e5e7eb' }}>{s.valor}</div>
              </div>
            ) : null)}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div style={{ width: '300px', flexShrink: 0 }}>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {auto.verificado && (
              <span style={{ background: '#f1c98a20', border: '1px solid #f1c98a60', color: '#f1c98a', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' }}>
                ✓ Verificado JARide
              </span>
            )}
            <span style={{ background: '#ffffff15', border: '1px solid #ffffff30', color: '#d1d5db', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' }}>
              {auto.categoria}
            </span>
          </div>

          {/* Nombre y precio */}
          <h1 style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>
            {auto.marca} {auto.modelo}
          </h1>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f1c98a', marginBottom: '20px' }}>
            {formatPrecio(auto.precio)}
          </div>

          {/* Info básica */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {[
              { icon: '📅', texto: `Año ${auto.anio}` },
              { icon: '⚡', texto: formatKm(auto.km) },
              { icon: '⛽', texto: auto.combustible },
              { icon: '🔧', texto: auto.transmision },
              { icon: '🏷️', texto: auto.condicion },
            ].filter(i => i.texto && i.texto !== 'undefined').map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#d1d5db' }}>
                <span>{item.icon}</span>{item.texto}
              </div>
            ))}
          </div>

          {/* Vendedor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#141414', borderRadius: '12px', border: '1px solid #2a2a2a', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1c98a30', border: '1px solid #f1c98a60', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#f1c98a', flexShrink: 0 }}>
              {auto.vendedor?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{auto.vendedor}</div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>✓ Vendedor en JARide</div>
            </div>
          </div>

          {/* Botones */}
          <button style={{ width: '100%', padding: '14px', background: '#f1c98a', color: '#000', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginBottom: '10px' }}>
            Contactar al vendedor
          </button>
          <button style={{ width: '100%', padding: '14px', background: 'none', color: '#fff', border: '1px solid #2a2a2a', borderRadius: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '20px' }}>
            Agendar una inspección en persona
          </button>

          {/* Financiamiento */}
          <div style={{ padding: '16px', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>¿Buscas financiamiento?</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.6, marginBottom: '12px' }}>
              Opciones de pago disponibles. Consulta con el vendedor para conocer planes y enganches.
            </div>
            <button onClick={() => navigate('/finanzas')} style={{ background: 'none', border: 'none', color: '#f1c98a', fontSize: '13px', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
              Calcular opciones →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}