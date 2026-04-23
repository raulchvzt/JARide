import React from 'react';
import Navbar from '../components/Navbar';
import ImageUploader from '../components/ImageUploader';
import VenderForm from '../components/VenderForm';

export default function Vender() {
  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <Navbar />
      
      <main className="max-w-5xl mx-auto pt-32 px-6">
        {/* Este es el encabezado de la página */}
        <header className="mb-12">
          <h1 className="text-5xl font-light tracking-tight mb-4 text-white">Vende tu auto en JARide</h1>
          <p className="text-white/40 max-w-2xl font-light leading-relaxed">
            Sube las fotos y los datos de tu vehículo para formar parte de nuestro catálogo premium. 
            La presentación es clave para atraer a los mejores compradores.
          </p>
        </header>

            {/* Aquí se agregan los componentes de carga de imágenes y el formulario */}

        <ImageUploader />
        <VenderForm />

        {/* Footer de acción */}
        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-white font-medium">¿Listo para publicar?</h4>
            <p className="text-white/30 text-xs mt-1">Tu publicación será revisada por nuestro equipo antes de salir en vivo.</p>
          </div>
          <div className="flex gap-4">
            <button className="text-white/40 text-xs font-bold uppercase tracking-widest px-8 hover:text-white transition">Guardar borrador</button>
            <button className="bg-[#e7b476] text-black px-12 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#d49f65] transition shadow-lg">Publicar auto</button>
          </div>
        </div>
      </main>
    </div>
  );
}