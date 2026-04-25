import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import VentanaComprar from './pages/VentanaComprar'
import CrearCuenta from './pages/CrearCuenta'
import DetallesCompra from './pages/DetallesCompra'


function App() {

  return (
    <Routes>
    <Route path='/login' element={<Login />} />
    <Route path='/comprar' element={<VentanaComprar />} />
    <Route path='/' element={<Inicio />} />
    <Route path='/crearcuenta' element={<CrearCuenta />} />
    <Route path='/comprar' element={<VentanaComprar />} />
    <Route path="/auto/:id" element={<DetallesCompra />} />

    </Routes>
  )
}

export default App