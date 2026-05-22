import { Routes, Route, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // 1. Importamos SweetAlert2
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import VentanaComprar from './pages/VentanaComprar';
import CrearCuenta from './pages/CrearCuenta';
import Vender from './pages/Vender';
import Verificados from './pages/Verificados';
import AdminDashboard from './pages/admin/AdminDashboard';
import DetallesCompra from './pages/DetallesCompra';
import Finanzas from './pages/Finanzas';
import Perfil from './pages/Perfil';
import Mensajes from './pages/Mensajes';
import CrearReporte from './pages/CrearReportes';

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
      <Route path='/login' element={<Login />} />
      <Route path='/crearcuenta' element={<CrearCuenta />} />
      <Route path='/comprar' element={<VentanaComprar />} />
      <Route path="/auto/:id" element={<DetallesCompra />} />
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
            <Vender />
          </RutaProtegidaVendedor>
        } 
      />
      <Route 
        path='/admin' 
        element={
          <RutaProtegidaAdmin>
            <AdminDashboard />
          </RutaProtegidaAdmin>
        } 
      />
      
      {/* Redirección por si escriben una ruta que no existe */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;