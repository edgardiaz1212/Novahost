from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import LargeBinary
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telephone = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(120), nullable=False)
    _password = db.Column(db.String(120), nullable=False)  # Changed to _password

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
        "userName": self.UserName,
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
    nombre_plan = db.Column(db.String(80), nullable=False)
    ram = db.Column(db.String(120), nullable=False)
    hdd = db.Column(db.String(120), nullable=False)
    processor = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    # Relationship with RequestPreDefinedPlans
    requests = db.relationship('RequestPreDefinedPlans', backref='plan', lazy=True)

    serialize = lambda self: {
        "id": self.id,
        "nombre_plan": self.nombre_plan,
        "ram": self.ram,
        "hdd": self.hdd,
        "processor": self.processor,
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

    serialize = lambda self: {
        "id": self.id,
        "nombre_maquina": self.nombre_maquina,
        "ip": self.ip,
        "platform": self.platform,
        "status": self.status,
        "request_id": self.request_id,
        "request_no_catalog_id": self.request_no_catalog_id,
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
