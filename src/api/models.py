from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import Enum
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telephone = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(120), nullable=False)
    _password = db.Column(db.String, nullable=False)  # Changed to _password

    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.password = kwargs.get('password')

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        self._password = generate_password_hash(value)

    def check_password(self, value):
        return check_password_hash(self._password, value)

    serialize = lambda self: {
        "id": self.id,
        "userName": self.userName,
        "email": self.email,
        "telephone": self.telephone,
        "created_at": self.created_at,
        "updated_at": self.updated_at,
        "role": self.role
    }

class FinalUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    razon_social = db.Column(db.String(80), nullable=False)
    rif = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    # Relationship with RequestPreDefinedPlans
    requests = db.relationship('RequestPreDefinedPlans', backref='client', lazy=True)
    requests_no_catalog = db.relationship('RequestNoCatalog', backref='client', lazy=True)

    serialize = lambda self: {
        "id": self.id,
        "razon_social": self.razon_social,
        "rif": self.rif,
        "created_at": self.created_at,
        "updated_at": self.updated_at
    }

class PreDefinedPlans(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name  = db.Column(db.String(80), nullable=False)
    ram = db.Column(db.String(120), nullable=False)
    disk = db.Column(db.String(120), nullable=False)
    processor = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    # Relationship with RequestPreDefinedPlans
    requests = db.relationship('RequestPreDefinedPlans', backref='plan', lazy=True)

    serialize = lambda self: {
        "id": self.id,
        "nombre": self.name ,
        "ram": self.ram,
        "disco": self.disk,
        "procesador": self.processor,
        "created_at": self.created_at,
        "updated_at": self.updated_at
    }

class VirtualMachines(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre_maquina = db.Column(db.String(80), nullable=False)
    ip = db.Column(db.String(120), nullable=False)
    platform = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(120), nullable=False)
    # Relationship with RequestPreDefinedPlans
    request_id = db.Column(db.Integer, db.ForeignKey('request_pre_defined_plans.id'), nullable=True)
    request_no_catalog_id = db.Column(db.Integer, db.ForeignKey('request_no_catalog.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    # New fields for external VMs
    hypervisor_id = db.Column(db.Integer, db.ForeignKey('hypervisor.id'), nullable=True)  # Foreign key to Hypervisor
    external_vm_id = db.Column(db.String(255), nullable=True)  # Unique ID from vCenter/Proxmox
    external_vm_name = db.Column(db.String(255), nullable=True)  # Name from vCenter/Proxmox
    external_vm_power_state = db.Column(db.String(50), nullable=True)  # Power state from vCenter/Proxmox
    external_vm_guest_os = db.Column(db.String(255), nullable=True)  # Guest OS from vCenter/Proxmox
    external_vm_ip_address = db.Column(db.String(120), nullable=True)  # IP address from vCenter/Proxmox
    external_vm_cpu_count = db.Column(db.Integer, nullable=True)  # CPU count from vCenter/Proxmox
    external_vm_memory_mb = db.Column(db.Integer, nullable=True)  # Memory in MB from vCenter/Proxmox

    serialize = lambda self: {
        "id": self.id,
        "nombre_maquina": self.nombre_maquina,
        "ip": self.ip,
        "platform": self.platform,
        "status": self.status,
        "request_id": self.request_id,
        "request_no_catalog_id": self.request_no_catalog_id,
        "created_at": self.created_at,
        "updated_at": self.updated_at,
        "hypervisor_id": self.hypervisor_id,
        "external_vm_id": self.external_vm_id,
        "external_vm_name": self.external_vm_name,
        "external_vm_power_state": self.external_vm_power_state,
        "external_vm_guest_os": self.external_vm_guest_os,
        "external_vm_ip_address": self.external_vm_ip_address,
        "external_vm_cpu_count": self.external_vm_cpu_count,
        "external_vm_memory_mb": self.external_vm_memory_mb,
    }
class Hypervisor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    type = db.Column(Enum('vcenter', 'proxmox', name='hypervisor_type'), nullable=False)  # vcenter or proxmox
    hostname = db.Column(db.String(120), nullable=False)
    port = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    # Relationship with VirtualMachines
    vms = db.relationship('VirtualMachines', backref='hypervisor', lazy=True)

    serialize = lambda self: {
        "id": self.id,
        "name": self.name,
        "type": self.type,
        "hostname": self.hostname,
        "port": self.port,
        "username": self.username,
        "password": self.password,
        "created_at": self.created_at,
        "updated_at": self.updated_at
    }

class RequestPreDefinedPlans(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(120), nullable=False)
    # Foreign keys
    plan_id = db.Column(db.Integer, db.ForeignKey('pre_defined_plans.id'), nullable=True)
    client_id = db.Column(db.Integer, db.ForeignKey('final_user.id'), nullable=True)
    # New fields from ServiceSelector
    selected_os = db.Column(db.String(80), nullable=True)
    custom_os = db.Column(db.String(80), nullable=True)
    network = db.Column(db.String(80), nullable=True)
    network_adapter = db.Column(db.String(80), nullable=True)
    os_credentials_user = db.Column(db.String(80), nullable=True)
    os_credentials_password = db.Column(db.String(80), nullable=True)
    ssh_keys = db.Column(db.Text, nullable=True)
    resource_group = db.Column(db.String(80), nullable=True)
    storage = db.Column(db.String(80), nullable=True)
    template_or_iso = db.Column(db.String(80), nullable=True)
    # vCenter specific
    disk_type = db.Column(db.String(80), nullable=True)
    storage_policy = db.Column(db.String(80), nullable=True)
    guest_os_customization = db.Column(db.String(80), nullable=True)
    high_availability = db.Column(db.Boolean, nullable=True)
    drs = db.Column(db.String(80), nullable=True)
    snapshot_policy = db.Column(db.String(80), nullable=True)
    # Proxmox specific
    vm_type = db.Column(db.String(80), nullable=True)
    disk_format = db.Column(db.String(80), nullable=True)
    bios_or_uefi = db.Column(db.String(80), nullable=True)
    cloud_init = db.Column(db.String(80), nullable=True)
    numa = db.Column(db.String(80), nullable=True)
    backup_schedule = db.Column(db.String(80), nullable=True)
    hotplug = db.Column(db.Boolean, nullable=True)
    # Relationship with VirtualMachines
    vm = db.relationship('VirtualMachines', backref='request', uselist=False, lazy=True)

    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    serialize = lambda self: {
        "id": self.id,
        "status": self.status,
        "plan_id": self.plan_id,
        "client_id": self.client_id,
        "selected_os": self.selected_os,
        "custom_os": self.custom_os,
        "network": self.network,
        "network_adapter": self.network_adapter,
        "os_credentials_user": self.os_credentials_user,
        "os_credentials_password": self.os_credentials_password,
        "ssh_keys": self.ssh_keys,
        "resource_group": self.resource_group,
        "storage": self.storage,
        "template_or_iso": self.template_or_iso,
        "disk_type": self.disk_type,
        "storage_policy": self.storage_policy,
        "guest_os_customization": self.guest_os_customization,
        "high_availability": self.high_availability,
        "drs": self.drs,
        "snapshot_policy": self.snapshot_policy,
        "vm_type": self.vm_type,
        "disk_format": self.disk_format,
        "bios_or_uefi": self.bios_or_uefi,
        "cloud_init": self.cloud_init,
        "numa": self.numa,
        "backup_schedule": self.backup_schedule,
        "hotplug": self.hotplug,
        "created_at": self.created_at,
        "updated_at": self.updated_at
    }

class RequestNoCatalog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(120), nullable=False)
    # Foreign keys
    client_id = db.Column(db.Integer, db.ForeignKey('final_user.id'), nullable=True)
    # New fields from ServiceSelector
    selected_os = db.Column(db.String(80), nullable=True)
    custom_os = db.Column(db.String(80), nullable=True)
    ram = db.Column(db.String(80), nullable=True)
    disk = db.Column(db.String(80), nullable=True)
    processors = db.Column(db.String(80), nullable=True)
    network = db.Column(db.String(80), nullable=True)
    network_adapter = db.Column(db.String(80), nullable=True)
    os_credentials_user = db.Column(db.String(80), nullable=True)
    os_credentials_password = db.Column(db.String(80), nullable=True)
    ssh_keys = db.Column(db.Text, nullable=True)
    resource_group = db.Column(db.String(80), nullable=True)
    storage = db.Column(db.String(80), nullable=True)
    template_or_iso = db.Column(db.String(80), nullable=True)
    # vCenter specific
    disk_type = db.Column(db.String(80), nullable=True)
    storage_policy = db.Column(db.String(80), nullable=True)
    guest_os_customization = db.Column(db.String(80), nullable=True)
    high_availability = db.Column(db.Boolean, nullable=True)
    drs = db.Column(db.String(80), nullable=True)
    snapshot_policy = db.Column(db.String(80), nullable=True)
    # Proxmox specific
    vm_type = db.Column(db.String(80), nullable=True)
    disk_format = db.Column(db.String(80), nullable=True)
    bios_or_uefi = db.Column(db.String(80), nullable=True)
    cloud_init = db.Column(db.String(80), nullable=True)
    numa = db.Column(db.String(80), nullable=True)
    backup_schedule = db.Column(db.String(80), nullable=True)
    hotplug = db.Column(db.Boolean, nullable=True)
    # Relationship with VirtualMachines
    vm = db.relationship('VirtualMachines', backref='request_no_catalog', uselist=False, lazy=True)

    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    serialize = lambda self: {
        "id": self.id,
        "status": self.status,
        "client_id": self.client_id,
        "selected_os": self.selected_os,
        "custom_os": self.custom_os,
        "ram": self.ram,
        "disk": self.disk,
        "processors": self.processors,
        "network": self.network,
        "network_adapter": self.network_adapter,
        "os_credentials_user": self.os_credentials_user,
        "os_credentials_password": self.os_credentials_password,
        "ssh_keys": self.ssh_keys,
        "resource_group": self.resource_group,
        "storage": self.storage,
        "template_or_iso": self.template_or_iso,
        "disk_type": self.disk_type,
        "storage_policy": self.storage_policy,
        "guest_os_customization": self.guest_os_customization,
        "high_availability": self.high_availability,
        "drs": self.drs,
        "snapshot_policy": self.snapshot_policy,
        "vm_type": self.vm_type,
        "disk_format": self.disk_format,
        "bios_or_uefi": self.bios_or_uefi,
        "cloud_init": self.cloud_init,
        "numa": self.numa,
        "backup_schedule": self.backup_schedule,
        "hotplug": self.hotplug,
        "created_at": self.created_at,
        "updated_at": self.updated_at
    }
class OperationLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    operation_type = db.Column(db.String(50), nullable=False)  # create, delete, sync, etc.
    hypervisor_id = db.Column(db.Integer, db.ForeignKey('hypervisor.id'), nullable=True)
    vm_id = db.Column(db.Integer, db.ForeignKey('virtual_machines.id'), nullable=True)
    request_id = db.Column(db.Integer, nullable=True)
    request_type = db.Column(db.String(20), nullable=True)  # catalog, no_catalog
    status = db.Column(db.String(20), nullable=False)  # success, error
    message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))