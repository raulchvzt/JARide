const Database = require('better-sqlite3');
const db = new Database('./jaride.db');

const updates = [
  { email: 'vendedor@gmail.com',      nombre: 'Juan P' },
  { email: 'admin@jaride.com',        nombre: 'Admin JARide' },
  { email: 'compraddtech@gmail.com',  nombre: 'Alex' },
];

for (const u of updates) {
  const r = db.prepare("UPDATE autos SET vendedor_email = ? WHERE vendedor = ? AND (vendedor_email IS NULL OR vendedor_email = '')").run(u.email, u.nombre);
  console.log(`✅ ${u.nombre} → ${u.email} (${r.changes} autos actualizados)`);
}

db.close();
console.log('Listo.');