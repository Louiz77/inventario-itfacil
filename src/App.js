import React from 'react';
import Sidebar from './components/sidebar';
import Home from './pages/home';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Home />
    </div>
  );
}

export default App;
