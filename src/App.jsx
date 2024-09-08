import React from 'react'
import "./App.css"
import "./slider.css"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './Pages/Home'
import RemovePage from './Pages/RemovePage'
import "./banner.css"

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/remove' element={<RemovePage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
