import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VerificadosComp from '../components/VerificadosComp';

export default function Verificados() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <main className="pt-20 md:pt-32">
        <VerificadosComp />
      </main>

      <Footer />
    </div>
  );
}