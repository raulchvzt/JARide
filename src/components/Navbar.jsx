import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [usuario, setUsuario] = useState(() =>
    localStorage.getItem("usuarioNombre"),
  );
  const [usuarioImagen] = useState(() =>
    localStorage.getItem("usuarioFoto"),
  );
  const usuarioRol = localStorage.getItem("usuarioRol")?.toLowerCase();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
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
        <a
          href="/comprar"
          className="hover:text-white transition group relative"
        >
          Comprar
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#e7b476] group-hover:w-full transition-all"></span>
        </a>
        <a href="/vender" className="hover:text-white transition">
          Vender
        </a>
        <a href="/verificados" className="hover:text-white transition">
          Verificados
        </a>
        <a href="/finanzas" className="hover:text-white transition">
          Financiamiento
        </a>
      </div>

      <div className="flex items-center gap-4">
        {usuario ? (
          /* SI ESTÁ LOGUEADO: CÍRCULO CON INICIAL */
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

            {/* Menú desplegable al pasar mouse */}
            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50 shadow-2xl">
              {/* Este es el contenedor real con el fondo negro */}
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
        ) : (
          /* SI NO ESTÁ LOGUEADO: BOTÓN INGRESAR */
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
