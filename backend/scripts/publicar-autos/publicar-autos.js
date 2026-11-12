/**
 * Publica en JARide los autos de autos.json, con sus fotos de la carpeta fotos/.
 *
 * Las fotos se copian a frontend/public/autos/ para que Vercel las sirva directamente
 * (por ejemplo https://ja-ride.vercel.app/autos/bugatti-divo-1.jpg), sin usar Cloudinary.
 * Los autos se guardan en PostgreSQL ya aprobados.
 *
 * Coloca esta carpeta en backend/scripts/publicar-autos y, desde la carpeta backend:
 *   node scripts/publicar-autos/publicar-autos.js --dry   -> solo revisa, no copia ni publica nada
 *   node scripts/publicar-autos/publicar-autos.js         -> publica
 *
 * Después haz push para que Vercel publique las fotos.
 * Si un auto ya está publicado (misma marca, modelo, año y vendedor), se omite,
 * así que es seguro correrlo otra vez.
 */
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { Pool } = require('pg');

const DRY = process.argv.includes('--dry');
const CARPETA_FOTOS = path.join(__dirname, 'fotos');
const DESTINO = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'autos');
const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'autos.json'), 'utf8'));

function fotosDe(prefijo) {
  return fs
    .readdirSync(CARPETA_FOTOS)
    .filter((f) => f.startsWith(prefijo + '-'))
    .sort((a, b) => parseInt(a.split('-').pop()) - parseInt(b.split('-').pop()));
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL en backend/.env');
  if (!fs.existsSync(path.dirname(DESTINO))) {
    throw new Error(`No encontré ${path.dirname(DESTINO)}. Revisa que el script esté en backend/scripts/publicar-autos dentro de JARide.`);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const { vendedor, vendedor_email } = datos;
  let publicados = 0, omitidos = 0, totalFotos = 0;

  if (DRY) console.log('🔎 Modo prueba (--dry): no se copia ni se publica nada\n');
  else fs.mkdirSync(DESTINO, { recursive: true });

  try {
    const cuenta = await pool.query('SELECT 1 FROM usuarios WHERE LOWER(email) = LOWER($1)', [vendedor_email]);
    if (cuenta.rowCount === 0) {
      console.log(`⚠️  La cuenta ${vendedor_email} no existe en la base. Los autos se publicarán igual,`);
      console.log('   pero conviene crearla para que los compradores puedan enviarle mensajes.\n');
    }

    for (const a of datos.autos) {
      const nombre = `${a.marca} ${a.modelo} ${a.anio}`;
      const fotos = fotosDe(a.fotos);
      if (fotos.length === 0) {
        console.log(`⚠️  ${nombre}: no encontré fotos que empiecen con "${a.fotos}-", se omite`);
        omitidos++;
        continue;
      }

      const existe = await pool.query(
        'SELECT id FROM autos WHERE marca = $1 AND modelo = $2 AND anio = $3 AND LOWER(vendedor_email) = LOWER($4)',
        [a.marca, a.modelo, a.anio, vendedor_email]
      );
      if (existe.rowCount > 0) {
        console.log(`⏭️  ${nombre}: ya estaba publicado, se omite`);
        omitidos++;
        continue;
      }

      if (DRY) {
        console.log(`✔️  ${nombre} · USD$ ${Number(a.precio).toLocaleString('en-US')} · ${fotos.length} fotos${a.verificado ? ' · verificado' : ''}`);
        publicados++;
        totalFotos += fotos.length;
        continue;
      }

      // Copia las fotos al frontend; la URL es relativa, así funciona en Vercel y en local
      const urls = fotos.map((f) => {
        fs.copyFileSync(path.join(CARPETA_FOTOS, f), path.join(DESTINO, f));
        return `/autos/${f}`;
      });

      const db = await pool.connect();
      try {
        await db.query('BEGIN');
        const { rows } = await db.query(
          `INSERT INTO autos (marca, modelo, anio, precio, km, condicion, transmision, combustible, descripcion, categoria, vendedor, vendedor_email, estado, verificado)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'aprobado',$13) RETURNING id`,
          [a.marca, a.modelo, a.anio, a.precio, a.km, a.condicion, a.transmision, a.combustible,
           a.descripcion, a.categoria, vendedor, vendedor_email, a.verificado ? 1 : 0]
        );
        for (const url of urls) {
          await db.query('INSERT INTO fotos_autos (auto_id, url) VALUES ($1,$2)', [rows[0].id, url]);
        }
        await db.query('COMMIT');
      } catch (err) {
        await db.query('ROLLBACK');
        throw err;
      } finally {
        db.release();
      }

      console.log(`✅ ${nombre} publicado con ${urls.length} fotos`);
      publicados++;
      totalFotos += urls.length;
    }

    console.log(`\n${DRY ? '🔎 Se publicarían' : '🎉 Publicados'}: ${publicados} autos con ${totalFotos} fotos · Omitidos: ${omitidos}`);
    if (DRY) console.log('Si todo se ve bien, corre el script sin --dry.');
    else if (publicados > 0) console.log('👉 Ahora haz push para que Vercel publique las fotos (frontend/public/autos).');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  console.error('   Puedes volver a correr el script: los autos ya publicados se omiten.');
  process.exitCode = 1;
});