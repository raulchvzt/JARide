import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import VentanaComprar from './pages/VentanaComprar'
import CrearCuenta from './pages/CrearCuenta'
import DetallesCompra from './pages/DetallesCompra'
import Finanzas from './pages/Finanzas'


function App() {

  return (
    <Routes>
    <Route path='/login' element={<Login />} />
    <Route path='/comprar' element={<VentanaComprar />} />
    <Route path='/' element={<Inicio />} />
    <Route path='/crearcuenta' element={<CrearCuenta />} />
    <Route path='/comprar' element={<VentanaComprar />} />
    <Route path="/auto/:id" element={<DetallesCompra />} />
    <Route path='/finanzas' element={<Finanzas />} />

    </Routes>
  )
}

export default App