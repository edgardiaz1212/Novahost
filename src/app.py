"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, Users
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, get_jwt, jwt_required # Import jwt_required
from datetime import timedelta


# Load environment variables
load_dotenv()

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)

# Configure JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

# Initialize JWTManager
jwt = JWTManager(app)

# Token blacklist loader
blacklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in blacklist

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200


# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    full_path = os.path.join(static_file_dir, path)
    if os.path.isfile(full_path):
        # If the file exists, serve it directly
        response = send_from_directory(static_file_dir, path)
        response.cache_control.max_age = 0  # avoid cache memory
        return response
    else:
        # If the file doesn't exist, serve index.html (SPA routing)
        response = send_from_directory(static_file_dir, 'index.html')
        response.cache_control.max_age = 0
        return response

# Function to create the admin user
def create_admin_user(app):
    with app.app_context():
        admin_user = Users.query.filter_by(email="admin@example.com").first()
        if not admin_user:
            admin_user = Users(
                userName="Admin",
                email="admin@example.com",
                password="administrator",
                telephone="0000000000",
                role="admin"
            )
            db.session.add(admin_user)
            db.session.commit()
            print("Admin user created successfully.")
        else:
            print("Admin user already exists.")

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    # Create the admin user
    create_admin_user(app)
    app.run(host='0.0.0.0', port=PORT, debug=True)