# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
Novahost: A Cloud Management Platform

At its core, Novahost is designed to be a cloud management platform. It's built to simplify the process of managing virtualized environments, whether you're dealing with a single hypervisor or a complex multi-hypervisor setup. Here's a breakdown of its key aspects:

Core Functionality

Hypervisor Management:

Multi-Hypervisor Support: Novahost isn't tied to a single virtualization technology. It's built to work with multiple hypervisor types, specifically vCenter (VMware) and Proxmox. This means you can manage VMs across different platforms from a single interface.
Connection and Status Monitoring: It can connect to your hypervisors, check their connection status, and keep track of their overall health.
Capacity Monitoring: It can gather information about the capacity of your hypervisors, such as CPU, RAM, and disk usage. This helps you understand resource availability.
Virtual Machine (VM) Management:

VM Creation: You can create new virtual machines on your hypervisors through Novahost.
VM Listing: It provides a centralized view of all your VMs, regardless of which hypervisor they reside on.
VM Details: You can get detailed information about each VM, including its name, power state, guest operating system, IP address, CPU count, and memory.
VM CRUD Operations: It supports basic operations like creating, reading, updating, and deleting VMs.
User and Client Management:

User Accounts: Novahost allows you to create and manage user accounts, each with their own roles and permissions.
Client Management: It has a system for managing "Final Users" or clients, which are likely the end customers who will be using the virtualized resources.
Service Management:

Predefined Plans: You can create "PreDefinedPlans," which are essentially service templates. These templates define the resources (RAM, disk, processor) that will be allocated to a VM.
Service Ordering: It allows you to define the order in which services are displayed, which is useful for organizing them in a user interface.
Request Management:

Request Tracking: Novahost uses a "Request" system to track actions like VM creation. Each request has a ticket number, status, and other relevant details.
Request Types: It supports different types of requests, such as "predefined" (using a service template) or "no_catalog" (custom VM specifications).
Operation Logging:

Audit Trail: It keeps a log of operations performed within the system, such as VM creation, deletion, and other actions. This is important for auditing and troubleshooting.
API-Driven:

RESTful API: Novahost is built as a RESTful API, meaning it's designed to be accessed programmatically. This makes it easy to integrate with other systems or build custom user interfaces on top of it.
Security:

JWT Authentication: It uses JSON Web Tokens (JWT) for authentication, which is a standard way to secure APIs.
Password Hashing: It stores user passwords securely using hashing.
Technical Details

Python/Flask: The backend is built using Python and the Flask web framework.
SQLAlchemy: It uses SQLAlchemy as an Object-Relational Mapper (ORM) to interact with the database.
pyVmomi/Proxmoxer: It uses the pyVmomi library to interact with vCenter and the Proxmoxer library to interact with Proxmox.
Database: It uses a relational database (likely PostgreSQL or MySQL, based on common Flask setups).
In Essence

Novahost is a platform that aims to:

Centralize: Provide a single point of control for managing multiple hypervisors and VMs.
Simplify: Make it easier to create, manage, and monitor virtualized resources.
Automate: Automate tasks like VM creation and resource allocation.
Secure: Secure access to the platform and protect sensitive data.
Extend: Be extensible through its API, allowing for integration with other systems