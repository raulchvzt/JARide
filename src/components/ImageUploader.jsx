import React from 'react';
import { FiUploadCloud, FiX, FiPlus } from 'react-icons/fi';

export default function ImageUploader() {
  const photos = [
    { id: 1, url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=400", label: "Portada" },
    { id: 2, url: "/src/assets/interior.jpg", label: "" },
    { id: 3, url: "/src/assets/lado.jpg", label: "" },
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 mb-10">
      <h3 className="text-white font-medium mb-6">1. Fotografías del vehículo</h3>
      
      {/* Dropzone principal */}
      <div className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center mb-8 hover:border-[#e7b476]/40 transition cursor-pointer">
        <FiUploadCloud className="text-4xl text-[#e7b476] mx-auto mb-4" />
        <p className="text-white text-sm font-medium">Arrastra tus fotos aquí o haz clic para subir</p>
        <p className="text-white/30 text-xs mt-2">Formato horizontal recomendado. JPG, PNG hasta 10MB.</p>
        <button className="mt-6 bg-[#e7b476] text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest">Seleccionar archivos</button>
      </div>

      {/* Miniaturas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-video rounded-lg overflow-hidden group">
            <img src={photo.url} className="w-full h-full object-cover" />
            <button className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition">
              <FiX size={14} />
            </button>
            {photo.label && (
              <span className="absolute bottom-2 left-2 bg-[#e7b476] text-black text-[10px] font-bold px-2 py-0.5 rounded">
                {photo.label}
              </span>
            )}
          </div>
        ))}
        <button className="border border-white/5 bg-white/5 rounded-lg flex flex-col items-center justify-center text-white/30 hover:text-white transition gap-2">
          <FiPlus />
          <span className="text-[10px] uppercase font-bold tracking-widest">Añadir más</span>
        </button>
      </div>
    </div>
  );
}