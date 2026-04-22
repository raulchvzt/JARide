import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import VentanaComprar from './pages/VentanaComprar'

function App() {

  return (
    <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/comprar' element={<VentanaComprar />} />
    </Routes>
  )
}

export default App
