require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { Resend } = require('resend');

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(cors());
app.use(express.json());

const PORT      = process.env.PORT      || 5000;
const DB_PATH   = process.env.DB_PATH   || './jaride.db';
const API_URL   = process.env.API_URL   || 'http://localhost:5000';
const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID || '1032892362121-71ep1vasopum4jiqi0lm2k5o0ngftpcr.apps.googleusercontent.com';

const googleClient = new OAuth2Client(GOOGLE_ID);
const resend = new Resend(process.env.RESEND_API_KEY);

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
        <p style="color:#6b7280;font-size:13px;margin:0">Este código expira en <strong>10 minutos</strong>. Si no solicitaste esto, ignora este correo.</p>
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
        <p style="color:#6b7280;font-size:13px;margin:0">Este código expira en <strong>10 minutos</strong>. Si no solicitaste esto, ignora este correo.</p>
      </div>
    `
  });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL DEFAULT '',
    rol        TEXT    NOT NULL DEFAULT 'comprador',
    telefono   TEXT,
    direccion  TEXT,
    fotoPerfil TEXT,
    googleId   TEXT
  );
  CREATE TABLE IF NOT EXISTS autos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    marca        TEXT    NOT NULL,
    modelo       TEXT    NOT NULL,
    anio         TEXT,
    precio       TEXT,
    km           TEXT,
    condicion    TEXT,
    transmision  TEXT,
    combustible  TEXT,
    descripcion  TEXT,
    categoria    TEXT,
    vendedor     TEXT,
    estado       TEXT    NOT NULL DEFAULT 'pendiente',
    verificado   INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS fotos_autos (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    auto_id INTEGER NOT NULL,
    url     TEXT    NOT NULL,
    FOREIGN KEY (auto_id) REFERENCES autos(id) ON DELETE CASCADE
  );
`);

try { db.exec(`ALTER TABLE usuarios ADD COLUMN googleId TEXT`); } catch (_) {}
try { db.exec(`ALTER TABLE autos ADD COLUMN vendedor_email TEXT`); } catch (_) {}

function migrarDesdeJSON() {
  const USERS_PATH = './usuarios.json';
  const AUTOS_PATH = './autos.json';
  if (fs.existsSync(USERS_PATH)) {
    const usuarios = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
    const ins = db.prepare(`INSERT OR IGNORE INTO usuarios (nombre, email, password, rol, telefono, direccion, fotoPerfil) VALUES (@nombre, @email, @password, @rol, @telefono, @direccion, @fotoPerfil)`);
    const tx = db.transaction((lista) => {
      for (const u of lista) ins.run({ nombre: u.nombre||'', email: u.email||'', password: u.password||'', rol: u.rol||'comprador', telefono: u.telefono||null, direccion: u.direccion||null, fotoPerfil: u.fotoPerfil||null });
    });
    tx(usuarios);
    fs.renameSync(USERS_PATH, './usuarios.json.bak');
    console.log('✅ Usuarios migrados');
  }
  if (fs.existsSync(AUTOS_PATH)) {
    const autos = JSON.parse(fs.readFileSync(AUTOS_PATH, 'utf8'));
    const insA = db.prepare(`INSERT INTO autos (marca,modelo,anio,precio,km,condicion,transmision,combustible,descripcion,categoria,vendedor,estado,verificado) VALUES (@marca,@modelo,@anio,@precio,@km,@condicion,@transmision,@combustible,@descripcion,@categoria,@vendedor,@estado,@verificado)`);
    const insF = db.prepare(`INSERT INTO fotos_autos (auto_id, url) VALUES (?, ?)`);
    const tx = db.transaction((lista) => {
      for (const a of lista) {
        const info = insA.run({ marca:a.marca, modelo:a.modelo, anio:a.anio, precio:a.precio, km:a.km, condicion:a.condicion, transmision:a.transmision, combustible:a.combustible, descripcion:a.descripcion, categoria:a.categoria, vendedor:a.vendedor, estado:a.estado||'pendiente', verificado:a.verificado?1:0 });
        if (Array.isArray(a.photos)) for (const url of a.photos) insF.run(info.lastInsertRowid, url);
      }
    });
    tx(autos);
    fs.renameSync(AUTOS_PATH, './autos.json.bak');
    console.log('✅ Autos migrados');
  }
}
migrarDesdeJSON();

const storage = multer.diskStorage({
  destination: (req, file, cb) => { const dir='./uploads/'; if(!fs.existsSync(dir)) fs.mkdirSync(dir); cb(null,dir); },
  filename: (req, file, cb) => cb(null, Date.now()+'-'+file.originalname)
});
const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

function autoConFotos(auto) {
  const fotos = db.prepare('SELECT url FROM fotos_autos WHERE auto_id = ?').all(auto.id);
  return { ...auto, verificado: auto.verificado===1, photos: fotos.map(f=>f.url) };
}

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });

  let ok = false;
  if (user.password.startsWith('$2')) {
    ok = await bcrypt.compare(password, user.password);
  } else {
    if (user.password === password) {
      ok = true;
      const hash = await bcrypt.hash(password, 10);
      db.prepare('UPDATE usuarios SET password = ? WHERE id = ?').run(hash, user.id);
    }
  }
  if (!ok) return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });

  if (user.dos_pasos === 1) {
    try { await enviarCodigo(email, user.nombre); } catch (_) {}
    return res.json({ success: true, requiere2FA: true });
  }

  res.json({ success: true, nombre: user.nombre, foto: user.fotoPerfil, rol: user.rol });
});

app.post('/api/login/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_ID });
    const { sub: googleId, name, email, picture } = ticket.getPayload();
    let user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    if (!user) {
      db.prepare(`INSERT INTO usuarios (nombre, email, password, rol, fotoPerfil, googleId) VALUES (?, ?, '', 'comprador', ?, ?)`).run(name, email, picture, googleId);
      user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    } else if (!user.googleId) {
      db.prepare('UPDATE usuarios SET googleId = ?, fotoPerfil = ? WHERE id = ?').run(googleId, picture, user.id);
    }
    res.json({ success: true, nombre: user.nombre, foto: user.fotoPerfil || picture, rol: user.rol });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ success: false, message: 'Token de Google inválido' });
  }
});

app.post('/api/registro', async (req, res) => {
  const { nombre, email, password, rol, telefono, direccion, fotoPerfil } = req.body;
  if (db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email))
    return res.json({ success: false, message: 'El usuario ya existe' });
  const hash = await bcrypt.hash(password, 10);
  db.prepare(`INSERT INTO usuarios (nombre, email, password, rol, telefono, direccion, fotoPerfil) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(nombre, email, hash, rol||'comprador', telefono, direccion, fotoPerfil);
  res.json({ success: true });
});

app.get('/api/nominatim/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ success: false, message: 'Falta query' });
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=mx&addressdetails=1&limit=6&dedupe=1`;
    const response = await fetch(url, { headers: { 'User-Agent': 'JARide/1.0' } });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error Nominatim:', error);
    res.status(500).json({ success: false, message: 'Error buscando direcciones' });
  }
});

app.get('/api/admin/pendientes', (req, res) => res.json(db.prepare("SELECT * FROM autos WHERE estado='pendiente'").all().map(autoConFotos)));
app.post('/api/admin/revisar-auto', (req, res) => { db.prepare("UPDATE autos SET estado=? WHERE id=?").run(req.body.nuevoEstado, req.body.id); res.json({ success: true }); });

app.post('/api/subir-foto', upload.single('foto'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No se subió ninguna imagen' });
  try {
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: 'jaride',
    });
    fs.unlinkSync(req.file.path); // borra el archivo temporal
    res.json({ success: true, url: resultado.secure_url });
  } catch (err) {
    console.error('Error Cloudinary:', err);
    res.status(500).json({ success: false, message: 'Error al subir la imagen' });
  }
});

app.get('/api/autos', (req, res) => res.json(db.prepare('SELECT * FROM autos').all().map(autoConFotos)));
app.post('/api/autos', (req, res) => {
  const { marca,modelo,anio,precio,km,condicion,transmision,combustible,descripcion,categoria,vendedor,photos,estado,verificado } = req.body;
  const info = db.prepare(`INSERT INTO autos (marca,modelo,anio,precio,km,condicion,transmision,combustible,descripcion,categoria,vendedor,estado,verificado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(marca,modelo,anio,precio,km,condicion,transmision,combustible,descripcion,categoria,vendedor,estado||'pendiente',verificado?1:0);
  if (Array.isArray(photos)) { const ins=db.prepare('INSERT INTO fotos_autos (auto_id,url) VALUES (?,?)'); for(const url of photos) ins.run(info.lastInsertRowid,url); }
  res.json({ success: true });
});

app.get('/api/admin/usuarios', (req, res) => res.json(db.prepare('SELECT id,nombre,email,rol,telefono,fotoPerfil FROM usuarios').all()));
app.delete('/api/admin/usuarios/:id', (req, res) => { db.prepare('DELETE FROM usuarios WHERE id=?').run(req.params.id); res.json({ success: true }); });

app.get('/api/admin/vehiculos', (req, res) => res.json(db.prepare('SELECT * FROM autos').all().map(autoConFotos)));
app.delete('/api/admin/vehiculos/:id', (req, res) => { db.prepare('DELETE FROM fotos_autos WHERE auto_id=?').run(req.params.id); db.prepare('DELETE FROM autos WHERE id=?').run(req.params.id); res.json({ success: true }); });
app.patch('/api/admin/vehiculos/:id', (req, res) => { db.prepare('UPDATE autos SET estado=? WHERE id=?').run(req.body.estado, req.params.id); res.json({ success: true }); });

app.patch('/api/admin/perfil', (req, res) => {
  const { email, nombre, fotoPerfil } = req.body;
  db.prepare('UPDATE usuarios SET nombre=?, fotoPerfil=? WHERE email=?').run(nombre, fotoPerfil, email);
  res.json({ success: true });
});

app.patch('/api/admin/password', async (req, res) => {
  const { email, passwordActual, passwordNuevo } = req.body;
  const user = db.prepare('SELECT * FROM usuarios WHERE email=?').get(email);
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  const ok = user.password.startsWith('$2') ? await bcrypt.compare(passwordActual, user.password) : user.password === passwordActual;
  if (!ok) return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
  db.prepare('UPDATE usuarios SET password=? WHERE email=?').run(await bcrypt.hash(passwordNuevo, 10), email);
  res.json({ success: true });
});

app.get('/api/admin/exportar/usuarios', (req, res) => {
  const csv = ['ID,Nombre,Email,Rol,Telefono', ...db.prepare('SELECT id,nombre,email,rol,telefono FROM usuarios').all().map(u=>`${u.id},${u.nombre},${u.email},${u.rol},${u.telefono||''}`)].join('\n');
  res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename=usuarios.csv'); res.send(csv);
});
app.get('/api/admin/exportar/autos', (req, res) => {
  const csv = ['ID,Marca,Modelo,Anio,Precio,KM,Estado,Vendedor', ...db.prepare('SELECT id,marca,modelo,anio,precio,km,estado,vendedor FROM autos').all().map(a=>`${a.id},${a.marca},${a.modelo},${a.anio},${a.precio},${a.km},${a.estado},${a.vendedor}`)].join('\n');
  res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename=autos.csv'); res.send(csv);
});

app.get('/api/admin/stats', (req, res) => res.json({
  totalAutos:      db.prepare("SELECT COUNT(*) as t FROM autos").get().t,
  autosAprobados:  db.prepare("SELECT COUNT(*) as t FROM autos WHERE estado='aprobado'").get().t,
  autosPendientes: db.prepare("SELECT COUNT(*) as t FROM autos WHERE estado='pendiente'").get().t,
  totalUsuarios:   db.prepare("SELECT COUNT(*) as t FROM usuarios").get().t,
  compradores:     db.prepare("SELECT COUNT(*) as t FROM usuarios WHERE rol='comprador'").get().t,
  vendedores:      db.prepare("SELECT COUNT(*) as t FROM usuarios WHERE rol='vendedor'").get().t,
}));

try { db.exec(`ALTER TABLE usuarios ADD COLUMN fecha_registro TEXT DEFAULT (date('now'))`); } catch (_) {}
try { db.exec(`ALTER TABLE autos ADD COLUMN fecha_publicacion TEXT DEFAULT (date('now'))`); } catch (_) {}

app.get('/api/admin/graficas/categorias', (req, res) => {
  const data = db.prepare(`SELECT categoria as name, COUNT(*) as total FROM autos WHERE estado = 'aprobado' AND categoria IS NOT NULL AND categoria != '' GROUP BY categoria ORDER BY total DESC`).all();
  res.json(data);
});

app.get('/api/admin/graficas/marcas', (req, res) => {
  const data = db.prepare(`SELECT marca as name, COUNT(*) as total FROM autos WHERE marca IS NOT NULL AND marca != '' GROUP BY marca ORDER BY total DESC LIMIT 6`).all();
  res.json(data);
});

app.get('/api/admin/graficas/usuarios-mes', (req, res) => {
  const dias = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dias.push(d.toISOString().split('T')[0]);
  }
  const registros = db.prepare(`SELECT fecha_registro as fecha, COUNT(*) as total FROM usuarios WHERE fecha_registro >= date('now', '-30 days') GROUP BY fecha_registro`).all();
  const mapaRegistros = {};
  for (const r of registros) mapaRegistros[r.fecha] = r.total;
  const data = dias.map(fecha => ({ name: fecha.slice(5), total: mapaRegistros[fecha] || 0 }));
  res.json(data);
});

db.exec(`
  CREATE TABLE IF NOT EXISTS reportes (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_email TEXT NOT NULL,
    titulo       TEXT NOT NULL,
    descripcion  TEXT NOT NULL,
    categoria    TEXT NOT NULL DEFAULT 'general',
    estado       TEXT NOT NULL DEFAULT 'pendiente',
    fecha        TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );
`);

app.post('/api/reportes', (req, res) => {
  const { usuario_email, titulo, descripcion, categoria } = req.body;
  if (!usuario_email || !titulo || !descripcion) return res.status(400).json({ success: false, message: 'Faltan campos' });
  db.prepare(`INSERT INTO reportes (usuario_email, titulo, descripcion, categoria) VALUES (?, ?, ?, ?)`).run(usuario_email, titulo, descripcion, categoria || 'general');
  res.json({ success: true });
});

app.get('/api/admin/reportes', (req, res) => {
  const reportes = db.prepare(`SELECT r.*, u.nombre as usuario_nombre, u.fotoPerfil as usuario_foto, u.rol as usuario_rol FROM reportes r LEFT JOIN usuarios u ON u.email = r.usuario_email ORDER BY r.fecha DESC`).all();
  res.json(reportes);
});

app.get('/api/reportes/mis-reportes', (req, res) => {
  const { email } = req.query;
  res.json(db.prepare('SELECT * FROM reportes WHERE usuario_email = ? ORDER BY fecha DESC').all(email));
});

app.patch('/api/admin/reportes/:id', (req, res) => {
  db.prepare('UPDATE reportes SET estado = ? WHERE id = ?').run(req.body.estado, req.params.id);
  res.json({ success: true });
});

app.delete('/api/admin/reportes/:id', (req, res) => {
  db.prepare('DELETE FROM reportes WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/reportes/stats', (req, res) => {
  res.json({
    total:      db.prepare("SELECT COUNT(*) as t FROM reportes").get().t,
    pendientes: db.prepare("SELECT COUNT(*) as t FROM reportes WHERE estado = 'pendiente'").get().t,
    urgentes:   db.prepare("SELECT COUNT(*) as t FROM reportes WHERE estado = 'urgente'").get().t,
    resueltos:  db.prepare("SELECT COUNT(*) as t FROM reportes WHERE estado = 'resuelto'").get().t,
  });
});

db.exec(`
  CREATE TABLE IF NOT EXISTS mensajes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    de_email    TEXT NOT NULL,
    para_email  TEXT NOT NULL,
    asunto      TEXT NOT NULL,
    cuerpo      TEXT NOT NULL,
    leido       INTEGER NOT NULL DEFAULT 0,
    fecha       TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );
`);

app.post('/api/mensajes', (req, res) => {
  const { de_email, para_email, asunto, cuerpo } = req.body;
  if (!de_email || !para_email || !asunto || !cuerpo) return res.status(400).json({ success: false, message: 'Faltan campos' });
  db.prepare(`INSERT INTO mensajes (de_email, para_email, asunto, cuerpo) VALUES (?, ?, ?, ?)`).run(de_email, para_email, asunto, cuerpo);
  res.json({ success: true });
});

app.get('/api/mensajes/recibidos', (req, res) => {
  const { email } = req.query;
  res.json(db.prepare(`SELECT m.*, u.nombre as de_nombre, u.fotoPerfil as de_foto, u.rol as de_rol FROM mensajes m LEFT JOIN usuarios u ON u.email = m.de_email WHERE m.para_email = ? ORDER BY m.fecha DESC`).all(email));
});

app.get('/api/mensajes/enviados', (req, res) => {
  const { email } = req.query;
  res.json(db.prepare(`SELECT m.*, u.nombre as para_nombre, u.fotoPerfil as para_foto, u.rol as para_rol FROM mensajes m LEFT JOIN usuarios u ON u.email = m.para_email WHERE m.de_email = ? ORDER BY m.fecha DESC`).all(email));
});

app.patch('/api/mensajes/:id/leer', (req, res) => {
  db.prepare('UPDATE mensajes SET leido = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.delete('/api/mensajes/:id', (req, res) => {
  db.prepare('DELETE FROM mensajes WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/mensajes/no-leidos', (req, res) => {
  const { email } = req.query;
  const total = db.prepare('SELECT COUNT(*) as t FROM mensajes WHERE para_email = ? AND leido = 0').get(email).t;
  res.json({ total });
});

app.get('/api/usuarios/lista', (req, res) => {
  const { email } = req.query;
  res.json(db.prepare('SELECT nombre, email, rol FROM usuarios WHERE email != ?').all(email));
});

app.get('/api/autos/verificados', (req, res) => {
  res.json(db.prepare(`SELECT * FROM autos WHERE verificado = 1 AND estado = 'aprobado' ORDER BY id DESC`).all().map(autoConFotos));
});

app.get('/api/autos/:id', (req, res) => {
  const auto = db.prepare('SELECT * FROM autos WHERE id = ?').get(req.params.id);
  if (!auto) return res.status(404).json({ success: false, message: 'Auto no encontrado' });
  const vendedor = db.prepare('SELECT direccion FROM usuarios WHERE email = ?').get(auto.vendedor_email);
  res.json({ success: true, ...autoConFotos(auto), ubicacion_vendedor: vendedor?.direccion || null });
});

app.get('/api/usuario/perfil', (req, res) => {
  const { email } = req.query;
  const user = db.prepare('SELECT id, nombre, email, rol, telefono, direccion, fotoPerfil FROM usuarios WHERE email = ?').get(email);
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  res.json({ success: true, ...user });
});

app.patch('/api/usuario/perfil', (req, res) => {
  const { email, nombre, telefono, direccion, fotoPerfil } = req.body;
  db.prepare('UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ?, fotoPerfil = ? WHERE email = ?').run(nombre, telefono, direccion, fotoPerfil, email);
  res.json({ success: true });
});

app.patch('/api/usuario/password', async (req, res) => {
  const { email, passwordActual, passwordNuevo } = req.body;
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  const esHash = user.password.startsWith('$2');
  const ok = esHash ? await bcrypt.compare(passwordActual, user.password) : user.password === passwordActual;
  if (!ok) return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
  db.prepare('UPDATE usuarios SET password = ? WHERE email = ?').run(await bcrypt.hash(passwordNuevo, 10), email);
  res.json({ success: true });
});

app.delete('/api/usuario/cuenta', (req, res) => {
  db.prepare('DELETE FROM usuarios WHERE email = ?').run(req.body.email);
  res.json({ success: true });
});

try { db.exec(`ALTER TABLE usuarios ADD COLUMN dos_pasos INTEGER DEFAULT 0`); } catch (_) {}

app.post('/api/usuario/2fa/enviar', async (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  try {
    await enviarCodigo(email, user.nombre);
    res.json({ success: true, message: 'Código enviado' });
  } catch (err) {
    console.error('Error enviando correo:', err);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});

app.post('/api/usuario/2fa/verificar', (req, res) => {
  const { email, codigo, activar } = req.body;
  const entrada = codigosTemp.get(email);
  if (!entrada) return res.status(400).json({ success: false, message: 'No hay código pendiente' });
  if (Date.now() > entrada.expira) {
    codigosTemp.delete(email);
    return res.status(400).json({ success: false, message: 'El código expiró, solicita uno nuevo' });
  }
  if (entrada.codigo !== codigo) return res.status(400).json({ success: false, message: 'Código incorrecto' });
  codigosTemp.delete(email);
  db.prepare('UPDATE usuarios SET dos_pasos = ? WHERE email = ?').run(activar ? 1 : 0, email);
  res.json({ success: true });
});

app.get('/api/usuario/2fa/estado', (req, res) => {
  const { email } = req.query;
  const user = db.prepare('SELECT dos_pasos FROM usuarios WHERE email = ?').get(email);
  if (!user) return res.status(404).json({ success: false });
  res.json({ success: true, activado: user.dos_pasos === 1 });
});

app.post('/api/login/2fa', async (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!user) return res.status(404).json({ success: false });
  try {
    await enviarCodigo(email, user.nombre);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});

// Recuperar contraseña
app.post('/api/password/recuperar', async (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!user) return res.status(404).json({ success: false, message: 'No existe una cuenta con ese correo' });
  try {
    await enviarCodigoRecuperacion(email, user.nombre);
    res.json({ success: true });
  } catch (err) {
    console.error('Error enviando correo recuperación:', err);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});

// Verificar código y cambiar contraseña
app.post('/api/password/reset', async (req, res) => {
  const { email, codigo, nuevaPassword } = req.body;
  const entrada = codigosTemp.get(`reset_${email}`);
  if (!entrada) return res.status(400).json({ success: false, message: 'No hay código pendiente' });
  if (Date.now() > entrada.expira) {
    codigosTemp.delete(`reset_${email}`);
    return res.status(400).json({ success: false, message: 'El código expiró' });
  }
  if (entrada.codigo !== codigo) return res.status(400).json({ success: false, message: 'Código incorrecto' });
  codigosTemp.delete(`reset_${email}`);
  const hash = await bcrypt.hash(nuevaPassword, 10);
  db.prepare('UPDATE usuarios SET password = ? WHERE email = ?').run(hash, email);
  res.json({ success: true });
});

app.get('/', (req, res) => res.send('🚀 Servidor JARide con SQLite funcionando'));
app.listen(PORT, () => console.log(`🚀 Servidor listo en puerto ${PORT}`));