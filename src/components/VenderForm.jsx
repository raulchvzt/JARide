import React from 'react';

const InputGroup = ({ label, placeholder, type = "text", options = null }) => (
  <div className="flex flex-col gap-2">
    <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{label}</label>
    {options ? (
      <select className="bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#e7b476] transition">
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    ) : (
      <input 
        type={type} 
        placeholder={placeholder} 
        className="bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#e7b476] transition" 
      />
    )}
  </div>
);

export default function VenderForm() {
  return (
    <div className="space-y-10 mb-20">
      {/* Sección de información del vehículo */}
      <section>
        <h3 className="text-white font-medium mb-6">2. Información del vehículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Marca" placeholder="Ej: Audi" />
          <InputGroup label="Modelo" placeholder="Ej: Q8 e-tron" />
          <InputGroup label="Año" options={["2024", "2023", "2022"]} />
          <InputGroup label="Precio (USD)" placeholder="$ 85,000" />
        </div>
      </section>

      {/* Sección de las especificaciones del vehículo */}
      <section>
        <h3 className="text-white font-medium mb-6">3. Especificaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Condición</label>
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-[#111] text-white/40 rounded-lg text-xs font-bold border border-white/5">Seminuevo</button>
              <button className="flex-1 py-3 bg-white/10 text-white rounded-lg text-xs font-bold border border-[#e7b476]/50">Usado</button>
            </div>
          </div>
          <InputGroup label="Transmisión" options={["Automática", "Manual"]} />
          <InputGroup label="Combustible" options={["Eléctrico", "Gasolina", "Híbrido"]} />
        </div>
      </section>

      {/* Sección para añadir una descripción */}
      <section>
        <h3 className="text-white font-medium mb-6">4. Descripción</h3>
        <div className="flex flex-col gap-2">
          <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Detalles del vehículo</label>
          <textarea 
            rows="4"
            placeholder="Describe el estado de tu vehículo..."
            className="bg-[#111] border border-white/10 rounded-lg p-4 text-white text-sm placeholder:text-white/10 focus:outline-none focus:border-[#e7b476]"
          ></textarea>
        </div>
      </section>
    </div>
  );
}