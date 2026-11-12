<div align="center">

# JARide

### Marketplace de vehículos seminuevos, curado y seguro

Compra y vende autos verificados desde el navegador: explora el catálogo, calcula tu financiamiento al instante y habla directo con el vendedor.

<br>

[![Demo en vivo](https://img.shields.io/badge/🚀_Ver_demo_en_vivo-ja--ride.vercel.app-f1c98a?style=for-the-badge&labelColor=111111)](https://ja-ride.vercel.app)

<br>

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)

<br>

<img src="docs/capturas/inicio.png" alt="Página de inicio de JARide" width="100%">

</div>

<br>

## 📑 Contenido

| | | |
|---|---|---|
| [💡 La idea](#-la-idea) | [✨ Funcionalidades](#-funcionalidades) | [📸 Recorrido](#-recorrido-por-la-plataforma) |
| [🧭 Arquitectura](#-arquitectura) | [🛡️ Seguridad](#️-seguridad) | [🧰 Tecnologías](#-tecnologías) |
| [📁 Estructura](#-estructura-del-proyecto) | [🚀 Cómo ejecutarlo](#-cómo-ejecutarlo) | [👥 Equipo](#-equipo) |

<br>

## 💡 La idea

Comprar un auto usado en línea suele significar anuncios sin revisar, información incompleta y poca confianza en el vendedor. **JARide** propone un marketplace con selección editorial: cada publicación pasa por revisión antes de aparecer en el catálogo.

| Problema | Cómo lo resuelve JARide |
|---|---|
| 🚩 Anuncios falsos o poco confiables | Cada auto pasa por **revisión del administrador** y existe un catálogo de **autos verificados** |
| 💸 No sabes si te alcanza | **Simulador de financiamiento** con planes, enganche y plazo ajustables |
| 📞 Contactar al vendedor es complicado | **Mensajería interna** y contacto directo por WhatsApp |
| 📍 No sabes dónde está el auto | **Mapa con la ubicación** del vendedor en cada publicación |

> Proyecto presentado en **Innovatec 2026** · Tecnológico Nacional de México, Campus Colima.

<br>

## ✨ Funcionalidades

<table>
<tr>
<td width="50%" valign="top">

### 🛒 Compradores
- Catálogo con búsqueda y filtros por categoría
- Ficha de cada auto con galería de fotos
- Ubicación del vendedor en el mapa
- Pago mensual estimado en cada publicación
- Simulador de financiamiento
- Favoritos y botón para compartir
- Mensajes con el vendedor y contacto por WhatsApp
- Reporte de publicaciones sospechosas

</td>
<td width="50%" valign="top">

### 🏷️ Vendedores
- Publicación guiada en dos pasos: fotos y datos
- Carga de fotos a la nube (Cloudinary)
- Autocompletado de direcciones en México (OpenStreetMap)
- Perfil con sus autos publicados
- Edición de datos, contraseña y eliminación de cuenta

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🛠️ Administración
- Panel con métricas: autos publicados, usuarios y pendientes
- Gráficas por categoría, marca y usuarios por mes
- Moderación: aprobar o rechazar publicaciones
- Gestión de usuarios, vehículos, reportes y mensajes
- Exportación de autos y usuarios

</td>
<td width="50%" valign="top">

### 🔐 Cuentas
- Registro e inicio de sesión con correo o **Google**
- **Verificación en dos pasos** con código por correo
- Recuperación de contraseña por correo
- Roles: comprador, vendedor y administrador

</td>
</tr>
</table>

<br>

## 📸 Recorrido por la plataforma

### Inicio

Una portada editorial con colecciones destacadas y testimonios de clientes.

<img src="docs/capturas/inicio2.png" alt="Colecciones destacadas" width="100%">

<img src="docs/capturas/inicio3.png" alt="Testimonios" width="100%">

### Ficha del vehículo

Galería de fotos, ficha técnica, datos del vendedor, ubicación en el mapa y pago mensual estimado.

<img src="docs/capturas/carro.png" alt="Ficha de un vehículo" width="100%">

### Simulador de financiamiento

Elige el plan (Normal, Premium o Flexible), ajusta el enganche y compara el pago mensual en distintos plazos.

<img src="docs/capturas/financiamiento.png" alt="Simulador de financiamiento" width="100%">

### Publicar un auto

<img src="docs/capturas/vender.png" alt="Formulario para vender un auto" width="100%">

### Panel de administración

<img src="docs/capturas/admin.png" alt="Panel de administración" width="100%">

### Inicio de sesión

<img src="docs/capturas/login.png" alt="Inicio de sesión" width="100%">

<br>

## 🧭 Arquitectura

```mermaid
flowchart LR
    U([👤 Usuario]) --> F

    subgraph Vercel
        F[Frontend<br/>React + Vite]
    end

    subgraph Render
        B[API REST<br/>Node.js + Express]
        D[(PostgreSQL)]
    end

    F -- HTTPS / JSON --> B
    B --> D
    B --> C[☁️ Cloudinary<br/>fotos]
    B --> R[✉️ Resend<br/>correos y 2FA]
    B --> G[🔑 Google OAuth]
    B --> N[📍 Nominatim<br/>direcciones]
```

Frontend y backend viven en este mismo repositorio (**monorepo**) y se despliegan por separado: **Vercel** publica `frontend/` y **Render** publica `backend/`.

<br>

## 🛡️ Seguridad

| Medida | Implementación |
|---|---|
| 🔑 Contraseñas | Cifradas con **bcrypt** |
| 🎫 Sesiones | **JWT** en cookie `httpOnly`, inaccesible desde JavaScript |
| 🧱 CSRF | Token por sesión |
| 🔒 Datos sensibles | Teléfono y dirección cifrados con **AES-256-GCM** |
| 📧 Doble factor | Código de verificación por correo |
| 💉 Inyección SQL | Consultas parametrizadas en PostgreSQL |
| 🗝️ Secretos | Fuera del código, en variables de entorno |

<br>

## 🧰 Tecnologías

| Capa | Herramientas |
|---|---|
| **Frontend** | React 19 · Vite · React Router 7 · Tailwind CSS 4 · Framer Motion · Recharts |
| **Backend** | Node.js · Express 5 · Multer |
| **Base de datos** | PostgreSQL |
| **Autenticación** | JWT · bcrypt · Google OAuth · 2FA por correo |
| **Servicios** | Cloudinary · Resend · Nominatim (OpenStreetMap) |
| **Pruebas** | Vitest · Testing Library |
| **Despliegue** | Vercel · Render |

<br>

## 📁 Estructura del proyecto

```
JARide/
├── frontend/                  # Aplicación React
│   ├── public/autos/          # Fotos del catálogo inicial
│   └── src/
│       ├── components/        # Navbar, VenderForm, Searchbar, admin/…
│       ├── pages/             # Inicio, Comprar, Detalles, Finanzas, Perfil…
│       │   ├── admin/         # Panel de administración
│       │   └── test/          # Pruebas con Vitest
│       └── App.jsx            # Rutas
│
├── backend/                   # API REST
│   ├── server.js              # Rutas, autenticación y conexión a PostgreSQL
│   ├── scripts/               # Utilidades (asignar admin, cargar catálogo)
│   └── .env.example           # Variables de entorno necesarias
│
└── docs/capturas/             # Imágenes de este README
```

<br>

## 🚀 Cómo ejecutarlo

**Requisitos:** [Node.js](https://nodejs.org/) 18+, una base de datos **PostgreSQL** y cuentas en **Cloudinary** y **Resend**.

```bash
# 1. Clonar
git clone https://github.com/raulchvzt/JARide.git
cd JARide

# 2. Backend
cd backend
npm install
cp .env.example .env        # llena los valores
node server.js              # 🚀 Servidor listo en puerto 5000

# 3. Frontend (en otra terminal)
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm run dev                 # http://localhost:5173
```

> Al arrancar, el backend **crea las tablas automáticamente** si no existen.

<details>
<summary><b>Variables de entorno del backend</b></summary>

<br>

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto `5000`) |
| `API_URL` | URL pública del backend |
| `DATABASE_URL` | Cadena de conexión de PostgreSQL |
| `JWT_SECRET` | Clave para firmar los tokens de sesión |
| `ENCRYPTION_KEY` | Clave de 32 caracteres para el cifrado AES-256-GCM |
| `RESEND_API_KEY` | Clave de Resend para enviar correos |
| `EMAIL_USER` / `EMAIL_PASS` | Cuenta de correo del sistema |
| `CLOUDINARY_CLOUD_NAME` | Nombre de tu cuenta de Cloudinary |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Credenciales de Cloudinary |

</details>

<details>
<summary><b>Pruebas</b></summary>

<br>

El frontend incluye pruebas con **Vitest** y **Testing Library** para el inicio de sesión, la publicación de autos y la ventana de compra.

```bash
cd frontend
npm test
```

</details>

<details>
<summary><b>Despliegue</b></summary>

<br>

| Parte | Plataforma | Carpeta |
|---|---|---|
| Frontend | Vercel | `frontend/` |
| Backend | Render (Web Service) | `backend/` |
| Base de datos | Render (PostgreSQL) | — |

El backend usa el plan gratuito de Render, así que puede tardar unos segundos en responder la primera vez si estuvo inactivo.

</details>

<br>

## 👥 Equipo

| Integrante | Rol |
|---|---|
| **Raúl Alejandro Chávez Torres** · [@raulchvzt](https://github.com/raulchvzt) | Desarrollo full stack: frontend, API REST, base de datos, autenticación y despliegue |
| **Belinda Cárdenas** · [@usuario](https://github.com/belipop-123) | Desarrollo frontend |

<br>

---

<div align="center">

Hecho con ☕ en Colima, México · Proyecto académico sin fines comerciales

</div>
