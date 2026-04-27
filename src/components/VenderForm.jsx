import React from 'react';

const InputGroup = ({ label, name, value, onChange, placeholder, options }) => (
  <div className="flex flex-col gap-2">
    <label className="text-white/40 text-[10px] uppercase font-bold">{label}</label>

    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm"
      >
        <option value="">Selecciona</option>
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    ) : (
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm"
      />
    )}
  </div>
);

export default function VenderForm({ formData, setFormData }) {

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-10 mb-20">

      <section>
        <h3 className="text-white font-medium mb-6">2. Información del vehículo</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <InputGroup label="Marca" name="marca" value={formData.marca} onChange={handleChange} />
          <InputGroup label="Modelo" name="modelo" value={formData.modelo} onChange={handleChange} />
          <InputGroup label="Año" name="anio" value={formData.anio} onChange={handleChange} options={["2024","2023","2022"]} />
          <InputGroup label="Precio" name="precio" value={formData.precio} onChange={handleChange} />
        </div>
      </section>

      <section>
        <h3 className="text-white font-medium mb-6">3. Especificaciones</h3>
        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <label className="text-white/40 text-[10px] font-bold">Condición</label>
            <div className="flex gap-2 mt-2">
              {["Seminuevo","Usado"].map(c => (
                <button
                  key={c}
                  onClick={() => setFormData({ ...formData, condicion: c })}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold ${
                    formData.condicion === c
                      ? 'bg-white/10 text-white border border-[#e7b476]/50'
                      : 'bg-[#111] text-white/40 border border-white/5'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <InputGroup
            label="Transmisión"
            name="transmision"
            value={formData.transmision}
            onChange={handleChange}
            options={["Automática","Manual"]}
          />

          <InputGroup
            label="Combustible"
            name="combustible"
            value={formData.combustible}
            onChange={handleChange}
            options={["Eléctrico","Gasolina","Híbrido"]}
          />

        </div>
      </section>

      <section>
        <h3 className="text-white font-medium mb-6">4. Descripción</h3>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="4"
          placeholder="Describe el estado de tu vehículo..."
          className="bg-[#111] border border-white/10 rounded-lg p-4 text-white text-sm w-full"
        />
      </section>

    </div>
  );
}