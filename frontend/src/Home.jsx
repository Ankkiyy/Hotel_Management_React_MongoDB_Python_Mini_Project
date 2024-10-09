import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from './auth'; // Ensure auth functions are imported

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from auth
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h1 style={{ fontSize: '3em', color: '#4CAF50' }}>Welcome to the Hotel Management System</h1>
      {isAuthenticated() ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => navigate('/rooms')} 
            style={{ padding: '15px 30px', fontSize: '1.2em', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            View Rooms
          </button>
          <button 
            onClick={() => navigate('/add-room')} 
            style={{ padding: '15px 30px', fontSize: '1.2em', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Add Room
          </button>
          <button 
            onClick={() => navigate('/assign-room')} 
            style={{ padding: '15px 30px', fontSize: '1.2em', backgroundColor: '#FF9800', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Assign Room
          </button>
          <button 
            onClick={handleLogout} 
            style={{ padding: '15px 30px', fontSize: '1.2em', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => navigate('/login')} 
            style={{ padding: '15px 30px', fontSize: '1.2em', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')} 
            style={{ padding: '15px 30px', fontSize: '1.2em', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
