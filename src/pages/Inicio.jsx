import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Searchbar from '../components/Searchbar'
import FeaturedGrid from '../components/FeaturedGrid'
import Stats from '../components/Stats'
import Footer from '../components/Footer'
import Testimonials from '../components/Testimonials'

function Inicio() {
  return (
    <div>
        <Navbar />
        <Hero />
        <FeaturedGrid />
        <Stats />
        <Testimonials />
        <Footer />

    </div>


  )
}

export default Inicio