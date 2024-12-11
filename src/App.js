import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Home from './pages/home';
import MaquinasEmUso from './components/MaquinasEmUso';
import MachineBackup from './components/MaquinaBackup';
import MaquinasManutencao from './components/MaquinaManutencao';
import { fetchMachines } from './api';
import MaquinasItfacil from './components/MaquinasItfacil';

function App() {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    const response = await fetchMachines();
    setMachines(response.data);
  };

  return (
    <Router>
      <div className="app-layout">
        <Sidebar /> {/* sidebar fixa */}
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} /> {/* page inicial */}
            <Route path="/maquinas-em-uso" element={<MaquinasEmUso                    
              machines={machines}/>} /> {/* page maquinas em uso */}
            <Route path="/backup" element={<MachineBackup                    
              machines={machines}/>} /> {/* page maquinas de backup */}
            <Route path="/manutencao" element={<MaquinasManutencao                    
              machines={machines}/>} /> {/* page maquinas em manutencao */}
            <Route path="/itfacil" element={<MaquinasItfacil                    
              machines={machines}/>} /> {/* page maquinas da itfacil*/}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
