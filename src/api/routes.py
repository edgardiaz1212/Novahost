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

# In-memory set to store revoked tokens (for demonstration purposes)
revoked_tokens = set()

#creacion, edicion, borrado de usuario 
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
def edit_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    user.userName = data['userName']
    user.telephone = data['telephone']
    user.role = data['role']
    db.session.commit()
    return jsonify({"msg": "User edited successfully"}), 200

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user": user.serialize()}), 200

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        print("Logout request received")
        jti = get_jwt()["jti"]
        print(f"JTI: {jti}")
        revoked_tokens.add(jti)
        print(f"Token {jti} revoked")
        return jsonify({"msg": "Logout successful"}), 200
    except Exception as e:
        print(f"Error during logout: {e}")
        return jsonify({"msg": "Error during logout"}), 422

@api.before_request
def check_if_token_revoked():
    try:
        if request.endpoint not in ['api.login', 'api.logout']:
            print("Checking if token is revoked")
            token = request.headers.get('Authorization', '').split(' ')[1]
            print(f"Token: {token}")
            decoded_token = get_jwt()
            print(f"Decoded token: {decoded_token}")
            jti = decoded_token['jti']
            print(f"JTI: {jti}")
            if jti in revoked_tokens:
                print(f"Token {jti} has been revoked")
                return jsonify({"msg": "Token has been revoked"}), 401
    except Exception as e:
        print(f"Error checking token revocation: {e}")
        return jsonify({"msg": "Error checking token revocation"}), 422
    
@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    return jsonify({"msg": "This is a protected route", "user": user.serialize()}), 200

# para verificar recuersos de VM@api.route('/edit-user', methods=['PUT'])
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
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify({"msg": "User edited successfully", "user": user.serialize()}), 200