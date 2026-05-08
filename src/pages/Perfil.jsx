import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';

export default function Perfil() {
    const [foto, setFoto] = useState(null);
    const [nombre, setNombre] = useState("Juan Pérez");
    const [email, setEmail] = useState("juan@jaride.com");
    const [telefono, setTelefono] = useState("312-123-4567");
    const [ubicacion, setUbicacion] = useState("Colima, México");
    const [editando, setEditando] = useState(false);
    const [guardado, setGuardado] = useState(false);
    const fileRef = useRef(null);

    const handleFoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setFoto(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleGuardar = () => {
        setEditando(false);
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
    };

    const inputStyle = (activo) => ({
        width: '100%', padding: '12px 14px',
        background: activo ? '#1a1a1a' : '#111',
        border: activo ? '1px solid #f1c98a' : '1px solid #2a2a2a',
        borderRadius: '10px', color: '#fff', fontSize: '14px',
        outline: 'none', boxSizing: 'border-box',
        fontFamily: 'sans-serif',
        cursor: activo ? 'text' : 'default',
        transition: 'all 0.2s',
    });

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingTop: '56px' }}>
            <Navbar />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px' }}>

                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Mi perfil</h1>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Administra tu información personal y preferencias</p>
                </div>

                {/* Tarjeta foto */}
                <div style={{
                    background: '#111', border: '1px solid #1f1f1f',
                    borderRadius: '20px', padding: '32px',
                    display: 'flex', alignItems: 'center', gap: '28px',
                    marginBottom: '24px',
                }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            overflow: 'hidden', border: '3px solid #f1c98a',
                            background: '#1a1a1a',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {foto ? (
                                <img src={foto} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '36px', fontWeight: 800, color: '#f1c98a' }}>
                                    {nombre.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        {/* Botón cambiar foto */}
                        <button
                            onClick={() => fileRef.current.click()}
                            style={{
                                position: 'absolute', bottom: '0', right: '0',
                                width: '30px', height: '30px', borderRadius: '50%',
                                background: '#f1c98a', border: 'none',
                                cursor: 'pointer', fontSize: '14px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            ✎
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
                    </div>

                    {/* Info básica */}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{nombre}</div>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{email}</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ background: '#f1c98a20', border: '1px solid #f1c98a40', color: '#f1c98a', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' }}>
                                ✓ Verificado
                            </span>
                            <span style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#9ca3af', fontSize: '11px', padding: '4px 12px', borderRadius: '20px' }}>
                                Comprador
                            </span>
                        </div>
                    </div>

                    {/* Botón editar */}
                    <button
                        onClick={() => editando ? handleGuardar() : setEditando(true)}
                        style={{
                            padding: '10px 22px', borderRadius: '10px', border: 'none',
                            background: editando ? '#f1c98a' : '#1a1a1a',
                            color: editando ? '#000' : '#fff',
                            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s', flexShrink: 0,
                        }}
                    >
                        {editando ? '✓ Guardar' : '✎ Editar perfil'}
                    </button>
                </div>

                {/* Mensaje guardado */}
                {guardado && (
                    <div style={{
                        background: '#16a34a20', border: '1px solid #16a34a40',
                        borderRadius: '10px', padding: '12px 16px',
                        fontSize: '13px', color: '#4ade80',
                        marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        ✓ Perfil actualizado correctamente
                    </div>
                )}

                {/* Información personal */}
                <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', margin: '0 0 24px' }}>Información personal</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                        <div>
                            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Nombre completo</label>
                            <input
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                disabled={!editando}
                                style={inputStyle(editando)}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Correo electrónico</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={!editando}
                                style={inputStyle(editando)}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Teléfono</label>
                            <input
                                value={telefono}
                                onChange={e => setTelefono(e.target.value)}
                                disabled={!editando}
                                style={inputStyle(editando)}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Ubicación</label>
                            <input
                                value={ubicacion}
                                onChange={e => setUbicacion(e.target.value)}
                                disabled={!editando}
                                style={inputStyle(editando)}
                            />
                        </div>

                    </div>
                </div>

                {/* Seguridad */}
                <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 24px' }}>Seguridad</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Contraseña', valor: '••••••••••', accion: 'Cambiar' },
                            { label: 'Verificación en dos pasos', valor: 'No activada', accion: 'Activar' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i === 0 ? '1px solid #1f1f1f' : 'none' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{item.label}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.valor}</div>
                                </div>
                                <button style={{
                                    background: 'none', border: '1px solid #2a2a2a',
                                    borderRadius: '8px', padding: '8px 16px',
                                    color: '#9ca3af', fontSize: '13px', cursor: 'pointer',
                                    fontFamily: 'sans-serif',
                                }}>
                                    {item.accion}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Zona peligrosa */}
                <div style={{ background: '#111', border: '1px solid #ef444430', borderRadius: '20px', padding: '28px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: '#ef4444' }}>Zona peligrosa</h2>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>
                        Una vez que elimines tu cuenta no hay vuelta atrás. Por favor asegúrate de estar seguro.
                    </p>
                    <button style={{
                        background: 'none', border: '1px solid #ef444460',
                        borderRadius: '10px', padding: '10px 20px',
                        color: '#ef4444', fontSize: '13px', cursor: 'pointer',
                        fontFamily: 'sans-serif', fontWeight: 600,
                    }}>
                        Eliminar cuenta
                    </button>
                </div>

            </div>
        </div>
    );
}