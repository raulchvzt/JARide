import React, { useState, useEffect, useRef, memo } from 'react';

const InputGroup = ({ label, name, value, onChange, placeholder, options }) => (
  <div className="flex flex-col gap-2">
    <label className="text-white/40 text-[10px] uppercase font-bold">{label}</label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#e7b476]/50 transition-colors"
      >
        <option value="">Selecciona</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : (
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#e7b476]/50 transition-colors"
      />
    )}
  </div>
);

// Input genérico con sugerencias desde la API
const SugerenciasInput = ({ label, name, value, onChange, placeholder, fetchUrl, mapear }) => {
  const [sugerencias, setSugerencias] = useState([]);
  const [todas, setTodas] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    fetch(fetchUrl)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setTodas(d.map(mapear)); })
      .catch(() => {});
  }, [fetchUrl]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    onChange(e);
    if (val.length > 0) {
      const filtradas = todas.filter(m => m.toLowerCase().includes(val.toLowerCase()));
      setSugerencias(filtradas);
      setAbierto(filtradas.length > 0);
    } else {
      setAbierto(false);
    }
  };

  const seleccionar = (item) => {
    onChange({ target: { name, value: item } });
    setAbierto(false);
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={ref}>
      <label className="text-white/40 text-[10px] uppercase font-bold">{label}</label>
      <input
        name={name}
        value={value}
        onChange={handleInput}
        onFocus={() => value.length > 0 && sugerencias.length > 0 && setAbierto(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#e7b476]/50 transition-colors"
      />
      {abierto && (
        <ul className="absolute top-full mt-1 left-0 right-0 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden z-50 shadow-xl">
          {sugerencias.map(item => (
            <li
              key={item}
              onMouseDown={() => seleccionar(item)}
              className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#e7b476] cursor-pointer transition-colors"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Input de precio con formato de comas automático
const PrecioInput = ({ value, onChange }) => {
  const handlePrecio = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const partes = raw.split('.');
    const entero = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimal = partes[1] !== undefined ? '.' + partes[1].slice(0, 2) : '';
    onChange(entero + decimal, raw);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white/40 text-[10px] uppercase font-bold">Precio ($)</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
        <input
          name="precio"
          value={value}
          onChange={handlePrecio}
          placeholder="0.00"
          className="bg-[#111] border border-white/10 rounded-lg p-3 pl-7 text-white text-sm outline-none focus:border-[#e7b476]/50 transition-colors w-full"
        />
      </div>
    </div>
  );
};

// Input de KM con chips de rangos rápidos
const KMInput = ({ value, onChange }) => {
  const rangos = ['0', '5,000', '10,000', '25,000', '50,000', '100,000'];

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const formateado = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    onChange({ target: { name: 'km', value: formateado } });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white/40 text-[10px] uppercase font-bold">Kilometraje (KM)</label>
      <input
        name="km"
        value={value}
        onChange={handleInput}
        placeholder="Ej: 15,000"
        className="bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#e7b476]/50 transition-colors"
      />
      <div className="flex flex-wrap gap-2 mt-1">
        {rangos.map(r => (
          <button
            key={r}
            type="button"
            onMouseDown={() => onChange({ target: { name: 'km', value: r } })}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border ${
              value === r
                ? 'bg-[#e7b476]/10 text-[#e7b476] border-[#e7b476]/30'
                : 'bg-white/5 text-white/30 border-white/5 hover:text-white/60 hover:bg-white/10'
            }`}
          >
            {r === '0' ? '0 km' : r}
          </button>
        ))}
      </div>
    </div>
  );
};

const VenderForm = ({ formData, setFormData }) => {

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrecio = (valorFormateado, valorRaw) => {
    setFormData({ ...formData, precio: valorFormateado, _precioRaw: valorRaw });
  };

  return (
    <div className="space-y-10 mb-20">

      <section>
        <h3 className="text-white font-medium mb-6">2. Información del vehículo</h3>
        <div className="grid md:grid-cols-2 gap-6">

          <SugerenciasInput
            label="Marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            placeholder="Ej. Audi"
            fetchUrl={`${import.meta.env.VITE_API_URL}/api/admin/graficas/marcas`}
            mapear={m => m.name}
          />

          <SugerenciasInput
            label="Modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            placeholder="Ej. R8"
            fetchUrl={`${import.meta.env.VITE_API_URL}/api/admin/graficas/modelos`}
            mapear={m => m.name}
          />

          <KMInput value={formData.km} onChange={handleChange} />

          <InputGroup
            label="Categoría (Tipo de auto)"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            options={["SUVs", "Sedanes", "PickUps", "Deportivos", "Eléctricos"]}
          />

          <InputGroup
            label="Año"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            options={["2025", "2024", "2023", "2022", "2021", "2020"]}
          />

          <PrecioInput value={formData.precio} onChange={handlePrecio} />

        </div>
      </section>

      <section>
        <h3 className="text-white font-medium mb-6">3. Especificaciones</h3>
        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <label className="text-white/40 text-[10px] font-bold uppercase">Condición</label>
            <div className="flex gap-2 mt-2">
              {["Seminuevo", "Usado"].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, condicion: c })}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${
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
            options={["Automática", "Manual"]}
          />

          <InputGroup
            label="Combustible"
            name="combustible"
            value={formData.combustible}
            onChange={handleChange}
            options={["Eléctrico", "Gasolina", "Híbrido"]}
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
          placeholder="Describe el estado de tu vehículo, equipamiento extra o detalles importantes..."
          className="bg-[#111] border border-white/10 rounded-lg p-4 text-white text-sm w-full outline-none focus:border-[#e7b476]/50 transition-colors"
        />
      </section>

    </div>
  );
}

export default memo(VenderForm);