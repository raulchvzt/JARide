import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const auto = {
    marca: "AUDI",
    modelo: "R8 V10 Performance",
    precio: 185000,
    año: 2021,
    km: 12500,
    combustible: "Gasolina",
    ubicacion: "Polanco, CDMX",
    badges: ["Inspección 360°", "Selección Destacada"],
    vendedor: {
        nombre: "Luxury Motors Inc.",
        tipo: "Vendedor verificado en JARide",
        avatar: "LM",
    },
    financiamiento: "Opciones de pago premium disponibles desde MX$ 3,250 al mes con enganche del 38%...",
    descripcion: [
        "Un ícono del rendimiento y el diseño automotriz. Este Audi R8 V10 Performance ofrece una experiencia de conducción inigualable, combinando la precisión de la ingeniería alemana con una estética visual verdaderamente espectacular.",
        "Mantenido en perfectas condiciones bajo un uso estrictamente cuidadoso. La pintura original plateada resalta bajo cualquier condición de luz, mientras que su interior de cuero premium con acentos en fibra de carbono te envuelve en una atmósfera de puro lujo deportivo.",
        "Historial de servicio completo disponible y verificado por mecánicos certificados de JARide. Listo para su próximo dueño exigente.",
    ],
    specs: [
        { label: "MOTOR", valor: "5.2L V10 Atmosférico" },
        { label: "POTENCIA", valor: "610 HP" },
        { label: "ACELERACIÓN 0-100 KM/H", valor: "3.2 segundos" },
        { label: "TRACCIÓN", valor: "Quattro (Integral)" },
        { label: "TRANSMISIÓN", valor: "Automática 7 Vel. (S tronic)" },
        { label: "INTERIOR", valor: "Cuero Nappa Fina" },
    ],
    imgPrincipal: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80",
    galeria: [
         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
    ],
};


export default function DetallesCompra() {
    const [imgActiva, setImgActiva] = useState(auto.imgPrincipal);

    const formatPrecio = (p) => 'MX$ ' + p.toLocaleString('en-MX');
  return (
<div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingTop: '56px' }}>
            <Navbar />

            {/* BREADCRUMB */}
<div style={{ padding: '16px 40px', fontSize: '11px', color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '56px' }}>
                <span style={{ cursor: 'pointer' }}>Inicio</span>
                <span style={{ margin: '0 8px' }}>›</span>
                <span style={{ cursor: 'pointer' }}>Audi</span>
                <span style={{ margin: '0 8px' }}>›</span>
                <span style={{ color: '#9ca3af' }}>R8 V10 Performance</span>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div style={{ display: 'flex', gap: '48px', padding: '0 40px 80px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* COLUMNA IZQUIERDA */}
                <div style={{ flex: 1 }}>

                    {/* Imagen principal */}
                    <div style={{ borderRadius: '16px', overflow: 'hidden', height: '400px', marginBottom: '16px' }}>
                        <img src={imgActiva} alt="Auto principal"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Galería */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '40px' }}>
                        {auto.galeria.map((img, i) => (
                            <div key={i}
                                onClick={() => setImgActiva(img)}
                                style={{
                                    height: '110px', borderRadius: '10px', overflow: 'hidden',
                                    cursor: 'pointer', border: imgActiva === img ? '2px solid #f1c98a' : '2px solid transparent',
                                    transition: 'border 0.2s',
                                }}>
                                <img src={img} alt={`Foto ${i + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>

                    {/* Descripción */}
                    <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Descripción del vehículo</h2>
                    {auto.descripcion.map((p, i) => (
                        <p key={i} style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.8, marginBottom: '14px' }}>{p}</p>
                    ))}

                    {/* Especificaciones */}
                    <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '36px 0 20px' }}>Especificaciones Técnicas</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        {auto.specs.map((s, i) => (
                            <div key={i}>
                                <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
                                <div style={{ fontSize: '15px', fontWeight: 600, color: '#e5e7eb' }}>{s.valor}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div style={{ width: '300px', flexShrink: 0 }}>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        {auto.badges.map((b, i) => (
                            <span key={i} style={{
                                background: i === 0 ? '#f1c98a20' : '#ffffff15',
                                border: `1px solid ${i === 0 ? '#f1c98a60' : '#ffffff30'}`,
                                color: i === 0 ? '#f1c98a' : '#d1d5db',
                                fontSize: '11px', fontWeight: 600,
                                padding: '4px 12px', borderRadius: '20px',
                            }}>
                                {i === 0 && '⟳ '}{b}
                            </span>
                        ))}
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
                            { icon: '📅', texto: `Año ${auto.año}` },
                            { icon: '⚡', texto: `${auto.km.toLocaleString('es-MX')} km` },
                            { icon: '⛽', texto: auto.combustible },
                            { icon: '📍', texto: auto.ubicacion },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#d1d5db' }}>
                                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                                {item.texto}
                            </div>
                        ))}
                    </div>

                    {/* Vendedor */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px', background: '#141414', borderRadius: '12px',
                        border: '1px solid #2a2a2a', marginBottom: '16px',
                    }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: '#f1c98a30', border: '1px solid #f1c98a60',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 700, color: '#f1c98a', flexShrink: 0,
                        }}>
                            {auto.vendedor.avatar}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{auto.vendedor.nombre}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>✓ {auto.vendedor.tipo}</div>
                        </div>
                    </div>

                    {/* Botones */}
                    <button style={{
                        width: '100%', padding: '14px', background: '#f1c98a', color: '#000',
                        border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
                        cursor: 'pointer', marginBottom: '10px',
                    }}>
                        Contactar al vendedor
                    </button>
                    <button style={{
                        width: '100%', padding: '14px', background: 'none', color: '#fff',
                        border: '1px solid #2a2a2a', borderRadius: '12px', fontSize: '14px',
                        fontWeight: 500, cursor: 'pointer', marginBottom: '20px',
                    }}>
                        Agendar una inspección en persona
                    </button>

                    {/* Financiamiento */}
                    <div style={{
                        padding: '16px', background: '#141414',
                        border: '1px solid #2a2a2a', borderRadius: '12px',
                    }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>¿Buscas financiamiento?</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.6, marginBottom: '12px' }}>
                            {auto.financiamiento}
                        </div>
                        <button style={{
                            background: 'none', border: 'none', color: '#f1c98a',
                            fontSize: '13px', cursor: 'pointer', padding: 0, fontWeight: 500,
                        }}>
                            Calcular opciones →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    
  );
}
