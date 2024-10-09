import React, { useEffect, useState } from 'react';
import { getRooms, deleteRoom } from './api'; // Import the API functions
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showAssigned, setShowAssigned] = useState(false); // State to toggle between assigned and non-assigned rooms
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerDetails, setShowCustomerDetails] = useState({}); // Track which room has customer details shown
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      console.log(response.data);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleDelete = async (roomId) => {
    try {
      await deleteRoom(roomId);
      fetchRooms(); // Refresh the room list
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const filteredRooms = rooms.filter(room => 
    (showAssigned ? room.customer : !room.customer) && // Check based on showAssigned
    (room.id.toString().includes(searchTerm) || 
    room.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleCustomerDetails = (roomId) => {
    setShowCustomerDetails(prev => ({
      ...prev,
      [roomId]: !prev[roomId], // Toggle visibility for specific room
    }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Rooms</h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ backgroundColor: '#2196F3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
        >
          Home
        </button>
        <button 
          onClick={() => navigate('/add-room')} 
          style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
        >
          Add Room
        </button>
        <button 
          onClick={() => setShowAssigned(!showAssigned)} // Toggle assigned state
          style={{ backgroundColor: '#FFC107', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
        >
          {showAssigned ? 'Show Free Rooms' : 'Show Assigned Rooms'}
        </button>
        <input 
          type="text" 
          placeholder="Search by Room ID or Type" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ padding: '10px', width: '100%', maxWidth: '400px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Room ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Room Type</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <React.Fragment key={room.id}>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{room.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{room.type}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button 
                      onClick={() => navigate(`/edit-room/${room.id}`)} 
                      style={{ backgroundColor: '#008CBA', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(room.id)} 
                      style={{ backgroundColor: '#f44336', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                    {room.customer && ( // Show button only for assigned rooms
                      <button 
                        onClick={() => toggleCustomerDetails(room.id)} 
                        style={{ backgroundColor: '#FFC107', color: 'black', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}
                      >
                        {showCustomerDetails[room.id] ? 'Hide Details' : 'Show Details'}
                      </button>
                    )}
                  </td>
                </tr>
                {showCustomerDetails[room.id] && room.customer && ( // Show customer details if room is assigned
                  <>
                    <tr>
                      <td colSpan="3" style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                        <strong>Customer Details:</strong><br />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Name: <b>{room.customer.name}</b><br />
                      </td>
                      <td>
                        Aadhar ID: <b>{room.customer.aadharId}</b><br />
                      </td>
                      <td>
                        Contact: <b>{room.customer.contactNumber}</b>
                      </td>
                    </tr>
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rooms;
