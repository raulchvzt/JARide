/**
 * Convierte en administrador a un usuario que ya está registrado.
 *
 * Uso (desde la carpeta backend):
 *   node scripts/hacer-admin.js correo@ejemplo.com
 *
 * Necesita DATABASE_URL en backend/.env (la External Database URL de Render).
 */
require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const email = (process.argv[2] || '').trim();
  if (!email) throw new Error('Escribe el correo: node scripts/hacer-admin.js correo@ejemplo.com');
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL en backend/.env');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    const { rows } = await pool.query(
      "UPDATE usuarios SET rol = 'admin' WHERE LOWER(email) = LOWER($1) RETURNING nombre, email, rol",
      [email]
    );
    if (rows.length === 0) {
      console.log(`❌ No existe ningún usuario con el correo ${email}. Regístrate primero en la página.`);
      process.exitCode = 1;
    } else {
      console.log(`✅ ${rows[0].nombre} (${rows[0].email}) ahora es ${rows[0].rol}.`);
      console.log('   Cierra sesión y vuelve a entrar para ver el panel de administración.');
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exitCode = 1;
});