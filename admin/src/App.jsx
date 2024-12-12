import 'react-toastify/dist/ReactToastify.css';
import React, { useContext } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './Pages/Add/Add';
import List from './Pages/List/List';
import Order from './Pages/Order/Order';
import { ToastContainer } from 'react-toastify';
import { StoreContext } from './context/StoreContext';
import Home from './Pages/Home/Home';

const App = () => {
  const { token } = useContext(StoreContext); // Token from context

  return (
    <div className="app">
      <ToastContainer />
      {
        !token
          ? (
            <>
              <div className="rel-admin-div">
                <p className="admin-text top-left">Admin</p>
                <p className="admin-text bottom-right">Panel</p>
              </div>
              <div className="content">
                <Home />
              </div>
            </>
          )
          : (
            <>
              <Navbar />
              <div className="app-content">
                <Sidebar />
                <Routes>
                  <Route path='/' element={<Add />} />
                  <Route path="/add" element={token ? <Add /> : <Navigate to="/" />} />
                  <Route path="/list" element={token ? <List /> : <Navigate to="/" />} />
                  <Route path="/orders" element={token ? <Order /> : <Navigate to="/" />} />
                </Routes>
              </div>
            </>
          )
      }
    </div>
  );
};

export default App;
