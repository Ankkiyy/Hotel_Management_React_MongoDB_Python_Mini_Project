# venv\Scripts\activate
# python server.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client.hotel  # Changed to hotel management

# Routes for Room management CRUD

# Create a new room
@app.route('/rooms', methods=['POST'])
def create_room():
    try:
        room_data = request.get_json()
        db.rooms.insert_one(room_data)
        return jsonify({'success': True, 'message': 'Room created successfully'}), 201
    except Exception as e:
        print("Error: ", e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/rooms/', methods=['GET'])
@app.route('/rooms/<int:id>', methods=['GET'])
def get_rooms(id=None):
    try:
        if id is not None:
            room = db.rooms.find_one({'id': id}, {"_id": 0})  # Fetch room by ID as an integer
            if room:
                return jsonify(room), 200
            else:
                return jsonify({'success': False, 'error': 'Room not found'}), 404
        else:
            rooms = list(db.rooms.find({}, {"_id": 0}))  # Fetch all rooms excluding _id field
            return jsonify(rooms), 200
    except Exception as e:
        print("Error: ", e)
        return jsonify({'success': False, 'error': str(e)}), 500



# Update a room by room_id
@app.route('/rooms/<int:id>', methods=['PUT'])  # Ensure ID is handled as an int
def update_room(id):
    try:
        updated_data = request.get_json()
        result = db.rooms.update_one({'id': id}, {'$set': updated_data})
        
        if result.matched_count > 0:  # Check if any document was matched and updated
            return jsonify({'success': True, 'message': 'Room updated successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'Room not found'}), 404
    except Exception as e:
        print("Error: ", e)
        return jsonify({'success': False, 'error': str(e)}), 500


# Delete a room by room_id
@app.route('/rooms/<int:id>', methods=['DELETE'])
def delete_room(id):
    try:
        room = db.rooms.find_one({'id': id})  # Fetch the room first
        if room:
            if 'customer' in room:  # Check if the room is occupied
                # Move the room data to the orders collection for history
                order_data = {
                    'id': room['id'],
                    'name': room['name'],
                    'type': room['type'],
                    'customer': room['customer'],  # Include customer data for history
                    # Add any other fields you want to retain in the orders collection
                }
                db.orders.insert_one(order_data)  # Insert the room data into the orders collection
                
                # Update the room to set it as unoccupied
                db.rooms.update_one(
                    {'id': id},
                    {'$unset': {'customer': "", 'assigned': ""}}  # Remove customer data and assigned key
                )
                return jsonify({'success': True, 'message': 'Room updated to unoccupied state'}), 200
            else:
                # If the room is unoccupied, delete it from the rooms collection
                db.rooms.delete_one({'id': id})
                return jsonify({'success': True, 'message': 'Room deleted successfully'}), 200
        else:
            return jsonify({'success': False, 'error': 'Room not found'}), 404
    except Exception as e:
        print("Error: ", e)
        return jsonify({'success': False, 'error': str(e)}), 500


# User registration route
@app.route('/register', methods=['POST'])
def register_user():
    try:
        user_data = request.get_json()
        if not all(key in user_data for key in ['firstName', 'lastName', 'email', 'password']):
            return jsonify({'success': False, 'message': 'Missing required data'}), 400
        db.users.insert_one(user_data)
        return jsonify({'success': True, 'message': 'Registration successful'}), 201
    except Exception as e:
        print("Error: ", e)
        return jsonify({'success': False, 'error': str(e)}), 500

# Assign a room to a customer
@app.route('/rooms/<int:room_id>/assign', methods=['POST'])
def assign_room(room_id):
    try:
        person_data = request.get_json()  # Get customer data from request
        room = db.rooms.find_one({'id': room_id})

        if room and not room.get('assigned', False):
            # Update the room to include the assigned flag and customer data
            db.rooms.update_one(
                {'id': room_id},
                {'$set': {
                    'assigned': True,
                    'customer': person_data  # Store customer data inside the room
                }}
            )
            return jsonify({'success': True, 'message': f'Room {room_id} assigned successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'Room not available or already assigned'}), 400
    except Exception as e:
        print("Error: ", e)
        return jsonify({'success': False, 'error': str(e)}), 500



# User login route
@app.route('/login', methods=['POST'])
def login_user():
    try:
        login_data = request.get_json()
        print(login_data)
        user = db.users.find_one({'email': login_data['email'], 'password': login_data['password']}, {'_id': 0})
        if user:
            is_admin = user.get('admin', False)
            response_data = {
                'success': True,
                'message': 'Login successful',
                'user': {
                    'firstName': user.get('firstName', ''),
                    'lastName': user.get('lastName', ''),
                    'email': user['email'],
                    'admin': user.get('admin', False),
                }
            }
            return jsonify(response_data), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    except Exception as e:
        print("Error: ", e)
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=4000)
