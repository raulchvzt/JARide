import { Routes, Route, Navigate } from 'react-router-dom' // Añadimos Navigate aquí
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import VentanaComprar from './pages/VentanaComprar'
import CrearCuenta from './pages/CrearCuenta'
import Vender from './pages/Vender'
import Verificados from './pages/Verificados'
import AdminDashboard from './pages/admin/AdminDashboard'
import DetallesCompra from './pages/DetallesCompra'
import Finanzas from './pages/Finanzas'
import Perfil from './pages/Perfil'
import Mensajes from './pages/Mensajes'


  // COMPONENTE DE PROTECCIÓN PARA VENDEDORES
  const RutaProtegidaVendedor = ({ children }) => {
    const rol = localStorage.getItem('usuarioRol');
    const estaLogueado = localStorage.getItem('estaAutenticado') === 'true';

    if (!estaLogueado || (rol !== 'vendedor' && rol !== 'admin')) {
      alert("Acceso denegado. Esta sección es exclusiva para Vendedores y Administradores.");
      return <Navigate to="/" />;
    }
    
    return children;
  };

  // COMPONENTE DE PROTECCIÓN PARA ADMIN
  const RutaProtegidaAdmin = ({ children }) => {
    const rol = localStorage.getItem('usuarioRol');
    const estaLogueado = localStorage.getItem('estaAutenticado') === 'true';

    if (!estaLogueado || rol !== 'admin') {
      alert("Acceso denegado. Esta sección es exclusiva para Administradores.");
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
  )
}

export default App