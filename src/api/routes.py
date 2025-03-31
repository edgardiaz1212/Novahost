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