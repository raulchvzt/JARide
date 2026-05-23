import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LuBell, LuMail } from "react-icons/lu";

const API = import.meta.env.VITE_API_URL;

export default function Navbar() {
  const [usuario, setUsuario] = useState(() =>
    sessionStorage.getItem("usuarioNombre"),
  );
  const [usuarioImagen] = useState(() =>
    sessionStorage.getItem("usuarioFoto"),
  );
  const usuarioRol = sessionStorage.getItem("usuarioRol")?.toLowerCase();
  const emailActual = sessionStorage.getItem("usuarioEmail") || "";
  const navigate = useNavigate();
  const location = useLocation();

  const [noLeidos, setNoLeidos] = useState(0);
  const [ultimasNotificaciones, setUltimasNotificaciones] = useState([]);

  // Efecto para consultar los mensajes sin leer y sus detalles
  useEffect(() => {
    if (!emailActual) return;

    const cargarNotificaciones = async () => {
      try {
        // 1. Obtenemos el total numérico
        const resTotal = await fetch(`${API}/api/mensajes/no-leidos?email=${emailActual}`);
        const dataTotal = await resTotal.json();
        setNoLeidos(dataTotal.total);

        // 2. Traemos la lista de mensajes recibidos para extraer los no leídos detallados
        const resLista = await fetch(`${API}/api/mensajes/recibidos?email=${emailActual}`);
        const dataLista = await resLista.json();
        
        // Filtramos solo los que están como "no leídos" (leido === 0 o falso) y tomamos los últimos 4
        const noLeidosDetalle = dataLista.filter(m => !m.leido).slice(0, 4);
        setUltimasNotificaciones(noLeidosDetalle);
      } catch { /* empty */ }
    };

    cargarNotificaciones();
    
    const intervalo = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(intervalo);
  }, [emailActual, location.pathname]);

  const cerrarSesion = () => {
    sessionStorage.clear();
    setUsuario(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-10 py-6 bg-transparent backdrop-blur-sm">
      <a
        href="/"
        className="text-white font-black italic text-2xl tracking-tighter"
      >
        JARide
      </a>

      <div className="hidden md:flex gap-8 text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold">
        <a href="/comprar" className="hover:text-white transition group relative">
          Comprar
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#e7b476] group-hover:w-full transition-all"></span>
        </a>
        <a href="/vender" className="hover:text-white transition">Vender</a>
        <a href="/verificados" className="hover:text-white transition">Verificados</a>
        <a href="/finanzas" className="hover:text-white transition">Financiamiento</a>
      </div>

      <div className="flex items-center gap-6">
        {usuario ? (
          <>
            {/* CONTENEDOR GRUPO DE LA CAMPANA (Hover activa el menú) */}
            <div className="group relative flex items-center">
              <button
                onClick={() => navigate("/mensajes")}
                className="relative p-2 text-white/60 group-hover:text-[#f1c98a] transition-all cursor-pointer rounded-full hover:bg-white/5"
              >
                <LuBell size={20} className={noLeidos > 0 ? "text-[#f1c98a]" : ""} />
                
                {noLeidos > 0 && (
                  <span className="absolute top-1 right-1 min-w-3.5 h-3.5 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    {noLeidos > 9 ? "9+" : noLeidos}
                  </span>
                )}
              </button>

              {/* MENÚ DESPLEGABLE DE NOTIFICACIONES */}
              <div className="absolute right-0 top-full pt-2 w-72 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50 shadow-2xl">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-2 text-white">
                  <div className="px-3 py-2 text-[10px] uppercase tracking-widest font-black text-white/40 border-b border-white/5 flex justify-between items-center">
                    <span>Notificaciones</span>
                    {noLeidos > 0 && <span className="text-[#f1c98a]">{noLeidos} nuevas</span>}
                  </div>

                  <div className="max-h-64 overflow-y-auto my-1">
                    {ultimasNotificaciones.length === 0 ? (
                      <div className="p-4 text-center text-white/40 text-[11px] flex flex-col items-center gap-2">
                        <LuMail size={18} className="opacity-40" />
                        No tienes mensajes nuevos
                      </div>
                    ) : (
                      ultimasNotificaciones.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => navigate("/mensajes", { state: { id: notif.id } })}
                          className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5 mb-1"
                        >
                          {/* Mini Avatar del que envía */}
                          {notif.de_foto ? (
                            <img
                              src={notif.de_foto}
                              alt={notif.de_nombre}
                              className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10"
                            />
                          ) : (
                            <div className="w-7 h-7 bg-[#f1c98a] text-black text-[10px] font-black rounded-full flex items-center justify-center shrink-0">
                              {notif.de_nombre?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}

                          {/* Textos informativos */}
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-[11px] font-bold text-white/90 truncate">
                              {notif.de_nombre || "Usuario"}
                            </p>
                            <p className="text-[10px] text-white/50 truncate mt-0.5">
                              {notif.asunto}
                            </p>
                          </div>
                          
                          {/* Punto dorado de no leído */}
                          <div className="w-1.5 h-1.5 rounded-full bg-[#f1c98a] self-center shrink-0 shadow-[0_0_6px_#f1c98a]" />
                        </div>
                      ))
                    )}
                  </div>

                  <Link
                    to="/mensajes"
                    className="block text-center w-full py-2 text-[9px] text-[#f1c98a] bg-white/5 hover:bg-[#f1c98a]/10 rounded-lg uppercase font-black tracking-widest transition-all mt-1"
                  >
                    Ver todos los mensajes
                  </Link>
                </div>
              </div>
            </div>

            {/* SI ESTÁ LOGUEADO: CÍRCULO CON INICIAL */}
            <div className="group relative flex items-center gap-3">
              <span className="text-[10px] text-white/50 uppercase tracking-widest hidden lg:block">
                Hola, {usuario}
              </span>
              {usuarioImagen ? (
                <img 
                  src={usuarioImagen} 
                  alt={usuario}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/10 hover:border-[#f1c98a] transition-all cursor-pointer"
                />
              ) : (
                <div className="w-10 h-10 bg-[#f1c98a] rounded-full flex items-center justify-center text-black font-black cursor-pointer border-2 border-white/10 hover:border-[#f1c98a] transition-all">
                  {usuario.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Menú desplegable del Perfil */}
              <div className="absolute right-0 top-full pt-2 w-48 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50 shadow-2xl">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-2">
                  {usuarioRol === 'admin' && (
                    <>
                      <Link
                        to="/admin"
                        className="block px-4 py-3 text-[10px] text-white/60 hover:text-white hover:bg-white/5 rounded-lg uppercase font-bold tracking-widest transition-colors"
                      >
                        Panel Admin
                      </Link>
                      <div className="h-px bg-white/5 my-1"></div>
                    </>
                  )}
                  {usuarioRol !== 'admin' && (
                    <>
                      <Link
                        to="/perfil"
                        className="block px-4 py-3 text-[10px] text-white/60 hover:text-white hover:bg-white/5 rounded-lg uppercase font-bold tracking-widest transition-colors"
                      >
                        Mi Perfil
                      </Link>
                      <div className="h-px bg-white/5 my-1"></div>
                    </>
                  )}
                  <button
                    onClick={cerrarSesion}
                    className="w-full text-left block px-4 py-3 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg uppercase font-bold tracking-widest transition-all border border-transparent hover:border-red-500/30 cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* SI NO ESTÁ LOGUEADO */
          <Link
            to="/login"
            className="text-white text-[10px] uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition"
          >
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  );
}