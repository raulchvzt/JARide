import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Finanzas() {
    const precioVehiculo = 185000;

    const planes = [
        { id: 'normal', nombre: 'Normal', tasa: 8.9, descripcion: 'Sin requisitos adicionales' },
        { id: 'premium', nombre: 'Premium', tasa: 7.5, descripcion: 'Requiere aval bancario' },
        { id: 'flexible', nombre: 'Flexible', tasa: 10.5, descripcion: 'Sin aval necesario' },
    ];

    const [enganchePct, setEnganchePct] = useState(30);
    const [plazo, setPlazo] = useState(48);
    const [planSeleccionado, setPlanSeleccionado] = useState('normal');
    const [requisitosAbierto, setRequisitosAbierto] = useState(false);

    const plan = planes.find(p => p.id === planSeleccionado);
    const tasaAnual = plan.tasa / 100;
    const enganche = Math.round(precioVehiculo * (enganchePct / 100));
    const financiado = precioVehiculo - enganche;
    const tasaMensual = tasaAnual / 12;

    const calcularPago = (meses) => Math.round(
        (financiado * tasaMensual * Math.pow(1 + tasaMensual, meses)) /
        (Math.pow(1 + tasaMensual, meses) - 1)
    );

    const pagoMensual = calcularPago(plazo);
    const totalPagar = pagoMensual * plazo + enganche;
    const totalIntereses = totalPagar - precioVehiculo;

    const formatPrecio = (p) => 'MX$ ' + p.toLocaleString('en-MX');

    const requisitos = [
        'Identificación oficial vigente (INE o Pasaporte)',
        'Comprobante de ingresos de los últimos 3 meses',
        'Comprobante de domicilio no mayor a 3 meses',
        'RFC activo ante el SAT',
        'Edad mínima: 21 años',
    ];

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
            <Navbar />

            <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '60px',
                maxWidth: '1200px', margin: '0 auto', padding: '80px 40px',
            }}>

                {/* COLUMNA IZQUIERDA */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{ borderRadius: '20px', overflow: 'hidden', height: '520px', position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80"
                            alt="Financiamiento"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a 0%, transparent 60%)' }} />
                        <div style={{ position: 'absolute', bottom: '28px', left: '28px' }}>
                            <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Alianzas Estratégicas
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: 700 }}>Financiamiento a tu medida</div>
                        </div>
                        <div style={{
                            position: 'absolute', top: '24px', right: '24px',
                            background: '#f1c98a', color: '#000',
                            borderRadius: '12px', padding: '10px 16px',
                            fontSize: '12px', fontWeight: 700,
                        }}>
                            Tasa desde 7.5% anual
                        </div>
                    </div>

                    {/* Mini tabla comparativa */}
                    <div style={{ marginTop: '24px', background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1f1f1f', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Comparativa de plazos — Plan {plan.nombre}
                        </div>
                        {[24, 36, 48, 60, 72].map(m => (
                            <div key={m} onClick={() => setPlazo(m)} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 20px', cursor: 'pointer',
                                background: plazo === m ? '#1a1a1a' : 'transparent',
                                borderLeft: plazo === m ? '3px solid #f1c98a' : '3px solid transparent',
                                transition: 'all 0.15s',
                            }}>
                                <span style={{ fontSize: '13px', color: plazo === m ? '#fff' : '#6b7280' }}>{m} meses</span>
                                <span style={{ fontSize: '14px', fontWeight: plazo === m ? 700 : 400, color: plazo === m ? '#f1c98a' : '#6b7280' }}>
                                    {formatPrecio(calcularPago(m))}/mes
                                </span>
                                {plazo === m && <span style={{ fontSize: '11px', color: '#f1c98a' }}>← seleccionado</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#f1c98a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
                        Simulador Financiero
                    </div>
                    <h1 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', margin: '0 0 16px' }}>
                        Diseñado para<br />compradores que<br />esperan flexibilidad.
                    </h1>
                    <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.7, marginBottom: '28px' }}>
                        Proyecta tu inversión en segundos. Ajusta el enganche y el plazo para encontrar el plan que mejor se adapte a ti.
                    </p>

                    {/* Selector de plan */}
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Plan de financiamiento</div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {planes.map(p => (
                                <div key={p.id} onClick={() => setPlanSeleccionado(p.id)} style={{
                                    flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                                    border: planSeleccionado === p.id ? '1.5px solid #f1c98a' : '1.5px solid #2a2a2a',
                                    background: planSeleccionado === p.id ? '#f1c98a10' : '#111',
                                    transition: 'all 0.15s',
                                }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: planSeleccionado === p.id ? '#f1c98a' : '#fff', marginBottom: '4px' }}>{p.nombre}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{p.tasa}%</div>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{p.descripcion}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: '24px' }}>

                        {/* Precio */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <span style={{ fontSize: '14px', color: '#9ca3af' }}>Precio del vehículo</span>
                            <span style={{ fontSize: '15px', fontWeight: 700 }}>{formatPrecio(precioVehiculo)}</span>
                        </div>

                        {/* Barra enganche vs financiado */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Enganche ({enganchePct}%)</span>
                                <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1c98a' }}>{formatPrecio(enganche)}</span>
                            </div>
                            
                          
                            <input
                                type="range" min="10" max="60" step="5"
                                value={enganchePct}
                                onChange={e => setEnganchePct(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#f1c98a', cursor: 'pointer' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>
                                <span>Enganche: {formatPrecio(enganche)}</span>
                                <span>Financiado: {formatPrecio(financiado)}</span>
                            </div>
                        </div>

                        {/* Plazo botones */}
                        <div style={{ marginBottom: '28px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Plazo (Meses)</span>
                                <span style={{ fontSize: '15px', fontWeight: 700 }}>{plazo}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[24, 36, 48, 60, 72].map(m => (
                                    <button key={m} onClick={() => setPlazo(m)} style={{
                                        flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none',
                                        background: plazo === m ? '#f1c98a' : '#1a1a1a',
                                        color: plazo === m ? '#000' : '#9ca3af',
                                        fontSize: '13px', fontWeight: plazo === m ? 700 : 400,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                    }}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resultado */}
                        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '20px 24px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Pago mensual estimado</div>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#f1c98a' }}>{formatPrecio(pagoMensual)}</div>
                                </div>
                                <button style={{
                                    background: '#fff', color: '#000', border: 'none',
                                    borderRadius: '40px', padding: '14px 20px',
                                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                }}>
                                    Solicitar crédito
                                </button>
                            </div>
                            <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                {[
                                    { label: 'Total a pagar', valor: formatPrecio(totalPagar), color: '#fff' },
                                    { label: 'Total intereses', valor: formatPrecio(totalIntereses), color: '#ef4444' },
                                    { label: 'Tasa anual', valor: `${plan.tasa}%`, color: '#f1c98a' },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>{item.label}</div>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: item.color }}>{item.valor}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA secundario */}
                        <button style={{
                            width: '100%', padding: '14px', background: 'none',
                            border: '1px solid #2a2a2a', borderRadius: '12px',
                            color: '#9ca3af', fontSize: '14px', cursor: 'pointer',
                            marginBottom: '20px', fontFamily: 'inherit',
                        }}>
                            💬 Hablar con un asesor financiero
                        </button>

                        {/* Requisitos acordeón */}
                        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
                            <button onClick={() => setRequisitosAbierto(!requisitosAbierto)} style={{
                                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '14px 18px', background: 'none', border: 'none',
                                color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}>
                                <span> Requisitos para aplicar</span>
                                <span style={{ transition: 'transform 0.2s', transform: requisitosAbierto ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '12px', color: '#6b7280' }}>▼</span>
                            </button>
                            {requisitosAbierto && (
                                <div style={{ padding: '0 18px 16px', borderTop: '1px solid #1f1f1f' }}>
                                    {requisitos.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', fontSize: '13px', color: '#9ca3af', borderBottom: i < requisitos.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                                            <span style={{ color: '#f1c98a', marginTop: '1px', flexShrink: 0 }}>✓</span>
                                            {r}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Beneficios */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                                'Aprobación en menos de 24h',
                                'Tasas preferenciales desde 7.5%',
                                'Sin penalización por pagos anticipados',
                                'Proceso 100% en línea',
                            ].map((b, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#9ca3af' }}>
                                    <span style={{ color: '#f1c98a' }}>✓</span>{b}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}