require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { Resend } = require('resend');
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(cors());
app.use(express.json());

const PORT    = process.env.PORT    || 5000;
const API_URL = process.env.API_URL || 'http://localhost:5000';
const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID || '1032892362121-71ep1vasopum4jiqi0lm2k5o0ngftpcr.apps.googleusercontent.com';

const googleClient = new OAuth2Client(GOOGLE_ID);
const resend = new Resend(process.env.RESEND_API_KEY);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const codigosTemp = new Map();

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function enviarCodigo(email, nombre) {
  const codigo = generarCodigo();
  const expira = Date.now() + 10 * 60 * 1000;
  codigosTemp.set(email, { codigo, expira });
  await resend.emails.send({
    from: 'JARide <onboarding@resend.dev>',
    to: email,
    subject: 'Tu código de verificación JARide',
    html: `
      <div style="background:#0a0a0a;padding:40px;font-family:sans-serif;color:#fff;max-width:480px;margin:0 auto;border-radius:16px">
        <h1 style="color:#f1c98a;font-size:28px;margin:0 0 8px">JARide</h1>
        <p style="color:#9ca3af;margin:0 0 32px">Verificación de seguridad</p>
        <p style="margin:0 0 16px">Hola <strong>${nombre}</strong>, tu código de verificación es:</p>
        <div style="background:#1a1a1a;border:1px solid #f1c98a30;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px">
          <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#f1c98a">${codigo}</span>
        </div>
        <p style="color:#6b7280;font-size:13px;margin:0">Este código expira en <strong>10 minutos</strong>.</p>
      </div>
    `
  });
  return codigo;
}

async function enviarCodigoRecuperacion(email, nombre) {
  const codigo = generarCodigo();
  const expira = Date.now() + 10 * 60 * 1000;
  codigosTemp.set(`reset_${email}`, { codigo, expira });
  await resend.emails.send({
    from: 'JARide <onboarding@resend.dev>',
    to: email,
    subject: 'Recuperación de contraseña JARide',
    html: `
      <div style="background:#0a0a0a;padding:40px;font-family:sans-serif;color:#fff;max-width:480px;margin:0 auto;border-radius:16px">
        <h1 style="color:#f1c98a;font-size:28px;margin:0 0 8px">JARide</h1>
        <p style="color:#9ca3af;margin:0 0 32px">Recuperación de contraseña</p>
        <p style="margin:0 0 16px">Hola <strong>${nombre}</strong>, tu código para restablecer tu contraseña es:</p>
        <div style="background:#1a1a1a;border:1px solid #f1c98a30;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px">
          <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#f1c98a">${codigo}</span>
        </div>
        <p style="color:#6b7280;font-size:13px;margin:0">Este código expira en <strong>10 minutos</strong>.</p>
      </div>
    `
  });
}

// Inicializar tablas
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id         SERIAL PRIMARY KEY,
      nombre     TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL DEFAULT '',
      rol        TEXT NOT NULL DEFAULT 'comprador',
      telefono   TEXT,
      direccion  TEXT,
      fotoPerfil TEXT,
      googleId   TEXT,
      dos_pasos  INTEGER DEFAULT 0,
      fecha_registro TEXT DEFAULT CURRENT_DATE
    );
    CREATE TABLE IF NOT EXISTS autos (
      id           SERIAL PRIMARY KEY,
      marca        TEXT NOT NULL,
      modelo       TEXT NOT NULL,
      anio         TEXT,
      precio       TEXT,
      km           TEXT,
      condicion    TEXT,
      transmision  TEXT,
      combustible  TEXT,
      descripcion  TEXT,
      categoria    TEXT,
      vendedor     TEXT,
      vendedor_email TEXT,
      estado       TEXT NOT NULL DEFAULT 'pendiente',
      verificado   INTEGER NOT NULL DEFAULT 0,
      fecha_publicacion TEXT DEFAULT CURRENT_DATE
    );
    CREATE TABLE IF NOT EXISTS fotos_autos (
      id      SERIAL PRIMARY KEY,
      auto_id INTEGER NOT NULL REFERENCES autos(id) ON DELETE CASCADE,
      url     TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reportes (
      id            SERIAL PRIMARY KEY,
      usuario_email TEXT NOT NULL,
      titulo        TEXT NOT NULL,
      descripcion   TEXT NOT NULL,
      categoria     TEXT NOT NULL DEFAULT 'general',
      estado        TEXT NOT NULL DEFAULT 'pendiente',
      fecha         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS mensajes (
      id         SERIAL PRIMARY KEY,
      de_email   TEXT NOT NULL,
      para_email TEXT NOT NULL,
      asunto     TEXT NOT NULL,
      cuerpo     TEXT NOT NULL,
      leido      INTEGER NOT NULL DEFAULT 0,
      fecha      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Tablas listas');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { const dir='./uploads/'; if(!fs.existsSync(dir)) fs.mkdirSync(dir); cb(null,dir); },
  filename: (req, file, cb) => cb(null, Date.now()+'-'+file.originalname)
});
const upload = multer({ storage });

async function autoConFotos(auto) {
  const fotos = await pool.query('SELECT url FROM fotos_autos WHERE auto_id = $1', [auto.id]);
  return { ...auto, verificado: auto.verificado === 1 || auto.verificado === true, photos: fotos.rows.map(f => f.url) };
}

// LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });

  let ok = false;
  if (user.password.startsWith('$2')) {
    ok = await bcrypt.compare(password, user.password);
  } else {
    if (user.password === password) {
      ok = true;
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hash, user.id]);
    }
  }
  if (!ok) return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });

  if (user.dos_pasos === 1) {
    try { await enviarCodigo(email, user.nombre); } catch (_) {}
    return res.json({ success: true, requiere2FA: true });
  }
  res.json({ success: true, nombre: user.nombre, foto: user.fotoperfil, rol: user.rol });
});

// LOGIN GOOGLE
app.post('/api/login/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_ID });
    const { sub: googleId, name, email, picture } = ticket.getPayload();
    let { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    let user = rows[0];
    if (!user) {
      await pool.query(`INSERT INTO usuarios (nombre, email, password, rol, fotoPerfil, googleId) VALUES ($1, $2, '', 'comprador', $3, $4)`, [name, email, picture, googleId]);
      ({ rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]));
      user = rows[0];
    } else if (!user.googleid) {
      await pool.query('UPDATE usuarios SET googleId = $1, fotoPerfil = $2 WHERE id = $3', [googleId, picture, user.id]);
    }
    res.json({ success: true, nombre: user.nombre, foto: user.fotoperfil || picture, rol: user.rol });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ success: false, message: 'Token de Google inválido' });
  }
});

// REGISTRO
app.post('/api/registro', async (req, res) => {
  const { nombre, email, password, rol, telefono, direccion, fotoPerfil } = req.body;
  const { rows } = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
  if (rows[0]) return res.json({ success: false, message: 'El usuario ya existe' });
  const hash = await bcrypt.hash(password, 10);
  await pool.query(`INSERT INTO usuarios (nombre, email, password, rol, telefono, direccion, fotoPerfil) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [nombre, email, hash, rol||'comprador', telefono, direccion, fotoPerfil]);
  res.json({ success: true });
});

// NOMINATIM
app.get('/api/nominatim/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ success: false, message: 'Falta query' });
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=mx&addressdetails=1&limit=6&dedupe=1`;
    const response = await fetch(url, { headers: { 'User-Agent': 'JARide/1.0' } });
    res.json(await response.json());
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error buscando direcciones' });
  }
});

// ADMIN
app.get('/api/admin/pendientes', async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM autos WHERE estado='pendiente'");
  res.json(await Promise.all(rows.map(autoConFotos)));
});
app.post('/api/admin/revisar-auto', async (req, res) => {
  await pool.query("UPDATE autos SET estado=$1 WHERE id=$2", [req.body.nuevoEstado, req.body.id]);
  res.json({ success: true });
});

// SUBIR FOTO
app.post('/api/subir-foto', upload.single('foto'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No se subió ninguna imagen' });
  try {
    const resultado = await cloudinary.uploader.upload(req.file.path, { folder: 'jaride' });
    fs.unlinkSync(req.file.path);
    res.json({ success: true, url: resultado.secure_url });
  } catch (err) {
    console.error('Error Cloudinary:', err);
    res.status(500).json({ success: false, message: 'Error al subir la imagen' });
  }
});

// AUTOS
app.get('/api/autos', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM autos');
  res.json(await Promise.all(rows.map(autoConFotos)));
});

app.post('/api/autos', async (req, res) => {
  const { marca,modelo,anio,precio,km,condicion,transmision,combustible,descripcion,categoria,vendedor,vendedor_email,photos,estado,verificado } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO autos (marca,modelo,anio,precio,km,condicion,transmision,combustible,descripcion,categoria,vendedor,vendedor_email,estado,verificado) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
    [marca,modelo,anio,precio,km,condicion,transmision,combustible,descripcion,categoria,vendedor,vendedor_email,estado||'pendiente',verificado?1:0]
  );
  const autoId = rows[0].id;
  if (Array.isArray(photos)) {
    for (const url of photos) await pool.query('INSERT INTO fotos_autos (auto_id, url) VALUES ($1, $2)', [autoId, url]);
  }
  res.json({ success: true });
});

app.get('/api/autos/verificados', async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM autos WHERE verificado = 1 AND estado = 'aprobado' ORDER BY id DESC`);
  res.json(await Promise.all(rows.map(autoConFotos)));
});

app.get('/api/autos/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM autos WHERE id = $1', [req.params.id]);
  const auto = rows[0];
  if (!auto) return res.status(404).json({ success: false, message: 'Auto no encontrado' });
  const { rows: vRows } = await pool.query('SELECT direccion FROM usuarios WHERE email = $1', [auto.vendedor_email]);
  res.json({ success: true, ...await autoConFotos(auto), ubicacion_vendedor: vRows[0]?.direccion || null });
});

// ADMIN USUARIOS
app.get('/api/admin/usuarios', async (req, res) => {
  const { rows } = await pool.query('SELECT id,nombre,email,rol,telefono,fotoPerfil FROM usuarios');
  res.json(rows);
});
app.delete('/api/admin/usuarios/:id', async (req, res) => {
  await pool.query('DELETE FROM usuarios WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});

// ADMIN VEHICULOS
app.get('/api/admin/vehiculos', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM autos');
  res.json(await Promise.all(rows.map(autoConFotos)));
});
app.delete('/api/admin/vehiculos/:id', async (req, res) => {
  await pool.query('DELETE FROM autos WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});
app.patch('/api/admin/vehiculos/:id', async (req, res) => {
  await pool.query('UPDATE autos SET estado=$1 WHERE id=$2', [req.body.estado, req.params.id]);
  res.json({ success: true });
});

// ADMIN PERFIL Y PASSWORD
app.patch('/api/admin/perfil', async (req, res) => {
  const { email, nombre, fotoPerfil } = req.body;
  await pool.query('UPDATE usuarios SET nombre=$1, fotoPerfil=$2 WHERE email=$3', [nombre, fotoPerfil, email]);
  res.json({ success: true });
});
app.patch('/api/admin/password', async (req, res) => {
  const { email, passwordActual, passwordNuevo } = req.body;
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email=$1', [email]);
  const user = rows[0];
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  const ok = user.password.startsWith('$2') ? await bcrypt.compare(passwordActual, user.password) : user.password === passwordActual;
  if (!ok) return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
  await pool.query('UPDATE usuarios SET password=$1 WHERE email=$2', [await bcrypt.hash(passwordNuevo, 10), email]);
  res.json({ success: true });
});

// EXPORTAR
app.get('/api/admin/exportar/usuarios', async (req, res) => {
  const { rows } = await pool.query('SELECT id,nombre,email,rol,telefono FROM usuarios');
  const csv = ['ID,Nombre,Email,Rol,Telefono', ...rows.map(u=>`${u.id},${u.nombre},${u.email},${u.rol},${u.telefono||''}`)].join('\n');
  res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename=usuarios.csv'); res.send(csv);
});
app.get('/api/admin/exportar/autos', async (req, res) => {
  const { rows } = await pool.query('SELECT id,marca,modelo,anio,precio,km,estado,vendedor FROM autos');
  const csv = ['ID,Marca,Modelo,Anio,Precio,KM,Estado,Vendedor', ...rows.map(a=>`${a.id},${a.marca},${a.modelo},${a.anio},${a.precio},${a.km},${a.estado},${a.vendedor}`)].join('\n');
  res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename=autos.csv'); res.send(csv);
});

// STATS
app.get('/api/admin/stats', async (req, res) => {
  const q = async (sql) => (await pool.query(sql)).rows[0].t;
  res.json({
    totalAutos:      await q("SELECT COUNT(*) as t FROM autos"),
    autosAprobados:  await q("SELECT COUNT(*) as t FROM autos WHERE estado='aprobado'"),
    autosPendientes: await q("SELECT COUNT(*) as t FROM autos WHERE estado='pendiente'"),
    totalUsuarios:   await q("SELECT COUNT(*) as t FROM usuarios"),
    compradores:     await q("SELECT COUNT(*) as t FROM usuarios WHERE rol='comprador'"),
    vendedores:      await q("SELECT COUNT(*) as t FROM usuarios WHERE rol='vendedor'"),
  });
});

// GRAFICAS
app.get('/api/admin/graficas/categorias', async (req, res) => {
  const { rows } = await pool.query(`SELECT categoria as name, COUNT(*) as total FROM autos WHERE estado = 'aprobado' AND categoria IS NOT NULL AND categoria != '' GROUP BY categoria ORDER BY total DESC`);
  res.json(rows);
});
app.get('/api/admin/graficas/marcas', async (req, res) => {
  const { rows } = await pool.query(`SELECT marca as name, COUNT(*) as total FROM autos WHERE marca IS NOT NULL AND marca != '' GROUP BY marca ORDER BY total DESC LIMIT 6`);
  res.json(rows);
});
app.get('/api/admin/graficas/usuarios-mes', async (req, res) => {
  const dias = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dias.push(d.toISOString().split('T')[0]);
  }
  const { rows } = await pool.query(`SELECT fecha_registro as fecha, COUNT(*) as total FROM usuarios WHERE fecha_registro >= CURRENT_DATE - INTERVAL '30 days' GROUP BY fecha_registro`);
  const mapa = {};
  for (const r of rows) mapa[r.fecha] = r.total;
  res.json(dias.map(fecha => ({ name: fecha.slice(5), total: mapa[fecha] || 0 })));
});

// REPORTES
app.post('/api/reportes', async (req, res) => {
  const { usuario_email, titulo, descripcion, categoria } = req.body;
  if (!usuario_email || !titulo || !descripcion) return res.status(400).json({ success: false, message: 'Faltan campos' });
  await pool.query(`INSERT INTO reportes (usuario_email, titulo, descripcion, categoria) VALUES ($1,$2,$3,$4)`, [usuario_email, titulo, descripcion, categoria||'general']);
  res.json({ success: true });
});
app.get('/api/admin/reportes', async (req, res) => {
  const { rows } = await pool.query(`SELECT r.*, u.nombre as usuario_nombre, u.fotoPerfil as usuario_foto, u.rol as usuario_rol FROM reportes r LEFT JOIN usuarios u ON u.email = r.usuario_email ORDER BY r.fecha DESC`);
  res.json(rows);
});
app.get('/api/reportes/mis-reportes', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM reportes WHERE usuario_email = $1 ORDER BY fecha DESC', [req.query.email]);
  res.json(rows);
});
app.patch('/api/admin/reportes/:id', async (req, res) => {
  await pool.query('UPDATE reportes SET estado = $1 WHERE id = $2', [req.body.estado, req.params.id]);
  res.json({ success: true });
});
app.delete('/api/admin/reportes/:id', async (req, res) => {
  await pool.query('DELETE FROM reportes WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});
app.get('/api/admin/reportes/stats', async (req, res) => {
  const q = async (sql) => (await pool.query(sql)).rows[0].t;
  res.json({
    total:      await q("SELECT COUNT(*) as t FROM reportes"),
    pendientes: await q("SELECT COUNT(*) as t FROM reportes WHERE estado = 'pendiente'"),
    urgentes:   await q("SELECT COUNT(*) as t FROM reportes WHERE estado = 'urgente'"),
    resueltos:  await q("SELECT COUNT(*) as t FROM reportes WHERE estado = 'resuelto'"),
  });
});

// MENSAJES
app.post('/api/mensajes', async (req, res) => {
  const { de_email, para_email, asunto, cuerpo } = req.body;
  if (!de_email || !para_email || !asunto || !cuerpo) return res.status(400).json({ success: false, message: 'Faltan campos' });
  await pool.query(`INSERT INTO mensajes (de_email, para_email, asunto, cuerpo) VALUES ($1,$2,$3,$4)`, [de_email, para_email, asunto, cuerpo]);
  res.json({ success: true });
});
app.get('/api/mensajes/recibidos', async (req, res) => {
  const { rows } = await pool.query(`SELECT m.*, u.nombre as de_nombre, u.fotoPerfil as de_foto, u.rol as de_rol FROM mensajes m LEFT JOIN usuarios u ON u.email = m.de_email WHERE m.para_email = $1 ORDER BY m.fecha DESC`, [req.query.email]);
  res.json(rows);
});
app.get('/api/mensajes/enviados', async (req, res) => {
  const { rows } = await pool.query(`SELECT m.*, u.nombre as para_nombre, u.fotoPerfil as para_foto, u.rol as para_rol FROM mensajes m LEFT JOIN usuarios u ON u.email = m.para_email WHERE m.de_email = $1 ORDER BY m.fecha DESC`, [req.query.email]);
  res.json(rows);
});
app.patch('/api/mensajes/:id/leer', async (req, res) => {
  await pool.query('UPDATE mensajes SET leido = 1 WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});
app.delete('/api/mensajes/:id', async (req, res) => {
  await pool.query('DELETE FROM mensajes WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});
app.get('/api/mensajes/no-leidos', async (req, res) => {
  const { rows } = await pool.query('SELECT COUNT(*) as t FROM mensajes WHERE para_email = $1 AND leido = 0', [req.query.email]);
  res.json({ total: rows[0].t });
});
app.get('/api/usuarios/lista', async (req, res) => {
  const { rows } = await pool.query('SELECT nombre, email, rol FROM usuarios WHERE email != $1', [req.query.email]);
  res.json(rows);
});

// PERFIL USUARIO
app.get('/api/usuario/perfil', async (req, res) => {
  const { rows } = await pool.query('SELECT id, nombre, email, rol, telefono, direccion, fotoPerfil FROM usuarios WHERE email = $1', [req.query.email]);
  if (!rows[0]) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  res.json({ success: true, ...rows[0] });
});
app.patch('/api/usuario/perfil', async (req, res) => {
  const { email, nombre, telefono, direccion, fotoPerfil } = req.body;
  await pool.query('UPDATE usuarios SET nombre=$1, telefono=$2, direccion=$3, fotoPerfil=$4 WHERE email=$5', [nombre, telefono, direccion, fotoPerfil, email]);
  res.json({ success: true });
});
app.patch('/api/usuario/password', async (req, res) => {
  const { email, passwordActual, passwordNuevo } = req.body;
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  const ok = user.password.startsWith('$2') ? await bcrypt.compare(passwordActual, user.password) : user.password === passwordActual;
  if (!ok) return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
  await pool.query('UPDATE usuarios SET password=$1 WHERE email=$2', [await bcrypt.hash(passwordNuevo, 10), email]);
  res.json({ success: true });
});
app.delete('/api/usuario/cuenta', async (req, res) => {
  await pool.query('DELETE FROM usuarios WHERE email=$1', [req.body.email]);
  res.json({ success: true });
});

// 2FA
app.post('/api/usuario/2fa/enviar', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [req.body.email]);
  const user = rows[0];
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  try {
    await enviarCodigo(req.body.email, user.nombre);
    res.json({ success: true, message: 'Código enviado' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});
app.post('/api/usuario/2fa/verificar', async (req, res) => {
  const { email, codigo, activar } = req.body;
  const entrada = codigosTemp.get(email);
  if (!entrada) return res.status(400).json({ success: false, message: 'No hay código pendiente' });
  if (Date.now() > entrada.expira) { codigosTemp.delete(email); return res.status(400).json({ success: false, message: 'El código expiró' }); }
  if (entrada.codigo !== codigo) return res.status(400).json({ success: false, message: 'Código incorrecto' });
  codigosTemp.delete(email);
  await pool.query('UPDATE usuarios SET dos_pasos=$1 WHERE email=$2', [activar ? 1 : 0, email]);
  res.json({ success: true });
});
app.get('/api/usuario/2fa/estado', async (req, res) => {
  const { rows } = await pool.query('SELECT dos_pasos FROM usuarios WHERE email=$1', [req.query.email]);
  if (!rows[0]) return res.status(404).json({ success: false });
  res.json({ success: true, activado: rows[0].dos_pasos === 1 });
});
app.post('/api/login/2fa', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email=$1', [req.body.email]);
  if (!rows[0]) return res.status(404).json({ success: false });
  try { await enviarCodigo(req.body.email, rows[0].nombre); res.json({ success: true }); }
  catch (err) { res.status(500).json({ success: false, message: 'Error al enviar el correo' }); }
});

// RECUPERAR CONTRASEÑA
app.post('/api/password/recuperar', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email=$1', [req.body.email]);
  if (!rows[0]) return res.status(404).json({ success: false, message: 'No existe una cuenta con ese correo' });
  try {
    await enviarCodigoRecuperacion(req.body.email, rows[0].nombre);
    res.json({ success: true });
  } catch (err) {
    console.error('Error enviando correo recuperación:', err);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});
app.post('/api/password/reset', async (req, res) => {
  const { email, codigo, nuevaPassword } = req.body;
  const entrada = codigosTemp.get(`reset_${email}`);
  if (!entrada) return res.status(400).json({ success: false, message: 'No hay código pendiente' });
  if (Date.now() > entrada.expira) { codigosTemp.delete(`reset_${email}`); return res.status(400).json({ success: false, message: 'El código expiró' }); }
  if (entrada.codigo !== codigo) return res.status(400).json({ success: false, message: 'Código incorrecto' });
  codigosTemp.delete(`reset_${email}`);
  await pool.query('UPDATE usuarios SET password=$1 WHERE email=$2', [await bcrypt.hash(nuevaPassword, 10), email]);
  res.json({ success: true });
});

app.get('/', (req, res) => res.send('🚀 Servidor JARide con PostgreSQL funcionando'));

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor listo en puerto ${PORT}`));
});