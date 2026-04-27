import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';


const autos = [
    {
        id: 1, marca: "AUDI", modelo: "R8", precio: 89500, año: 2023,
        km: 36393, combustible: "Gasolina", badge: "Verificado", badgeColor: "#16a34a",
        img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80",
    },
    {
        id: 2, marca: "AUDI", modelo: "RS E-tron GT", precio: 74500, año: 2023,
        km: 12000, combustible: "Eléctrico", badge: "Verificado", badgeColor: "#16a34a",
        img: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&q=80",
    },
    {
        id: 3, marca: "AUDI", modelo: "Q4 E-tron", precio: 52400, año: 2024,
        km: 5000, combustible: "Eléctrico", badge: "Verificado", badgeColor: "#16a34a",
       img: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&q=80",
    },
    {
        id: 4, marca: "PORSCHE", modelo: "911 Carrera S", precio: 115000, año: 2022,
        km: 24000, combustible: "Gasolina", badge: "Premium", badgeColor: "#b45309",
        img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&q=80",
    },
    {
        id: 5, marca: "MERCEDES-BENZ", modelo: "G-Class", precio: 130000, año: 2021,
        km: 45000, combustible: "Gasolina", badge: "Verificado", badgeColor: "#16a34a",
        img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80",
    },
    {
        id: 6, marca: "BMW", modelo: "M4 Competition", precio: 82000, año: 2023,
        km: 18500, combustible: "Gasolina", badge: "Certificado", badgeColor: "#1d4ed8",
        img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
    },
];

const categorias = ["SUVs", "Sedanes", "Deportivos", "Eléctricos", "Clásicos"];



export default function VentanaComprar() {

  const [favoritos, setFavoritos] = useState([]);

const toggleFavorito = (id) => {
    setFavoritos(prev =>
        prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
};

    const [busqueda, setBusqueda] = useState("");
    const [tipo, setTipo] = useState("Sedan, SUV");
    const [precio, setPrecio] = useState("MX$ 10k - 50k");
    const [condicion, setCondicion] = useState("Nuevo y Usado");
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [ordenar, setOrdenar] = useState("Recomendados");

    const toggleCategoria = (cat) => {
        setCategoriasSeleccionadas(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const formatKm = (km) => km.toLocaleString('es-MX') + ' km';
    const formatPrecio = (p) => 'MX$ ' + p.toLocaleString('en-MX');

    const navigate = useNavigate();

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
            <Navbar />

            {/* HERO */}
            <div style={{ textAlign: 'center', padding: '80px 40px 60px' }}>
                <h1 style={{ fontSize: '64px', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, margin: '0 0 20px' }}>
                    Autos para cada<br />elección
                </h1>
                <p style={{ fontSize: '16px', color: '#9ca3af', maxWidth: '480px', margin: '0 auto 48px', lineHeight: 1.7 }}>
                    Un marketplace de autos con una presencia más editorial: confianza, selección cuidada y una experiencia premium para comprar mejor.
                </p>

                {/* BUSCADOR */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    background: '#141414', border: '1px solid #2a2a2a',
                    borderRadius: '50px', padding: '8px 8px 8px 20px',
                    maxWidth: '760px', margin: '0 auto',
                }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2" style={{ flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <div style={{ flex: 1, marginLeft: '12px', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Buscar marca, modelo o versión</div>
                        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Audi, BMW, Mercedes..."
                            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', width: '100%', marginTop: '2px' }} />
                    </div>
                    <div style={{ width: '1px', height: '36px', background: '#2a2a2a' }} />
                    <div style={{ padding: '0 16px', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tipo</div>
                        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                            {['Sedan, SUV', 'Sedanes', 'SUVs', 'Deportivos', 'Eléctricos'].map(t => (
                                <option key={t} value={t} style={{ background: '#1a1a1a' }}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ width: '1px', height: '36px', background: '#2a2a2a' }} />
                    <div style={{ padding: '0 16px', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Precio</div>
                        <select value={precio} onChange={e => setPrecio(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                            {['MX$ 10k - 50k', 'MX$ 50k - 100k', 'MX$ 100k+'].map(p => (
                                <option key={p} value={p} style={{ background: '#1a1a1a' }}>{p}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ width: '1px', height: '36px', background: '#2a2a2a' }} />
                    <div style={{ padding: '0 16px', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Condición</div>
                        <select value={condicion} onChange={e => setCondicion(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                            {['Nuevo y Usado', 'Nuevo', 'Usado'].map(c => (
                                <option key={c} value={c} style={{ background: '#1a1a1a' }}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '40px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginLeft: '8px', flexShrink: 0 }}>
                        Buscar
                    </button>
                </div>
            </div>

            {/* BODY — flex con sidebar + grid */}
            <div style={{ display: 'flex', padding: '0 40px 80px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* SIDEBAR ← cierra ANTES del grid */}
                <div style={{ width: '240px', flexShrink: 0, paddingRight: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af' }}>Filtros</span>
                        <button onClick={() => setCategoriasSeleccionadas([])}
                            style={{ background: 'none', border: 'none', color: '#f5f3f0', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ↺ Limpiar filtros
                        </button>
                    </div>

                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#e5e7eb' }}>Categoría</p>
                    {categorias.map(cat => (
                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer', fontSize: '13px', color: '#9ca3af' }}>
                            <input type="checkbox" checked={categoriasSeleccionadas.includes(cat)} onChange={() => toggleCategoria(cat)}
                                style={{ accentColor: '#f1c98a', width: '14px', height: '14px' }} />
                            {cat}
                        </label>
                    ))}

                    <p style={{ fontSize: '13px', fontWeight: 600, margin: '24px 0 12px', color: '#e5e7eb' }}>Precio</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Mínimo</div>
                            <input placeholder="$10,000" style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Máximo</div>
                            <input placeholder="$150,000" style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }} />
                        </div>
                    </div>

                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#e5e7eb' }}>Año</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Desde</div>
                            <input placeholder="Ej. 2018" style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Hasta</div>
                            <input placeholder="Ej. 2024" style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                    </div>
                </div> {/* ← SIDEBAR cierra aquí */}

                {/* GRID ← empieza aquí, fuera del sidebar */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Autos listos para explorar</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>Ordenar por:</span>
                            <select value={ordenar} onChange={e => setOrdenar(e.target.value)} style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '6px 12px', color: '#fff', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                                {['Recomendados', 'Menor precio', 'Mayor precio', 'Más nuevos'].map(o => (
                                    <option key={o} value={o} style={{ background: '#1a1a1a' }}>{o}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {autos.map(auto => (
                            <div key={auto.id} style={{
                                background: '#111', border: '1px solid #1f1f1f',
                                borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                                transition: 'border-color 0.2s, transform 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f1f1f'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                                    <img src={auto.img} alt={auto.modelo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{
                                        position: 'absolute', top: '12px', left: '12px',
                                        background: auto.badgeColor, color: '#fff',
                                        fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                                    }}>
                                        {auto.badge}
                                    </span>
                                </div>
                                <div style={{ padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{auto.marca}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 700 }}>{auto.modelo}</div>
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1c98a' }}>{formatPrecio(auto.precio)}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', margin: '8px 0', color: '#6b7280', fontSize: '12px' }}>
                                        <span>{auto.año}</span><span>·</span><span>{formatKm(auto.km)}</span>
                                    </div>
                                    <div style={{ display: 'inline-block', fontSize: '11px', color: '#9ca3af', background: '#1a1a1a', borderRadius: '6px', padding: '3px 10px', marginBottom: '12px' }}>
                                        {auto.combustible}
                                    </div>
                                    <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button
    onClick={() => navigate(`/auto/${auto.id}`)}
    style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', padding: 0 }}
>
    Ver detalles
</button>
                                        <button
                                        
    onClick={(e) => {
        e.stopPropagation();
        toggleFavorito(auto.id);
    }}
    style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: favoritos.includes(auto.id) ? '#f1c98a20' : '#1a1a1a',
        border: favoritos.includes(auto.id) ? '1px solid #f1c98a' : '1px solid #2a2a2a',
        cursor: 'pointer',
        color: favoritos.includes(auto.id) ? '#f1c98a' : '#6b7280',
        fontSize: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
    }}
>
    {favoritos.includes(auto.id) ? '♥' : '♡'}
</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '40px', padding: '12px 32px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                            Cargar más vehículos
                        </button>
                    </div>
                </div> 

            </div> 
        </div> 
    );
}