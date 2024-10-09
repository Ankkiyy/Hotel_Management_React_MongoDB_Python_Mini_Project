import axios from 'axios';

// Set up the base URL for your Flask backend
const API_URL = 'http://localhost:4000';

// Employee Registration
export const registerEmployee = (employeeData) => axios.post(`${API_URL}/register`, employeeData);

// Employee Login
export const loginEmployee = (loginData) => axios.post(`${API_URL}/login`, loginData);

// Get all rooms
export const getRooms = () => axios.get(`${API_URL}/rooms`);

// Create a new room
export const createRoom = (roomData) => axios.post(`${API_URL}/rooms`, roomData);

// Update a room by ID
export const updateRoom = (roomId, updatedData) => axios.put(`${API_URL}/rooms/${roomId}`, updatedData);

// Delete a room by ID
export const deleteRoom = (roomId) => axios.delete(`${API_URL}/rooms/${roomId}`);

export const getRoomById = (roomId) => axios.get(`${API_URL}/rooms/${roomId}`);

// Assign a room to a person
// Assign a room to a person
export const assignRoomToPerson = (roomId, personData) =>
    axios.post(`${API_URL}/rooms/${roomId}/assign`, personData);


