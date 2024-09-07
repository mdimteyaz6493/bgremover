import React from 'react'
import ImageEditor from './Components/ImageEditor'
import FilterButtons from './Components/FilterButtons'
import "./App.css"
import Remove from './Components/Remove'
import Navbar from './Components/Navbar'
import Banner from './Components/Banner'
import "./slider.css"

const App = () => {
  return (
    <>
     <Navbar/>
     <Banner/>
     <Remove/>
    </>
  )
}

export default App
