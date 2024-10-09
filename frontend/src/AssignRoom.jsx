import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getRooms, assignRoomToPerson } from './api.js'; // Assuming assignRoomToPerson is in api.js

const AssignRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [personName, setPersonName] = useState('');
  const [aadharId, setAadharId] = useState(''); // New state for Aadhar ID
  const [contactNumber, setContactNumber] = useState(''); // New state for Contact Number
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        // Filter out rooms that are assigned
        const freeRooms = response.data.filter(room => !room.customer);
        setRooms(freeRooms);
      } catch (error) {
        setError('Failed to fetch rooms');
      }
    };

    fetchRooms();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRoom || !personName || !aadharId || !contactNumber) {
      setError('Please fill all fields');
      return;
    }

    const customerData = {
      name: personName,
      aadharId: aadharId,
      contactNumber: contactNumber,
    };

    try {
      const response = await assignRoomToPerson(selectedRoom, customerData); // Include customer data
      if (response.data.success) {
        setSuccess('Room assigned successfully');
        setError('');

        // Redirect to the homepage after 1 second
        setTimeout(() => {
          navigate('/');  // Redirect to '/'
        }, 1000);
      } else {
        setError('Failed to assign room');
      }
    } catch (error) {
      setError('Failed to assign room');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)}>Back</button> {/* Back button */}
      <h2>Assign Room to Person</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Room:</label>
          <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Person Name:</label>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />
        </div>
        <div>
          <label>Aadhar ID:</label>
          <input
            type="text"
            value={aadharId}
            onChange={(e) => setAadharId(e.target.value)}
          />
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <button type="submit">Assign Room</button>
      </form>
    </div>
  );
};

export default AssignRoom;
