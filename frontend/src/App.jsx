import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Swal from 'sweetalert2'; // 1. Importamos SweetAlert2
import Inicio from './pages/Inicio';
import CrearCuenta from './pages/CrearCuenta';
import Verificados from './pages/Verificados';
import Finanzas from './pages/Finanzas';
import Perfil from './pages/Perfil';
import Mensajes from './pages/Mensajes';
import CrearReporte from './pages/CrearReportes';

// Lazy loaded pages (major pages that load on route change)
const Login = lazy(() => import('./pages/Login'));
const VentanaComprar = lazy(() => import('./pages/VentanaComprar'));
const Vender = lazy(() => import('./pages/Vender'));
const DetallesCompra = lazy(() => import('./pages/DetallesCompra'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#f1c98a]/20 border-t-[#f1c98a] rounded-full animate-spin" />
      <p className="text-white/60 text-sm">Cargando...</p>
    </div>
  </div>
);

// COMPONENTE DE PROTECCIÓN PARA VENDEDORES
const RutaProtegidaVendedor = ({ children }) => {
  const rol = sessionStorage.getItem('usuarioRol');
  const estaLogueado = sessionStorage.getItem('estaAutenticado') === 'true';

  if (!estaLogueado || (rol !== 'vendedor' && rol !== 'admin')) {
    // 2. Alerta Premium con diseño oscuro para acceso denegado
    Swal.fire({
      title: 'Acceso Denegado',
      text: 'Esta sección es exclusiva para Vendedores y Administradores.',
      icon: 'error',
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#f1c98a',
      confirmButtonText: 'Entendido',
    });
    return <Navigate to="/" />;
  }
  
  return children;
};

// COMPONENTE DE PROTECCIÓN PARA ADMIN
const RutaProtegidaAdmin = ({ children }) => {
  const rol = sessionStorage.getItem('usuarioRol');
  const estaLogueado = sessionStorage.getItem('estaAutenticado') === 'true';

  if (!estaLogueado || rol !== 'admin') {
    // 3. Alerta Premium con diseño oscuro para el panel de administración
    Swal.fire({
      title: 'Acceso Restringido',
      text: 'Esta sección es exclusiva para Administradores.',
      icon: 'error',
      background: '#111',
      color: '#fff',
      confirmButtonColor: '#f1c98a',
      confirmButtonText: 'Regresar',
    });
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path='/' element={<Inicio />} />
      <Route path='/login' element={<Suspense fallback={<LoadingFallback />}><Login /></Suspense>} />
      <Route path='/crearcuenta' element={<CrearCuenta />} />
      <Route path='/comprar' element={<Suspense fallback={<LoadingFallback />}><VentanaComprar /></Suspense>} />
      <Route path="/auto/:id" element={<Suspense fallback={<LoadingFallback />}><DetallesCompra /></Suspense>} />
      <Route path='/finanzas' element={<Finanzas />} />
      <Route path='/verificados' element={<Verificados />} />
      <Route path='/mensajes' element={<Mensajes />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/reportes" element={<CrearReporte />} />

      {/* RUTAS PROTEGIDAS */}
      <Route
        path='/vender'
        element={
          <RutaProtegidaVendedor>
            <Suspense fallback={<LoadingFallback />}>
              <Vender />
            </Suspense>
          </RutaProtegidaVendedor>
        }
      />
      <Route
        path='/admin'
        element={
          <RutaProtegidaAdmin>
            <Suspense fallback={<LoadingFallback />}>
              <AdminDashboard />
            </Suspense>
          </RutaProtegidaAdmin>
        }
      />

      {/* Redirección por si escriben una ruta que no existe */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;