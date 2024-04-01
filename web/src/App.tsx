import React from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Produktet from './pages/produktet';
import "./styles/app.css";
import Salla from './pages/salla';


import { generateCssVariables } from './common/colors';

// Call the function to generate CSS variables
const cssVariables = generateCssVariables();

// Inject CSS variables into the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = `:root { ${cssVariables} }`;
document.head.appendChild(styleElement);

function App() {
  return (
    <BrowserRouter>

      <div className='nav-bar'>
        <Link to="/salla" className='nav-buttons'>
          Salla
        </Link>
        <Link to="/produktet" className='nav-buttons'>
          Products
        </Link>
      </div>
      <div className='content'>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/salla" Component={Salla} />
          <Route path="/produktet" Component={Produktet} />
          {/* Add more routes here */}
          <Route
            path="*"
            element={<Navigate to="/salla" replace />}
          />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
