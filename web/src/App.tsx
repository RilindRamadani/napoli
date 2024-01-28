import React from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login'; // Import the Login component
import Kitchen from './pages/kitchen';
import Pizza from './pages/pizza';
import Banaku from './pages/banaku';
import Produktet from './pages/produktet';
import "./styles/app.css";

function App() {
  return (
    <BrowserRouter>

      <div className='nav-bar'>
        <Link to="/kitchen" className='nav-buttons' >
          Kitchen
        </Link>
        <Link to="/banaku" className='nav-buttons'>
          Banaku
        </Link>
        <Link to="/pizza" className='nav-buttons'>
          Pizza
        </Link>
        <Link to="/produktet" className='nav-buttons'>
          Products
        </Link>
      </div>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/kitchen" Component={Kitchen} />
        <Route path="/pizza" Component={Pizza} />
        <Route path="/banaku" Component={Banaku} />
        <Route path="/produktet" Component={Produktet} />
        {/* Add more routes here */}
        <Route
          path="*"
          element={<Navigate to="/kitchen" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
