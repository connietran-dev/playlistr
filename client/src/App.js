import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login/index';
import Home from './pages/Home/index';
import Room from './pages/Room/index';
import About from './pages/About/index';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/room' element={<Room />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
