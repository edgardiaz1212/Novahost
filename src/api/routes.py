"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, FinalUser, PreDefinedPlans, RequestNoCatalog, RequestPreDefinedPlans, VirtualMachines 
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/add-user', methods=['POST'])
def add_user():
    data = request.get_json()
    user = User(email=data['email'], 
                password=data['password']
                userName=data['userName']
                telephone=data['telephone']
                role=data['role']         
                )
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 200

@api.routes('edit-user', methods=['PUT'])
def edit_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    user.userName = data['userName']
    user.telephone = data['telephone']
    user.role = data['role']
    db.session.commit()
    return jsonify({"msg": "User edited successfully"}), 200
    