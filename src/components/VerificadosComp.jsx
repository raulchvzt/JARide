import React from 'react';
import { motion } from 'framer-motion';

export default function VerificadosComp() {
  const steps = [
    {
      id: "01",
      title: "Inspección de 150 puntos",
      desc: "Desde la gestión electrónica hasta la profundidad de la pintura, nada se nos escapa.",
      img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000"
    },
    {
      id: "02",
      title: "Validación Legal",
      desc: "Verificamos antecedentes, facturación y estatus ante autoridades al 100%.",
      img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2000"
    },
    {
      id: "03",
      title: "Garantía Mecánica",
      desc: "Cada auto verificado cuenta con el respaldo técnico de nuestro equipo de expertos.",
      img: "/src/assets/verificados.jpeg"
    }
  ];

  return (
    <section className="bg-black text-white py-32 px-6 md:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera de Impacto */}
        
<header className="mb-20">
  <motion.p 
    initial={{ opacity: 0, tracking: "0.2em" }}
    whileInView={{ opacity: 1, tracking: "0.5em" }}
    className="text-[#e7b476] text-[10px] uppercase font-bold mb-4"
  >
    JARide Certified
  </motion.p>
  
  <motion.h2 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="text-6xl md:text-8xl font-extralight tracking-tighter leading-none"
  >
    DÓNDE LA EXCELENCIA <br />
    <span className="italic font-medium text-white/90">COBRA VIDA.</span>
  </motion.h2> 
</header>

        {/* Grid Innovador de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-150">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="relative group overflow-hidden rounded-2xl cursor-pointer"
            >
              {/* Imagen de fondo con Zoom al Hover */}
              <img 
                src={step.img} 
                alt={step.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-70"
              />

              {/* Número Gigante */}
              <div className="absolute top-10 left-10 overflow-hidden">
                <span className="text-8xl font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500 text-white">
                  {step.id}
                </span>
              </div>

              {/* Contenido que aparece con Blur al Hover */}
              <div className="absolute inset-x-0 bottom-0 p-10 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h4 className="text-xl font-bold mb-2 text-[#e7b476]">{step.title}</h4>
                  <p className="text-sm text-white/70 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Título que se ve cuando NO hay hover */}
              <div className="absolute bottom-10 left-10 group-hover:opacity-0 transition-opacity duration-300">
                <h4 className="text-2xl font-light tracking-tighter uppercase">{step.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botón de Acción Call-to-Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 flex justify-center"
        >
          <button className="group relative px-12 py-4 bg-transparent border border-white/20 rounded-full overflow-hidden transition-all hover:border-[#e7b476]">
            <a href="#" className="relative z-10 text-[10px] uppercase tracking-[0.4em] font-bold group-hover:text-black transition-colors">
              Ver Catálogo Certificado
            </a>
            <div className="absolute inset-0 bg-[#e7b476] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}