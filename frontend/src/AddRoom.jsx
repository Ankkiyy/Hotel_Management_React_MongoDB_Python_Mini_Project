import React, { useState, useEffect } from 'react';
import { createRoom, updateRoom, getRoomById } from './api';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const AddRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Disable button after submit
  const { id } = useParams(); // Get the room ID from URL parameters
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    if (id) {
      const fetchRoom = async () => {
        try {
          const response = await getRoomById(id);
          if (response.data) {
            setRoomName(response.data.name);
            setRoomType(response.data.type);
          } else {
            setError('Room not found');
          }
        } catch (error) {
          setError('Failed to fetch room details');
        }
      };

      fetchRoom();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button after submit

    if (!roomName || !roomType) {
      setError('Room name and type are required');
      setIsSubmitting(false); // Enable button if error
      return;
    }

    try {
      if (id) {
        // Update existing room
        await updateRoom(id, { name: roomName, type: roomType });
        setSuccess('Room updated successfully');
      } else {
        // Create new room
        const roomId = Date.now(); // Unique ID based on current timestamp
        await createRoom({ id: roomId, name: roomName, type: roomType });
        setSuccess('Room created successfully');
      }
      setError('');

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError('Failed to save room');
    } finally {
      setIsSubmitting(false); // Re-enable button regardless of success or error
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div style={{ display: 'flex', gap: "16px", alignItems: "center" }}>
        <button onClick={() => navigate(-1)}> &lt;  Back</button> 
        <h2>{id ? 'Edit Room' : 'Create Room'}</h2>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Name:</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={isSubmitting} // Disable input if submitting
          />
        </div>

        <div>
          <label>Room Type:</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            disabled={isSubmitting} // Disable select if submitting
          >
            <option value="">Select Type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        <button type="submit" disabled={isSubmitting}> 
          {id ? 'Update Room' : 'Create Room'}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
