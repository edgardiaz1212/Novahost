# Novahost: A Cloud Management Platform

Novahost is a cloud management platform designed to simplify the management of virtualized environments. It supports multiple hypervisors, including vCenter (VMware) and Proxmox, allowing centralized management of virtual machines (VMs) across different platforms from a single interface.

## Core Features

- **Hypervisor Management**
  - Multi-hypervisor support (vCenter and Proxmox)
  - Connection and status monitoring
  - Capacity monitoring (CPU, RAM, disk usage)

- **Virtual Machine Management**
  - VM creation, listing, and detailed information
  - CRUD operations on VMs

- **User and Client Management**
  - User accounts with roles and permissions
  - Client ("Final Users") management

- **Service Management**
  - Predefined service plans/templates
  - Service ordering for UI organization

- **Request Management**
  - Request tracking with ticket numbers and statuses
  - Support for different request types (predefined, custom)

- **Operation Logging**
  - Audit trail for system operations

- **API-Driven**
  - RESTful API for integration and custom UI development

- **Security**
  - JWT authentication
  - Password hashing

## Technology Stack

- Backend: Python, Flask, Flask-SQLAlchemy, Flask-JWT-Extended
- Frontend: React (Create React App)
- Database: Relational database (PostgreSQL or SQLite)
- Virtualization APIs: pyVmomi (vCenter), Proxmoxer (Proxmox)

## Installation and Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- A relational database (PostgreSQL recommended)

### Backend Setup

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone <repository-url>
   cd Novahost
   ```

2. Create and activate a Python virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. Install backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables. Create a `.env` file in the project root with the following variables:

   ```
   FLASK_DEBUG=1
   DATABASE_URL=postgresql://user:password@localhost:5432/novahostdb
   JWT_SECRET_KEY=your_jwt_secret_key
   PORT=3001
   ```

   Adjust `DATABASE_URL` according to your database setup. If not set, the app defaults to a SQLite database.

5. Initialize and migrate the database:

   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. Run the backend server:

   ```bash
   python src/app.py
   ```

   The backend API will be available at `http://localhost:3001/api`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd src/front
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

### Running the Full Application

- Start the backend server as described above.
- Start the frontend React app.
- The frontend communicates with the backend API to provide the full Novahost experience.

## Additional Information

- The backend serves the frontend static files from the `public` directory in production.
- An admin user with email `admin@example.com` and password `administrator` is created automatically on backend startup if it does not exist.
- For API documentation and available endpoints, visit the root URL (`/`) in development mode to see the generated sitemap.

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Flask-SQLAlchemy Documentation](https://flask-sqlalchemy.palletsprojects.com/)
- [pyVmomi Documentation](https://github.com/vmware/pyvmomi)
- [Proxmoxer Documentation](https://github.com/proxmoxer/proxmoxer)

---
This README provides an overview of the Novahost project and detailed installation instructions for both backend and frontend components.
