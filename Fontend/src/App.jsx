import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './Pages/UserPages/Home';
import Register from './Pages/UserPages/Register'
import Login from './Pages/UserPages/Login'
import UserDashboard from './Pages/UserPages/UserDashboard';
import Profile from './Pages/UserPages/Profile';
import Navbar from './Components/Navbar';
import ChangePassword from './Pages/UserPages/ChangePassword';

function App() {

  return (
    <>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/user-dashboard' element={<UserDashboard />} />
          <Route path='/user-profile' element={<Profile />} />
          <Route path='/change-user-password' element={<ChangePassword />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
