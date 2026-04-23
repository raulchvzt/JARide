import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import CrearCuenta from './pages/CrearCuenta'
import Vender from './pages/Vender'

function App() {

  return (
    <Routes>
    <Route path='/' element={<Inicio />} />
    <Route path='/login' element={<Login />} />
    <Route path='/crearcuenta' element={<CrearCuenta />} />
    <Route path='/vender' element={<Vender />} />
    </Routes>
  )
}

export default App
