"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, FinalUser, PreDefinedPlans, RequestNoCatalog, RequestPreDefinedPlans, VirtualMachines
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
import atexit

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "token": access_token, 
        "user": user.serialize(),
        "expires_in": 7200  # 2 hours in seconds
    }), 200
##Gestion de usuarios**
# Creation, editing, deletion of user 
@api.route('/add-user', methods=['POST'])
def add_user():
    data = request.get_json()
    user = User(email=data['email'], 
                password=data['password'],
                userName=data['userName'],
                telephone=data['telephone'],
                role=data['role']         
                )
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 200

@api.route('/edit-user', methods=['PUT'])
@jwt_required()
def edit_user():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    user.userName = data['userName']
    user.telephone = data['telephone']
    user.email = data['email']
    if 'password' in data and data['password'] != "":
        user.password = data['password']
    db.session.commit()
    return jsonify({"msg": "User edited successfully", "user": user.serialize()}), 200

@api.route('/edit-user/<int:user_id>', methods=['PUT'])  # New route with user_id
@jwt_required()
def edit_user_by_id(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    user.userName = data.get('userName', user.userName)
    user.telephone = data.get('telephone', user.telephone)
    user.email = data.get('email', user.email)
    user.role = data.get('role', user.role)
    if 'password' in data and data['password'] != "":
        user.password = data['password']
    db.session.commit()
    return jsonify({"msg": "User edited successfully", "user": user.serialize()}), 200

@api.route('/delete-user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting user: {e}")
        return jsonify({"msg": "Error deleting user"}), 500

@api.route('/current-user', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        # Get the current user's ID from the JWT token
        current_user_id = get_jwt_identity()
        
        # Fetch the user from the database
        user = User.query.get(current_user_id) # Remove .first()
        
        # Check if user exists
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        # Return user details, excluding sensitive information
        return jsonify({
            "user": {
                "id": user.id,
                "userName": user.userName,
                "email": user.email,
                "telephone": user.telephone,
                "role": user.role
            }
        }), 200
    
    except Exception as e:
        # Log the error (replace with proper logging in production)
        print(f"Error in protected route: {str(e)}")
        return jsonify({"msg": "Internal server error"}), 500

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [user.serialize() for user in users]
    return jsonify(users_list), 200
# **Gestion de servicios**
# Get all services
@api.route('/services', methods=['GET'])
def get_services():
    services = PreDefinedPlans.query.all() # Changed to PreDefinedPlans
    services_list = [service.serialize() for service in services]
    return jsonify(services_list), 200

# Add a new service
@api.route('/add-service', methods=['POST'])
@jwt_required()
def add_service():
    data = request.get_json()
    service = PreDefinedPlans( # Changed to PreDefinedPlans
        name=data['nombre'],
        ram=data['ram'],
        disk=data['disco'],
        processor=data['procesador']
    )
    db.session.add(service)
    db.session.commit()
    return jsonify({"msg": "Service created successfully", "service": service.serialize()}), 200

# Update an existing service
@api.route('/edit-service/<int:service_id>', methods=['PUT'])
@jwt_required()
def edit_service(service_id):
    data = request.get_json()
    service = PreDefinedPlans.query.get(service_id) # Changed to PreDefinedPlans
    if not service:
        return jsonify({"msg": "Service not found"}), 404
    service.name = data.get('nombre', service.name)
    service.ram = data.get('ram', service.ram)
    service.disk = data.get('disco', service.disk)
    service.processor = data.get('procesador', service.processor)
    db.session.commit()
    return jsonify({"msg": "Service updated successfully", "service": service.serialize()}), 200

# Delete a service
@api.route('/delete-service/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    service = PreDefinedPlans.query.get(service_id) # Changed to PreDefinedPlans
    if not service:
        return jsonify({"msg": "Service not found"}), 404
    db.session.delete(service)
    db.session.commit()
    return jsonify({"msg": "Service deleted successfully"}), 200

#**Gestion de clientes Usuario Final**
# Get all clients
@api.route('/clients', methods=['GET'])
def get_clients():
    clients = FinalUser.query.all()
    clients_list = [client.serialize() for client in clients]
    return jsonify(clients_list), 200

# Add a new client
@api.route('/add-client', methods=['POST'])
@jwt_required()
def add_client():
    data = request.get_json()
    if not data.get('razon_social') or not data.get('rif'):
        return jsonify({"msg": "Razon Social and RIF are required"}), 400
    
    client = FinalUser(
        razon_social=data['razon_social'],
        rif=data['rif']
    )
    db.session.add(client)
    db.session.commit()
    return jsonify({"msg": "Client created successfully", "client": client.serialize()}), 201

# Update an existing client
@api.route('/edit-client/<int:client_id>', methods=['PUT'])
@jwt_required()
def edit_client(client_id):
    data = request.get_json()
    client = FinalUser.query.get(client_id)
    if not client:
        return jsonify({"msg": "Client not found"}), 404
    
    if not data.get('razon_social') or not data.get('rif'):
        return jsonify({"msg": "Razon Social and RIF are required"}), 400
    
    client.razon_social = data.get('razon_social', client.razon_social)
    client.rif = data.get('rif', client.rif)
    db.session.commit()
    return jsonify({"msg": "Client updated successfully", "client": client.serialize()}), 200

# Delete a client
@api.route('/delete-client/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    client = FinalUser.query.get(client_id)
    if not client:
        return jsonify({"msg": "Client not found"}), 404
    db.session.delete(client)
    db.session.commit()
    return jsonify({"msg": "Client deleted successfully"}), 200


