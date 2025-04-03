"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, FinalUser, PreDefinedPlans, Request, VirtualMachines, Hypervisor
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from api.hypervisor import HypervisorManager


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
    services = PreDefinedPlans.query.order_by(PreDefinedPlans.order).all() # Order by the 'order' field
    services_list = [service.serialize() for service in services]
    return jsonify(services_list), 200

# Add a new service
@api.route('/add-service', methods=['POST'])
@jwt_required()
def add_service():
    data = request.get_json()
    # Get the maximum current order and increment it
    max_order = db.session.query(db.func.max(PreDefinedPlans.order)).scalar() or 0
    new_order = max_order + 1
    service = PreDefinedPlans( # Changed to PreDefinedPlans
        name=data['nombre'],
        ram=data['ram'],
        disk=data['disco'],
        processor=data['procesador'],
        order=new_order # Assign the new order
    )
    db.session.add(service)
    db.session.commit()
    return jsonify({"msg": "Service created successfully", "service": service.serialize()}), 200

# update service order
@api.route('/update-service-order', methods=['POST'])
@jwt_required()
def update_service_order():
    data = request.get_json()
    try:
        for item in data:
            service = PreDefinedPlans.query.get(item['id'])
            if service:
                service.order = item['order']
        db.session.commit()
        return jsonify({"msg": "Service order updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating service order: {e}")
        return jsonify({"msg": "Error updating service order"}), 500

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
# **Gestion de Hypervisores**
# Get all hypervisors
@api.route('/hypervisors', methods=['GET'])
@jwt_required()
def get_hypervisors():
    hypervisors = Hypervisor.query.all()
    hypervisors_list = [hypervisor.serialize() for hypervisor in hypervisors]
    return jsonify(hypervisors_list), 200

# Add a new hypervisor
@api.route('/add-hypervisor', methods=['POST'])
@jwt_required()
def add_hypervisor():
    data = request.get_json()
    hypervisor = Hypervisor(
        name=data['name'],
        type=data['type'],
        hostname=data['hostname'],
        port=data['port'],
        username=data['username'],
        password=data['password']
    )
    db.session.add(hypervisor)
    db.session.commit()
    return jsonify({"msg": "Hypervisor created successfully", "hypervisor": hypervisor.serialize()}), 201

# Update an existing hypervisor
@api.route('/edit-hypervisor/<int:hypervisor_id>', methods=['PUT'])
@jwt_required()
def edit_hypervisor(hypervisor_id):
    data = request.get_json()
    hypervisor = Hypervisor.query.get(hypervisor_id)
    if not hypervisor:
        return jsonify({"msg": "Hypervisor not found"}), 404
    hypervisor.name = data.get('name', hypervisor.name)
    hypervisor.type = data.get('type', hypervisor.type)
    hypervisor.hostname = data.get('hostname', hypervisor.hostname)
    hypervisor.port = data.get('port', hypervisor.port)
    hypervisor.username = data.get('username', hypervisor.username)
    if 'password' in data and data['password'] != "":
        hypervisor.password = data['password']
    db.session.commit()
    return jsonify({"msg": "Hypervisor updated successfully", "hypervisor": hypervisor.serialize()}), 200

# Delete a hypervisor
@api.route('/delete-hypervisor/<int:hypervisor_id>', methods=['DELETE'])
@jwt_required()
def delete_hypervisor(hypervisor_id):
    hypervisor = Hypervisor.query.get(hypervisor_id)
    if not hypervisor:
        return jsonify({"msg": "Hypervisor not found"}), 404
    db.session.delete(hypervisor)
    db.session.commit()
    return jsonify({"msg": "Hypervisor deleted successfully"}), 200

# Hypervisor Capacity
@api.route('/hypervisor/<int:hypervisor_id>/capacity', methods=['GET'])
@jwt_required()
def get_hypervisor_capacity(hypervisor_id):
    try:
        manager = HypervisorManager(hypervisor_id)
        manager.connect()
        capacity = manager.get_capacity()
        manager.disconnect()
        return jsonify(capacity), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# Get VMs from a hypervisor
@api.route('/hypervisor/<int:hypervisor_id>/vms', methods=['GET'])
@jwt_required()
def get_hypervisor_vms(hypervisor_id):
    hypervisor = Hypervisor.query.get(hypervisor_id)
    if not hypervisor:
        return jsonify({"msg": "Hypervisor not found"}), 404
    try:
        manager = HypervisorManager(hypervisor_id)
        manager.connect()
        vms = manager.get_vms()
        manager.disconnect()
        return jsonify(vms), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

#***Gestion maquinas virtuales conectadas a hypervisor***
@api.route('/create-vm', methods=['POST'])
@jwt_required()
def create_vm():
    data = request.get_json()
    hypervisor_id = data.get('hypervisor_id')
    vm_spec = data.get('vm_spec')

    try:
        manager = HypervisorManager(hypervisor_id)
        manager.connect()
        result = manager.create_vm(vm_spec)
        manager.disconnect()
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    




#**Gestion Maquinas Virtuales listado eliminar...**
# Get all VMs
@api.route('/virtual-machines', methods=['GET'])
def get_virtual_machines():
    vms = VirtualMachines.query.all()
    vms_list = [vm.serialize() for vm in vms]
    return jsonify(vms_list), 200

# Add a new VM
@api.route('/add-virtual-machine', methods=['POST'])
@jwt_required()
def add_virtual_machine():
    data = request.get_json()
    vm = VirtualMachines(
        nombre_maquina=data['nombre'],
        ip=data['direccion'],
        platform=data['plataforma'],
        status=data['estado']
    )
    db.session.add(vm)
    db.session.commit()
    return jsonify({"msg": "VM created successfully", "vm": vm.serialize()}), 201

# Update an existing VM
@api.route('/edit-virtual-machine/<int:vm_id>', methods=['PUT'])
@jwt_required()
def edit_virtual_machine(vm_id):
    data = request.get_json()
    vm = VirtualMachines.query.get(vm_id)
    if not vm:
        return jsonify({"msg": "VM not found"}), 404
    vm.nombre_maquina = data.get('nombre', vm.nombre_maquina)
    vm.ip = data.get('direccion', vm.ip)
    vm.platform = data.get('plataforma', vm.platform)
    vm.status = data.get('estado', vm.status)
    db.session.commit()
    return jsonify({"msg": "VM updated successfully", "vm": vm.serialize()}), 200

# Delete a VM
@api.route('/delete-virtual-machine/<int:vm_id>', methods=['DELETE'])
@jwt_required()
def delete_virtual_machine(vm_id):
    vm = VirtualMachines.query.get(vm_id)
    if not vm:
        return jsonify({"msg": "VM not found"}), 404
    db.session.delete(vm)
    db.session.commit()
    return jsonify({"msg": "VM deleted successfully"}), 200
