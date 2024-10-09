import React from 'react'; 
import {  Route, Navigate, Routes  } from 'react-router-dom';
import Rooms from './Rooms.jsx';
import AddRoom from './AddRoom.jsx';
import Login from './Login';
import Register from './Register';
import AssignRoom from './AssignRoom';
import Home from './Home.jsx';
import { isAuthenticated } from './auth'; // Ensure auth function is imported

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected Routes */}
        <Route path="/rooms" element={isAuthenticated() ? <Rooms /> : <Navigate to="/login" />} />
        <Route path="/add-room" element={isAuthenticated() ? <AddRoom /> : <Navigate to="/login" />} />
        <Route path="/assign-room" element={isAuthenticated() ? <AssignRoom /> : <Navigate to="/login" />} />
        <Route path="/edit-room/:id" element={isAuthenticated() ? <AddRoom /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
