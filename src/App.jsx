import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import CrearCuenta from './pages/CrearCuenta'

function App() {

  return (
    <Routes>
    <Route path='/' element={<Inicio />} />
    <Route path='/login' element={<Login />} />
    <Route path='/crearcuenta' element={<CrearCuenta />} />
    </Routes>
  )
}

export default App