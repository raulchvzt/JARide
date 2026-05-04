import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';


const categorias = ["SUVs", "Sedanes", "PickUps", "Deportivos", "Eléctricos"];

export default function VentanaComprar() {
    const [autosApi, setAutosApi] = useState([]); 
    const [favoritos, setFavoritos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarAutos = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/autos');
                const data = await res.json();
                
                const autosFormateados = data.map(a => ({
                    id: a.id,
                    marca: a.marca.toUpperCase(),
                    modelo: a.modelo,
                    precio: parseInt(a.precio.replace(/,/g, '')) || 0, // Limpiamos comas si existen
                    año: a.anio,
                    km: parseInt(a.km) || 0,
                    combustible: a.combustible || "Gasolina",
                    badge: a.verificado ? "Verificado" : "Reciente",
                    badgeColor: a.verificado ? "#16a34a" : "#1d4ed8", // Verde para verificado, azul para reciente
                    categoria: a.categoria,
                    estado: a.estado, // <--- Guardamos el estado que viene del JSON
                    img: a.photos && a.photos[0] ? a.photos[0] : "https://via.placeholder.com/600x400?text=Sin+Foto"
                }));

                setAutosApi(autosFormateados);
            } catch (error) {
                console.error("Error cargando autos de la API:", error);
            }
        };

        cargarAutos();
    }, []);

    const todosLosAutos = [...autosApi];

    // --- LÓGICA DE FILTRADO CON APROBACIÓN ---
    const autosFiltrados = todosLosAutos.filter(auto => {
        const coincideBusqueda = 
            auto.modelo.toLowerCase().includes(busqueda.toLowerCase()) || 
            auto.marca.toLowerCase().includes(busqueda.toLowerCase());

        const coincideCategoria = 
            categoriasSeleccionadas.length === 0 || 
            categoriasSeleccionadas.includes(auto.categoria);

        // REGLA DE ORO: Solo mostrar si está aprobado
        const esAprobado = auto.estado === "aprobado";

        return coincideBusqueda && coincideCategoria && esAprobado;
    });

    const toggleFavorito = (id) => {
        setFavoritos(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const formatKm = (km) => km.toLocaleString('es-MX') + ' km';
    const formatPrecio = (p) => 'USD$ ' + p.toLocaleString('en-MX');

    const toggleCategoria = (cat) => {
        setCategoriasSeleccionadas(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
            <Navbar />

            {/* HERO */}
            <div style={{ textAlign: 'center', padding: '120px 40px 60px' }}>
                <h1 style={{ fontSize: '64px', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, margin: '0 0 20px' }}>
                    Autos para cada<br />elección
                </h1>
                <p style={{ fontSize: '16px', color: '#9ca3af', maxWidth: '480px', margin: '0 auto 48px', lineHeight: 1.7 }}>
                    Explora nuestra selección premium de vehículos verificados por expertos.
                </p>

                {/* BUSCADOR */}
                <div style={{
                    display: 'flex', alignItems: 'center', background: '#141414', border: '1px solid #2a2a2a',
                    borderRadius: '50px', padding: '8px 8px 8px 20px', maxWidth: '760px', margin: '0 auto',
                }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <div style={{ flex: 1, marginLeft: '12px', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase' }}>Buscar marca o modelo</div>
                        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="¿Qué auto buscas?"
                            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', width: '100%', marginTop: '2px' }} />
                    </div>
                    <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '40px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginLeft: '8px' }}>
                        Buscar
                    </button>
                </div>
            </div>

            {/* CATALOGO */}
            <div style={{ display: 'flex', padding: '0 40px 80px', maxWidth: '1300px', margin: '0 auto' }}>
                {/* SIDEBAR */}
                <div style={{ width: '240px', flexShrink: 0, paddingRight: '32px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af' }}>Filtros</span>
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Categoría</p>
                        {categorias.map(cat => (
                            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer', fontSize: '13px', color: '#9ca3af' }}>
                                <input type="checkbox" checked={categoriasSeleccionadas.includes(cat)} onChange={() => toggleCategoria(cat)}
                                    style={{ accentColor: '#f1c98a' }} />
                                {cat}
                            </label>
                        ))}
                    </div>
                </div>

                {/* GRID */}
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Catálogo Disponible ({autosFiltrados.length})</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {autosFiltrados.map(auto => (
                            <div key={auto.id} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', overflow: 'hidden' }}>
                                <div style={{ position: 'relative', height: '180px' }}>
                                    <img src={auto.img} alt={auto.modelo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{
                                        position: 'absolute', top: '12px', left: '12px', background: auto.badgeColor,
                                        color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase'
                                    }}>
                                        {auto.badge}
                                    </span>
                                </div>

                                <div style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>{auto.marca}</div>
                                            <div style={{ fontSize: '18px', fontWeight: 700 }}>{auto.modelo}</div>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1c98a' }}>{formatPrecio(auto.precio)}</div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', margin: '12px 0', color: '#6b7280', fontSize: '12px' }}>
                                        <span>{auto.año}</span><span>·</span><span>{formatKm(auto.km)}</span>
                                    </div>

                                    <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                        <button onClick={() => navigate(`/auto/${auto.id}`)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                                            Ver detalles
                                        </button>
                                        <button onClick={() => toggleFavorito(auto.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: favoritos.includes(auto.id) ? '#f1c98a' : '#333' }}>
                                            {favoritos.includes(auto.id) ? '♥' : '♡'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> 
            </div> 
        </div> 
    );
}