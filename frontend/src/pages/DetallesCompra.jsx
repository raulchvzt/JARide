import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimacionPagina from '../components/AnimacionPagina';
import { lazy, Suspense } from 'react'

const Car3DViewer = lazy(() => import('../components/Car3DViewer'));



const API = import.meta.env.VITE_API_URL;

const formatPrecio = (p) => '$ ' + parseInt(p).toLocaleString('en-US');
const formatKm    = (k) => parseInt(k).toLocaleString('es-MX') + ' km';
const emailSesion = () => sessionStorage.getItem('usuarioEmail') || '';
const FAQ_BASE = [
  { q: '¿El precio es negociable?',            a: 'El vendedor puede evaluar ofertas. Contáctalo directamente para negociar.' },
  { q: '¿Se puede hacer una prueba de manejo?', a: 'Sí, coordina con el vendedor la fecha y lugar para agendarlo.' },
  { q: '¿Acepta cambio por otro vehículo?',     a: 'Depende del vendedor. Consúltalo directamente por mensaje.' },
  { q: '¿Cuenta con garantía?',                 a: 'Los vehículos verificados JARide tienen revisión mecánica certificada.' },
  { q: '¿Cómo funciona el financiamiento?',     a: 'Usa la calculadora de esta página o contacta al vendedor para conocer enganches y plazos.' },
];

function DetallesCompra() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [auto,      setAuto]      = useState(null);
  const [cargando,  setCargando]  = useState(true);
  const [imgActiva, setImgActiva] = useState('');
  const [error,     setError]     = useState('');

  // Lightbox
  const [lbAbierto, setLbAbierto] = useState(false);
  const [lbIndice,  setLbIndice]  = useState(0);

  // Favorito
  const [esFavorito, setEsFavorito] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [heartAnim,  setHeartAnim]  = useState(false);

  // Vistas
  const [vistas, setVistas] = useState(null);

  // Similares
  const [similares, setSimilares] = useState([]);

  // Calculadora
  const [enganche,  setEnganche]  = useState(20);
  const [plazo,     setPlazo]     = useState(24);
  const [tasaAnual, setTasaAnual] = useState(12);

  // FAQ
  const [faqAbierta, setFaqAbierta] = useState(null);

  // Compartir
  const [copiado, setCopiado] = useState(false);

  const tiempoPublicado = (fecha) => {
    if (!fecha) return null;
    const diff = Math.floor((Date.now() - new Date(fecha)) / 86400000);
    if (diff === 0) return 'Publicado hoy';
    if (diff === 1) return 'Publicado ayer';
    if (diff < 7)  return `Publicado hace ${diff} días`;
    if (diff < 30) return `Publicado hace ${Math.floor(diff/7)} semana${Math.floor(diff/7)>1?'s':''}`;
    return `Publicado hace ${Math.floor(diff/30)} mes${Math.floor(diff/30)>1?'es':''}`;
  };

  useEffect(() => {
    fetch(`${API}/api/autos/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) { setAuto(data); setImgActiva(data.photos?.[0] || ''); }
        else setError('Auto no encontrado');
      })
      .catch(() => setError('Error al cargar el auto'))
      .finally(() => setCargando(false));

    fetch(`${API}/api/autos/${id}/vistas`, { method: 'POST' });
    fetch(`${API}/api/autos/${id}/vistas`).then(r=>r.json()).then(d=>setVistas((d.total||0)+1)).catch(()=>{});
    fetch(`${API}/api/autos/${id}/similares`).then(r=>r.json()).then(setSimilares).catch(()=>{});

    const email = emailSesion();
    if (email) {
      fetch(`${API}/api/favoritos?email=${email}`)
        .then(r=>r.json())
        .then(ids => setEsFavorito(ids.includes(parseInt(id))))
        .catch(()=>{});
    }
  }, [id]);

  const calcularMensualidad = () => {
    if (!auto) return 0;
    const precio  = parseInt(auto.precio) || 0;
    const monto   = precio * (1 - enganche / 100);
    const tasaMes = tasaAnual / 100 / 12;
    if (tasaMes === 0) return Math.round(monto / plazo);
    return Math.round((monto * tasaMes) / (1 - Math.pow(1 + tasaMes, -plazo)));
  };

  const toggleFavorito = async () => {
    const email = emailSesion();
    if (!email) { navigate('/login'); return; }
    setLoadingFav(true);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    await fetch(`${API}/api/favoritos`, {
      method: esFavorito ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, auto_id: parseInt(id) })
    });
    setEsFavorito(!esFavorito);
    setLoadingFav(false);
  };

  const compartir = async () => {
    const url = window.location.href;
    if (navigator.share) { await navigator.share({ title: `${auto.marca} ${auto.modelo}`, url }); }
    else { await navigator.clipboard.writeText(url); setCopiado(true); setTimeout(()=>setCopiado(false), 2000); }
  };

  const abrirLb  = (i) => { setLbIndice(i); setLbAbierto(true); document.body.style.overflow='hidden'; };
  const cerrarLb = ()  => { setLbAbierto(false); document.body.style.overflow=''; };
  const lbAnterior  = useCallback((e) => { e?.stopPropagation(); setLbIndice(i=>(i-1+(auto?.photos?.length||1))%(auto?.photos?.length||1)); }, [auto]);
  const lbSiguiente = useCallback((e) => { e?.stopPropagation(); setLbIndice(i=>(i+1)%(auto?.photos?.length||1)); }, [auto]);

  useEffect(() => {
    if (!lbAbierto) return;
    const h = (e) => { if(e.key==='ArrowLeft') lbAnterior(); else if(e.key==='ArrowRight') lbSiguiente(); else if(e.key==='Escape') cerrarLb(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lbAbierto, lbAnterior, lbSiguiente]);

  if (cargando) return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Navbar /><p style={{color:'#6b7280',fontSize:'14px'}}>Cargando vehículo...</p>
    </div>
  );
  if (error) return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px'}}>
      <Navbar /><p style={{color:'#ef4444',fontSize:'16px'}}>{error}</p>
      <button onClick={()=>navigate('/comprar')} style={{background:'#f1c98a',color:'#000',border:'none',borderRadius:'10px',padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>Ver catálogo</button>
    </div>
  );

  const galeria          = auto.photos || [];
  const imagenPrincipal  = imgActiva || galeria[0] || 'https://via.placeholder.com/900x400?text=Sin+Foto';
  const indiceActivo     = galeria.indexOf(imgActiva);
  const mensualidad      = calcularMensualidad();
  const montoFinanciado  = Math.round(parseInt(auto.precio||0)*(1-enganche/100));

  return (
    <AnimacionPagina>
    <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#fff',fontFamily:'sans-serif',paddingTop:'56px'}}>
      <Navbar />

      <style>{`
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes heartPop { 0%{transform:scale(1)} 50%{transform:scale(1.45)} 100%{transform:scale(1)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .sim-card:hover  { border-color:#f1c98a50!important; transform:translateY(-3px); }
        .sim-card        { transition:border-color .2s,transform .2s; }
        .faq-row:hover   { background:#161616!important; }
        .btn-sec:hover   { background:#1c1c1c!important; }
        input[type=range]                          { -webkit-appearance:none;width:100%;height:4px;border-radius:4px;background:#2a2a2a;outline:none; }
        input[type=range]::-webkit-slider-thumb   { -webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#f1c98a;cursor:pointer;border:2px solid #0a0a0a;box-shadow:0 0 0 3px #f1c98a30; }
      `}</style>

      {/* LIGHTBOX */}
      {lbAbierto && (
        <div onClick={cerrarLb} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.96)',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(10px)',animation:'fadeIn .2s ease'}}>
          <button onClick={cerrarLb} style={{position:'absolute',top:20,right:24,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'50%',width:40,height:40,color:'#fff',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
          <div style={{position:'absolute',top:24,left:'50%',transform:'translateX(-50%)',color:'#9ca3af',fontSize:13}}>{lbIndice+1} / {galeria.length}</div>
          {galeria.length>1 && <button onClick={lbAnterior} style={{position:'absolute',left:24,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'50%',width:48,height:48,color:'#fff',fontSize:26,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>}
          <img src={galeria[lbIndice]} alt="" onClick={e=>e.stopPropagation()} style={{maxWidth:'90vw',maxHeight:'85vh',objectFit:'contain',borderRadius:12,boxShadow:'0 32px 80px rgba(0,0,0,0.8)',userSelect:'none'}} />
          {galeria.length>1 && <button onClick={lbSiguiente} style={{position:'absolute',right:24,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'50%',width:48,height:48,color:'#fff',fontSize:26,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>}
          {galeria.length>1 && (
            <div onClick={e=>e.stopPropagation()} style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8,padding:'8px 12px',background:'rgba(0,0,0,0.55)',borderRadius:12}}>
              {galeria.map((img,i)=>(
                <img key={i} src={img} alt="" onClick={()=>setLbIndice(i)} style={{width:56,height:40,objectFit:'cover',borderRadius:6,cursor:'pointer',border:i===lbIndice?'2px solid #f1c98a':'2px solid transparent',opacity:i===lbIndice?1:0.4,transition:'all .2s'}} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* BREADCRUMB */}
      <div style={{padding:'16px 40px',fontSize:'11px',color:'#6b7280',letterSpacing:'0.08em',textTransform:'uppercase',marginTop:'56px'}}>
        <span onClick={()=>navigate('/')} style={{cursor:'pointer'}}>Inicio</span>
        <span style={{margin:'0 8px'}}>›</span>
        <span onClick={()=>navigate('/comprar')} style={{cursor:'pointer'}}>Catálogo</span>
        <span style={{margin:'0 8px'}}>›</span>
        <span style={{color:'#9ca3af'}}>{auto.marca} {auto.modelo}</span>
      </div>

      {/* LAYOUT */}
      <div style={{display:'flex',gap:'48px',padding:'0 40px 80px',maxWidth:'1200px',margin:'0 auto'}}>

        {/* ── COLUMNA IZQUIERDA ── */}
        <div style={{flex:1,minWidth:0}}>

          {/* Imagen principal */}
          <div onClick={()=>abrirLb(indiceActivo>=0?indiceActivo:0)} style={{borderRadius:16,overflow:'hidden',height:400,marginBottom:16,background:'#111',cursor:'zoom-in',position:'relative'}}>
            <img src={imagenPrincipal} alt="Auto" style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .4s ease'}}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.03)'}
              onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} />
            <div style={{position:'absolute',bottom:14,right:14,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:8,padding:'5px 10px',fontSize:12,color:'#d1d5db',display:'flex',alignItems:'center',gap:5,pointerEvents:'none'}}>
              🔍 Ver en grande
            </div>
          </div>


          {/* Galería */}
          {galeria.length>1 && (
            <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(galeria.length,5)},1fr)`,gap:10,marginBottom:44}}>
              {galeria.map((img,i)=>(
                <div key={i} style={{height:90,borderRadius:10,overflow:'hidden',cursor:'pointer',border:imgActiva===img?'2px solid #f1c98a':'2px solid transparent',transition:'border .2s',position:'relative'}}>
                  <img src={img} alt={`Foto ${i+1}`} onClick={()=>setImgActiva(img)} style={{width:'100%',height:'100%',objectFit:'cover',transition:'opacity .2s'}} />
                  <div onClick={e=>{e.stopPropagation();abrirLb(i);}} style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',opacity:0,background:'rgba(0,0,0,0)',fontSize:20,transition:'all .2s'}}
                    onMouseEnter={e=>{e.currentTarget.style.opacity=1;e.currentTarget.style.background='rgba(0,0,0,0.45)';}}
                    onMouseLeave={e=>{e.currentTarget.style.opacity=0;e.currentTarget.style.background='rgba(0,0,0,0)';}}>🔍</div>
                </div>
              ))}
            </div>
          )}

                {id === '6' && (
               <Car3DViewer modelUrl="/models/porsche-gt3/scene.gltf" />
                )}

                 {id === '8' && (
               <Car3DViewer modelUrl="/models/ford-raptor/scene.gltf" />
                )}

                 {id === '5' && (
               <Car3DViewer modelUrl="/models/lamborghini-svj/scene.gltf" />
                )}

                  {id === '15' && (
                  <Car3DViewer modelUrl="/models/porsche911/scene.gltf" colorInicial="#f5c400" />                
                  )}


          {/* Ubicación */}
          {auto.ubicacion_vendedor && (
            <div style={{marginBottom:44}}>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:16,letterSpacing:'-0.01em'}}>Ubicación del vendedor</h2>
              <div style={{background:'#111',border:'1px solid #1f1f1f',borderRadius:16,overflow:'hidden'}}>
                <iframe title="Ubicación" width="100%" height="260" style={{border:'none',display:'block',filter:'grayscale(30%) invert(92%) hue-rotate(180deg)'}} loading="lazy" allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(auto.ubicacion_vendedor)}&output=embed&z=13`} />
                <div style={{padding:'14px 20px',display:'flex',alignItems:'center',gap:10,borderTop:'1px solid #1f1f1f'}}>
                  <span>📍</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>{auto.ubicacion_vendedor}</div>
                    <div style={{fontSize:11,color:'#6b7280',marginTop:2}}>Ubicación aproximada del vendedor</div>
                  </div>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(auto.ubicacion_vendedor)}`} target="_blank" rel="noopener noreferrer"
                    style={{marginLeft:'auto',background:'none',border:'1px solid #2a2a2a',borderRadius:8,padding:'6px 14px',color:'#f1c98a',fontSize:12,fontWeight:600,cursor:'pointer',textDecoration:'none'}}>
                    Ver en Maps →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Descripción */}
          <div style={{marginBottom:44}}>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:14,letterSpacing:'-0.01em'}}>Descripción del vehículo</h2>
            <p style={{fontSize:14,color:'#9ca3af',lineHeight:1.9,margin:0}}>{auto.descripcion||'Sin descripción disponible.'}</p>
          </div>

          {/* Especificaciones */}
          <div style={{marginBottom:44}}>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:16,letterSpacing:'-0.01em'}}>Especificaciones Técnicas</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {[
                {label:'CATEGORÍA',  valor:auto.categoria},
                {label:'AÑO',        valor:auto.anio},
                {label:'KILOMETRAJE',valor:formatKm(auto.km)},
                {label:'COMBUSTIBLE',valor:auto.combustible},
                {label:'TRANSMISIÓN',valor:auto.transmision},
                {label:'CONDICIÓN',  valor:auto.condicion},
              ].filter(s=>s.valor).map((s,i)=>(
                <div key={i} style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:12,padding:'14px 16px'}}>
                  <div style={{fontSize:10,color:'#6b7280',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:4}}>{s.label}</div>
                  <div style={{fontSize:15,fontWeight:600,color:'#e5e7eb'}}>{s.valor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CALCULADORA */}
          <div style={{marginBottom:44}}>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:16,letterSpacing:'-0.01em'}}>Calculadora de Financiamiento</h2>
            <div style={{background:'#111',border:'1px solid #1f1f1f',borderRadius:16,overflow:'hidden'}}>
              <div style={{padding:'20px 24px',borderBottom:'1px solid #1a1a1a',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontSize:11,color:'#6b7280',marginBottom:4}}>Precio del vehículo</div>
                  <div style={{fontSize:22,fontWeight:800,color:'#f1c98a'}}>{formatPrecio(auto.precio)}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:11,color:'#6b7280',marginBottom:4}}>Monto a financiar</div>
                  <div style={{fontSize:18,fontWeight:700}}>{formatPrecio(montoFinanciado)}</div>
                </div>
              </div>
              <div style={{padding:24}}>
                {/* Enganche */}
                <div style={{marginBottom:24}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                    <label style={{fontSize:13,color:'#9ca3af'}}>Enganche</label>
                    <span style={{fontSize:14,fontWeight:700,color:'#f1c98a'}}>{enganche}% — {formatPrecio(parseInt(auto.precio||0)*enganche/100)}</span>
                  </div>
                  <input type="range" min={5} max={60} step={5} value={enganche} onChange={e=>setEnganche(Number(e.target.value))} />
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#4b5563',marginTop:4}}><span>5%</span><span>60%</span></div>
                </div>
                {/* Plazo */}
                <div style={{marginBottom:24}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                    <label style={{fontSize:13,color:'#9ca3af'}}>Plazo</label>
                    <span style={{fontSize:14,fontWeight:700,color:'#f1c98a'}}>{plazo} meses</span>
                  </div>
                  <input type="range" min={12} max={60} step={12} value={plazo} onChange={e=>setPlazo(Number(e.target.value))} />
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#4b5563',marginTop:4}}><span>12</span><span>60 meses</span></div>
                </div>
                {/* Tasa */}
                <div style={{marginBottom:28}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                    <label style={{fontSize:13,color:'#9ca3af'}}>Tasa anual estimada</label>
                    <span style={{fontSize:14,fontWeight:700,color:'#f1c98a'}}>{tasaAnual}%</span>
                  </div>
                  <input type="range" min={6} max={24} step={1} value={tasaAnual} onChange={e=>setTasaAnual(Number(e.target.value))} />
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#4b5563',marginTop:4}}><span>6%</span><span>24%</span></div>
                </div>
                {/* Resultado */}
                <div style={{background:'linear-gradient(135deg,#1a1500,#1a1a00)',border:'1px solid #f1c98a30',borderRadius:14,padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontSize:11,color:'#9ca3af',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>Pago mensual estimado</div>
                    <div style={{fontSize:32,fontWeight:900,color:'#f1c98a',letterSpacing:'-0.02em'}}>{formatPrecio(mensualidad)}</div>
                    <div style={{fontSize:11,color:'#6b7280',marginTop:4}}>durante {plazo} meses · tasa {tasaAnual}% anual</div>
                  </div>
                  <span style={{fontSize:36}}>🧮</span>
                </div>
                <p style={{fontSize:11,color:'#4b5563',marginTop:14,lineHeight:1.6}}>
                  * Cálculo referencial. Condiciones finales dependen de la institución financiera.{' '}
                  <button onClick={()=>navigate('/finanzas',{state:{precioAuto:auto.precio}})} style={{background:'none',border:'none',color:'#f1c98a',cursor:'pointer',fontSize:11,padding:0,fontWeight:600}}>Ver más opciones →</button>
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div style={{marginBottom:44}}>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:16,letterSpacing:'-0.01em'}}>Preguntas Frecuentes</h2>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {FAQ_BASE.map((item,i)=>(
                <div key={i} className="faq-row" onClick={()=>setFaqAbierta(faqAbierta===i?null:i)}
                  style={{background:'#111',border:'1px solid #1f1f1f',borderRadius:12,padding:'16px 20px',cursor:'pointer',transition:'background .2s'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:14,fontWeight:600,color:'#e5e7eb'}}>{item.q}</span>
                    <span style={{color:'#f1c98a',fontSize:20,lineHeight:1,transition:'transform .2s',display:'block',transform:faqAbierta===i?'rotate(45deg)':'rotate(0)'}}>+</span>
                  </div>
                  {faqAbierta===i && (
                    <p style={{fontSize:13,color:'#9ca3af',lineHeight:1.75,marginTop:12,marginBottom:0,animation:'slideUp .2s ease'}}>{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SIMILARES */}
          {similares.length>0 && (
            <div style={{marginBottom:44}}>
              <h2 style={{fontSize:18,fontWeight:700,marginBottom:16,letterSpacing:'-0.01em'}}>También te puede interesar</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
                {similares.map(s=>(
                  <div key={s.id} className="sim-card" onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate(`/auto/${s.id}`);
                    }}
                    style={{background:'#111',border:'1px solid #1f1f1f',borderRadius:14,overflow:'hidden',cursor:'pointer'}}>
                    <div style={{height:140,overflow:'hidden'}}>
                      <img src={s.photos?.[0]||'https://via.placeholder.com/400x140?text=Sin+Foto'} alt={`${s.marca} ${s.modelo}`}
                        style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .4s'}}
                        onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'}
                        onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} />
                    </div>
                    <div style={{padding:'14px 16px'}}>
                      {s.verificado && <span style={{fontSize:10,color:'#f1c98a',fontWeight:600,background:'#f1c98a15',border:'1px solid #f1c98a40',borderRadius:20,padding:'2px 8px',marginBottom:6,display:'inline-block'}}>✓ Verificado</span>}
                      <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{s.marca} {s.modelo}</div>
                      <div style={{fontSize:12,color:'#6b7280',marginBottom:8}}>{s.anio} · {formatKm(s.km)}</div>
                      <div style={{fontSize:16,fontWeight:800,color:'#f1c98a'}}>{formatPrecio(s.precio)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── COLUMNA DERECHA (sticky) ── */}
        <div style={{width:300,flexShrink:0}}>
          <div style={{position:'sticky',top:80}}>

            {/* Badges */}
            <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
              {auto.verificado && <span style={{background:'#f1c98a20',border:'1px solid #f1c98a60',color:'#f1c98a',fontSize:11,fontWeight:600,padding:'4px 12px',borderRadius:20}}>✓ Verificado JARide</span>}
              <span style={{background:'#ffffff15',border:'1px solid #ffffff30',color:'#d1d5db',fontSize:11,fontWeight:600,padding:'4px 12px',borderRadius:20}}>{auto.categoria}</span>
            </div>

            <h1 style={{fontSize:28,fontWeight:800,lineHeight:1.2,marginBottom:10}}>{auto.marca} {auto.modelo}</h1>
            <div style={{fontSize:26,fontWeight:800,color:'#f1c98a',marginBottom:10}}>{formatPrecio(auto.precio)}</div>

            {/* Vistas + tiempo */}
            <div style={{display:'flex',gap:12,marginBottom:18,flexWrap:'wrap'}}>
              {vistas!==null && <span style={{fontSize:12,color:'#6b7280'}}>👁 {vistas.toLocaleString()} {vistas===1?'vista':'vistas'}</span>}
              {tiempoPublicado(auto.fecha_publicacion) && <span style={{fontSize:12,color:'#6b7280'}}>🕐 {tiempoPublicado(auto.fecha_publicacion)}</span>}
            </div>

            {/* Info rápida */}
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20,padding:14,background:'#111',borderRadius:12,border:'1px solid #1a1a1a'}}>
              {[
                {icon:'📅',texto:`Año ${auto.anio}`},
                {icon:'⚡',texto:formatKm(auto.km)},
                {icon:'⛽',texto:auto.combustible},
                {icon:'🔧',texto:auto.transmision},
                {icon:'🏷️',texto:auto.condicion},
              ].filter(i=>i.texto&&i.texto!=='undefined').map((item,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'#d1d5db'}}>
                  <span>{item.icon}</span>{item.texto}
                </div>
              ))}
            </div>

            {/* Vendedor */}
            <div style={{display:'flex',alignItems:'center',gap:12,padding:14,background:'#141414',borderRadius:12,border:'1px solid #2a2a2a',marginBottom:14}}>
              {auto.vendedor_foto
                ? <img src={auto.vendedor_foto} alt={auto.vendedor} style={{width:40,height:40,borderRadius:'50%',objectFit:'cover',border:'1px solid #f1c98a60',flexShrink:0}} />
                : <div style={{width:40,height:40,borderRadius:'50%',background:'#f1c98a30',border:'1px solid #f1c98a60',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#f1c98a',flexShrink:0}}>{auto.vendedor?.charAt(0).toUpperCase()}</div>
              }
              <div>
                <div style={{fontSize:14,fontWeight:600}}>{auto.vendedor}</div>
                <div style={{fontSize:11,color:'#6b7280',marginTop:2}}>✓ Vendedor en JARide</div>
              </div>
            </div>

            {/* CTA principal */}
            <button onClick={()=>{
              if(!sessionStorage.getItem('estaAutenticado')){navigate('/login');return;}
              navigate('/mensajes',{state:{para_email:auto.vendedor_email,para_nombre:auto.vendedor,asunto:`Consulta sobre ${auto.marca} ${auto.modelo}`}});
            }} style={{width:'100%',padding:14,background:'#f1c98a',color:'#000',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',marginBottom:10}}>
              Contactar al vendedor
            </button>

            {/* Favorito + Compartir */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <button onClick={toggleFavorito} disabled={loadingFav} className="btn-sec"
                style={{padding:'11px 0',background:esFavorito?'#2d1010':'#141414',border:esFavorito?'1px solid #ef444450':'1px solid #2a2a2a',borderRadius:12,color:esFavorito?'#ef4444':'#9ca3af',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all .2s'}}>
                <span style={{fontSize:16,display:'inline-block',animation:heartAnim?'heartPop .4s ease':'none'}}>{esFavorito?'❤️':'🤍'}</span>
                {esFavorito?'Guardado':'Guardar'}
              </button>
              <button onClick={compartir} className="btn-sec"
                style={{padding:'11px 0',background:'#141414',border:'1px solid #2a2a2a',borderRadius:12,color:copiado?'#4ade80':'#9ca3af',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all .2s'}}>
                <span>{copiado?'✓':'🔗'}</span>{copiado?'¡Copiado!':'Compartir'}
              </button>
            </div>

            {/* WhatsApp */}
            <a href={`https://wa.me/?text=${encodeURIComponent(`Mira este ${auto.marca} ${auto.modelo} en JARide: ${window.location.href}`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'11px 0',background:'#0a2010',border:'1px solid #16a34a40',borderRadius:12,color:'#4ade80',fontSize:13,fontWeight:600,textDecoration:'none',marginBottom:14,boxSizing:'border-box',transition:'background .2s'}}
              onMouseEnter={e=>e.currentTarget.style.background='#0f2918'}
              onMouseLeave={e=>e.currentTarget.style.background='#0a2010'}>
              <span>📱</span> Compartir por WhatsApp
            </a>

            {/* Mensualidad rápida */}
            <div style={{padding:16,background:'#141414',border:'1px solid #2a2a2a',borderRadius:12}}>
              <div style={{fontSize:11,color:'#6b7280',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.06em'}}>Pago mensual estimado</div>
              <div style={{fontSize:22,fontWeight:800,color:'#f1c98a',marginBottom:4}}>{formatPrecio(mensualidad)}<span style={{fontSize:13,fontWeight:400,color:'#6b7280'}}>/mes</span></div>
              <div style={{fontSize:11,color:'#4b5563',marginBottom:10}}>Enganche {enganche}% · {plazo} meses · {tasaAnual}% anual</div>
              <button onClick={()=>window.scrollTo({top:document.body.scrollHeight*0.45,behavior:'smooth'})}
                style={{background:'none',border:'none',color:'#f1c98a',fontSize:12,cursor:'pointer',padding:0,fontWeight:600}}>
                Ajustar calculadora ↓
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
    </AnimacionPagina>
  );
}

export default memo(DetallesCompra);