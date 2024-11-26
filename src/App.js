import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Home from './pages/home';
import MaquinasEmUso from './components/MaquinasEmUso';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar /> {/* sidebar fixa */}
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} /> {/* page inicial */}
            <Route path="/maquinas-em-uso" element={<MaquinasEmUso />} /> {/* page maquinas em uso */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
