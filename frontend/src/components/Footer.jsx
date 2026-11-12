import React from 'react'

export default function Footer() {
  return (
    <div>
         <footer className="bg-black py-32 text-center border-t border-white/5">
        <h2 className="text-white text-6xl font-extralight mb-12 tracking-tight">Haz que tu próxima compra se vea <br/> <span className="text-[#e7b476] font-normal italic">tan bien como se siente.</span></h2>
        <a href="/comprar" className="bg-white text-black px-16 py-5 rounded-full font-bold uppercase text-[11px] tracking-[0.2em]">Empezar ahora</a>
        <p className="mt-20 text-white/20 text-[10px] uppercase tracking-widest">© 2026 JARide. Marketplace de autos premium en Colima.</p>
      </footer>
      

    </div>
  )
}
