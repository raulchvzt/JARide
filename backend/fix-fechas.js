const Database = require('better-sqlite3');
const db = new Database('./jaride.db');

try {
  db.exec('ALTER TABLE usuarios ADD COLUMN fecha_registro TEXT');
  console.log('✅ Columna fecha_registro creada');
} catch (e) {
  console.log('ℹ️ La columna ya existe');
}

db.prepare("UPDATE usuarios SET fecha_registro = date('now') WHERE fecha_registro IS NULL").run();
console.log('✅ Fechas asignadas a todos los usuarios');
db.cl