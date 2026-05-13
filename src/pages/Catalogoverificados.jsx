import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

// Modal de contacto
function ModalContacto({ auto, onClose }) {
  const emailActual = localStorage.getItem('usuarioEmail') || '';
  const nombreActual = localStorage.getItem('usuarioNombre') || '';
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const enviar = async () => {
    if (!emailActual) {
      navigate('/login');
      return;
    }
    if (!mensaje.trim()) return;
    setEnviando(true);
    try {
      const res = await fetch(`${API}/api/mensajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          de_email: emailActual,
          para_email: auto.vendedor_email,
          asunto: `Interés en ${auto.marca} ${auto.modelo} (Verificado)`,
          cuerpo: mensaje
        })
      });
      const data = await res.json();
      if (data.success) {
        setExito(true);
        setTimeout(onClose, 2000);
      } else setError('Error al enviar el mensaje');
    } catch { setError('Error de conexión'); }
    finally { setEnviando(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000dd', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '480px', color: '#fff', fontFamily: 'sans-serif' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: '#1a1a1a' }}>
            <img src={auto.photos?.[0]} alt={auto.modelo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#e7b476', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
              ✓ JARide Certified
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{auto.marca} {auto.modelo}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{auto.anio} · {auto.categoria}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '20px', alignSelf: 'flex-start' }}>✕</button>
        </div>

        {exito ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#4ade80' }}>Mensaje enviado</p>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>El equipo de JARide te contactará pronto</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px', lineHeight: 1.6 }}>
              Este es un vehículo <strong style={{ color: '#e7b476' }}>certificado por JARide</strong>. Escríbenos y un asesor te dará toda la información — incluyendo precio, condiciones y disponibilidad.
            </p>

            {!emailActual && (
              <div style={{ background: '#e7b47615', border: '1px solid #e7b47630', borderRadius: '10px', padding: '12px 16px', fontSize: '12px', color: '#e7b476', marginBottom: '16px' }}>
                ⚠️ Debes iniciar sesión para enviar un mensaje
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Tu mensaje</label>
              <textarea
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                placeholder={`Hola, estoy interesado en el ${auto.marca} ${auto.modelo}. ¿Podrían darme más información?`}
                rows={4}
                style={{ width: '100%', padding: '12px 14px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box', fontFamily: 'sans-serif' }}
              />
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif' }}>
                Cancelar
              </button>
              <button
                onClick={enviar}
                disabled={enviando || (!emailActual ? false : !mensaje.trim())}
                style={{ flex: 2, padding: '12px', background: '#e7b476', border: 'none', borderRadius: '10px', color: '#000', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}
              >
                {!emailActual ? 'Iniciar sesión para contactar' : enviando ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// Tarjeta de auto verificado
function TarjetaVerificado({ auto, index, onContactar }) {
  const foto = auto.photos?.[0] || 'https://via.placeholder.com/600x400?text=Sin+Foto';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}
    >
      {/* Badge verificado */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, background: '#e7b47620', border: '1px solid #e7b47650', color: '#e7b476', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', backdropFilter: 'blur(8px)' }}>
        ✓ JARide Certified
      </div>

      {/* Foto */}
      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
        <img src={foto} alt={auto.modelo} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)', transition: 'transform 0.6s, filter 0.4s' }}
          onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'grayscale(0%)'; }}
          onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'grayscale(20%)'; }}
        />
        {/* Overlay sutil */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f0f0f 0%, transparent 60%)' }} />
      </div>

      {/* Info */}
      <div style={{ padding: '24px' }}>
        <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '6px' }}>
          {auto.marca}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
          {auto.modelo}
        </h3>

        {/* Specs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { icon: '📅', val: auto.anio },
            { icon: '⚡', val: `${parseInt(auto.km).toLocaleString()} km` },
            { icon: '⛽', val: auto.combustible },
          ].filter(s => s.val && s.val !== 'undefined').map((s, i) => (
            <span key={i} style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {s.icon} {s.val}
            </span>
          ))}
        </div>

        {/* Categoría */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ background: '#ffffff08', border: '1px solid #ffffff10', color: '#ffffff60', fontSize: '10px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' }}>
            {auto.categoria}
          </span>
        </div>

        {/* Precio oculto + botón */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f1f1f', paddingTop: '20px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Precio</div>
            <div style={{ fontSize: '14px', color: '#ffffff40', letterSpacing: '0.2em' }}>• • • • • •</div>
            <div style={{ fontSize: '10px', color: '#e7b47670', marginTop: '2px' }}>Consultar al asesor</div>
          </div>
          <button
            onClick={() => onContactar(auto)}
            style={{ background: '#e7b476', color: '#000', border: 'none', borderRadius: '12px', padding: '12px 20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}
          >
            Contactar →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CatalogoVerificados() {
  const [autos, setAutos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [autoSeleccionado, setAutoSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('Todos');

  const categorias = ['Todos', ...new Set(autos.map(a => a.categoria).filter(Boolean))];

  useEffect(() => {
    fetch(`${API}/api/autos/verificados`)
      .then(r => r.json())
      .then(data => { setAutos(data); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  const autosFiltrados = filtro === 'Todos' ? autos : autos.filter(a => a.categoria === filtro);

  return (
    <section style={{ background: '#000', color: '#fff', padding: '80px 40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header sección */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <p style={{ color: '#e7b476', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px' }}>
                Catálogo Exclusivo
              </p>
              <h2 style={{ fontSize: '40px', fontWeight: 800, margin: 0, letterSpacing: '-1px', lineHeight: 1.1 }}>
                Vehículos Certificados
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '12px', maxWidth: '480px', lineHeight: 1.7 }}>
                Cada vehículo ha pasado por nuestro riguroso proceso de verificación de 150 puntos. El precio se revela al contactar a un asesor JARide.
              </p>
            </div>

            {/* Contador */}
            <div style={{ background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#e7b476' }}>{autos.length}</div>
              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Certificados disponibles</div>
            </div>
          </div>

          {/* Filtros por categoría */}
          {!cargando && autos.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '32px', flexWrap: 'wrap' }}>
              {categorias.map(cat => (
                <button key={cat} onClick={() => setFiltro(cat)}
                  style={{ padding: '8px 18px', borderRadius: '20px', border: `1px solid ${filtro === cat ? '#e7b476' : '#2a2a2a'}`, background: filtro === cat ? '#e7b47615' : 'none', color: filtro === cat ? '#e7b476' : '#6b7280', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif', transition: 'all 0.2s' }}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Grid */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280', fontSize: '14px' }}>
            Cargando vehículos certificados...
          </div>
        ) : autosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', border: '2px dashed #1f1f1f', borderRadius: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏆</div>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              {autos.length === 0 ? 'Próximamente habrá vehículos certificados disponibles' : 'No hay vehículos en esta categoría'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {autosFiltrados.map((auto, i) => (
              <TarjetaVerificado key={auto.id} auto={auto} index={i} onContactar={setAutoSeleccionado} />
            ))}
          </div>
        )}
      </div>

      {autoSeleccionado && (
        <ModalContacto auto={autoSeleccionado} onClose={() => setAutoSeleccionado(null)} />
      )}
    </section>
  );
}