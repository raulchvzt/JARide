import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      quote: "La mejor inversión que he hecho en seguridad para mi familia.",
      author: "Bigotes M. Alias Oswal",
      location: "Colima, Col.",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974" 
    },
    {
      id: 2,
      quote: "Vender mi Porsche fue tan sencillo como tomar la fotografía.",
      author: "Lucía G.",
      location: "Manzanillo, Col.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976" 
    }
  ];

  return (
    <section className="bg-black py-20 px-6 md:px-20">
      <p className="text-[#e7b476] text-[15px] uppercase tracking-[0.5em] mb-12 text-center font-bold">Historias Reales</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {reviews.map((item) => (
          <div key={item.id} className="relative group overflow-hidden rounded-3xl h-150">
            {/* Imagen en escala de grises que agarra color al pasar el cursor */}
            <img 
              src={item.img} 
              alt={item.author}
              className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition duration-1000 ease-in-out"
            />
            
            {/* Overlay de texto */}
            <div className="absolute inset-0 p-12 flex flex-col justify-end bg-linear-to-t from-black via-black/20 to-transparent">
              <h3 className="text-white text-4xl md:text-5xl font-extralight italic leading-tight mb-8 tracking-tighter">
                "{item.quote}"
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-[#e7b476]"></div>
                <div>
                  <p className="text-white font-bold text-sm uppercase tracking-widest">{item.author}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">{item.location}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}