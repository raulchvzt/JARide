import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ImageUploader from '../components/ImageUploader';
import VenderForm from '../components/VenderForm';

export default function Vender() {
  const [photos, setPhotos] = useState([]); 
  const [cargando, setCargando] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Nuevo estado para mensaje de éxito

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    km: '',
    condicion: 'Usado',
    transmision: '',
    combustible: '',
    descripcion: '',
    categoria: 'Sedanes' 
  });

  const handlePublicar = async () => {
    if (photos.length === 0) return alert("Sube al menos una foto");
    setCargando(true);

    try {
      const urlsSubidas = [];

      // SUBIDA DE FOTOS AL SERVIDOR
      for (const photoObj of photos) {
        const dataForm = new FormData();
        dataForm.append('foto', photoObj.file); 

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subir-foto`, { 
          method: 'POST', 
          body: dataForm 
        });
        
        const data = await res.json();
        
        if (data.success) {
          urlsSubidas.push(data.url);
        } else {
          console.error("Error en servidor al subir foto:", data.message);
        }
      }

      // GUARDAR DATOS FINALES CON ESTADO DEPENDIENDO DEL ROL
      const rolUsuario = localStorage.getItem('usuarioRol');
      const autoFinal = { 
        ...formData, 
        photos: urlsSubidas, 
        vendedor: localStorage.getItem('usuarioNombre') || 'Vendedor JARide',
        vendedor_email: localStorage.getItem('usuarioEmail') || '',
        estado: rolUsuario === 'admin' ? "aprobado" : "pendiente", // Admin sube aprobado automáticamente
        verificado: rolUsuario === 'admin' // Agregar campo verificado si es admin
      };

      const resFinal = await fetch(`${import.meta.env.VITE_API_URL}/api/autos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoFinal)
      });

      const dataFinal = await resFinal.json();

      if (dataFinal.success) {
        const mensaje = rolUsuario === 'admin' 
          ? "¡Auto publicado exitosamente! Como administrador, se ha aprobado automáticamente y aparece como verificado." 
          : "¡Recibido! Tu auto será publicado una vez que el administrador lo apruebe.";
        setSuccessMessage(mensaje);
        setTimeout(() => setSuccessMessage(""), 5000); // Ocultar después de 5 segundos
        setTimeout(() => window.location.href = "/", 2000); // Redirigir después de 2 segundos
      } else {
        alert("Error al guardar los datos del auto");
      }

    } catch (e) { 
      console.error(e);
      alert("Hubo un error en la conexión con el servidor"); 
    } finally { 
      setCargando(false); 
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <Navbar />
      
      {/* Mensaje de éxito bonito */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg animate-in fade-in duration-300">
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}
      
      <main className="max-w-5xl mx-auto pt-32 px-6">
        <h1 className="text-5xl font-light mb-12 text-white">Vende tu auto en JARide</h1>

        <ImageUploader photos={photos} setPhotos={setPhotos} />
        
        <VenderForm formData={formData} setFormData={setFormData} />

        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl flex justify-between items-center mt-8">
          <div>
            <h4 className="text-white font-medium">¿Listo para publicar?</h4>
            <p className="text-white/30 text-xs mt-1">Se categorizará como: <span className="text-[#e7b476]">{formData.categoria}</span></p>
          </div>
          <button 
            onClick={handlePublicar} 
            disabled={cargando} 
            className="bg-[#e7b476] text-black px-12 py-4 rounded-xl font-bold uppercase text-xs hover:bg-[#d4a365] transition-colors disabled:opacity-50"
          >
            {cargando ? "ENVIANDO A REVISIÓN..." : "Publicar auto"}
          </button>
        </div>
      </main>
    </div>
  );
}