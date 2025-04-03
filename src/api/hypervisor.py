# c:\Users\AdminLocal\Documents\Github\proyectonovahost\Novahost\src\api\hypervisors.py

from pyVim import connect
from pyVmomi import vim
from proxmoxer import ProxmoxAPI
from api.models import Hypervisor, db
import atexit

class HypervisorManager:
    def __init__(self, hypervisor_id):
        hypervisor = Hypervisor.query.get(hypervisor_id)
        if not hypervisor:
            raise ValueError("Hypervisor not found")
        self.hypervisor = hypervisor
        self.connection = None

    def connect(self):
        if self.hypervisor.type == 'vcenter':
            self.connection = self._connect_vcenter()
        elif self.hypervisor.type == 'proxmox':
            self.connection = self._connect_proxmox()
        else:
            raise ValueError("Invalid hypervisor type")
        return self.connection

    def disconnect(self):
        if self.connection:
            if self.hypervisor.type == 'vcenter':
                connect.Disconnect(self.connection)
            elif self.hypervisor.type == 'proxmox':
                self.connection.logout()
            self.connection = None

    def _connect_vcenter(self):
        try:
            si = connect.SmartConnect(
                host=self.hypervisor.hostname,
                user=self.hypervisor.username,
                pwd=self.hypervisor.password,
                port=int(self.hypervisor.port)
            )
            if not si:
                raise Exception("Failed to connect to vCenter")
            atexit.register(connect.Disconnect, si)
            return si
        except Exception as e:
            raise Exception(f"Failed to connect to vCenter: {e}")

    def _connect_proxmox(self):
        try:
            proxmox = ProxmoxAPI(
                host=self.hypervisor.hostname,
                user=self.hypervisor.username,
                password=self.hypervisor.password,
                port=int(self.hypervisor.port),
                verify_ssl=False
            )
            return proxmox
        except Exception as e:
            raise Exception(f"Failed to connect to Proxmox: {e}")

    def get_vms(self):
        if not self.connection:
            raise Exception("Not connected to hypervisor")
        if self.hypervisor.type == 'vcenter':
            return self._get_vms_vcenter()
        elif self.hypervisor.type == 'proxmox':
            return self._get_vms_proxmox()
        else:
            raise ValueError("Invalid hypervisor type")

    def _get_vms_vcenter(self):
        content = self.connection.RetrieveContent()
        container = content.rootFolder  # starting point to look into
        viewType = [vim.VirtualMachine]  # object types to look for
        recursive = True  # whether we should look into it recursively
        containerView = content.viewManager.CreateContainerView(
            container, viewType, recursive)
        children = containerView.view
        vms = []
        for child in children:
            vms.append({
                "name": child.name,
                "power_state": child.runtime.powerState,
                "guest_os": child.guest.guestFullName if child.guest else "N/A",
                "ip_address": child.guest.ipAddress if child.guest and child.guest.ipAddress else "N/A",
                "cpu_count": child.config.hardware.numCPU,
                "memory_mb": child.config.hardware.memoryMB,
            })
        return vms

    def _get_vms_proxmox(self):
        nodes = self.connection.nodes.get()
        vms = []
        for node in nodes:
            node_name = node['node']
            vms_node = self.connection.nodes(node_name).qemu.get()
            for vm in vms_node:
                vms.append({
                    "name": vm['name'],
                    "power_state": vm['status'],
                    "guest_os": vm.get('os', 'N/A'),
                    "ip_address": vm.get('net0', {}).get('ip', 'N/A'),
                    "cpu_count": vm['cpus'],
                    "memory_mb": vm['maxmem'] / 1024 / 1024,
                })
        return vms
    
    def create_vm(self, vm_spec):
        # Actualizar el estado de creación a "in_progress"
        vm = VirtualMachines.query.get(vm_spec['vm_id'])
        vm.creation_status = "in_progress"
        db.session.commit()

        try:
            if self.hypervisor.type == 'vcenter':
                result = self._create_vm_vcenter(vm_spec)
            elif self.hypervisor.type == 'proxmox':
                result = self._create_vm_proxmox(vm_spec)
            else:
                raise ValueError("Invalid hypervisor type")

            # Actualizar el estado de creación a "completed"
            vm.creation_status = "completed"
            db.session.commit()
            return result
        except Exception as e:
            # Actualizar el estado de creación a "failed"
            vm.creation_status = "failed"
            db.session.commit()
            raise Exception(f"Failed to create VM: {e}")

    def _create_vm_vcenter(self, vm_spec):
        # Implementación para crear una VM en vCenter
        try:
            # Aquí usarías las APIs de pyVmomi para crear la VM
            # Ejemplo: Crear especificaciones de hardware, red, etc.
            return {"status": "success", "message": "VM created in vCenter"}
        except Exception as e:
            raise Exception(f"Failed to create VM in vCenter: {e}")

    def _create_vm_proxmox(self, vm_spec):
        # Implementación para crear una VM en Proxmox
        try:
            # Aquí usarías las APIs de Proxmox para crear la VM
            # Ejemplo: Crear especificaciones de hardware, red, etc.
            return {"status": "success", "message": "VM created in Proxmox"}
        except Exception as e:
            raise Exception(f"Failed to create VM in Proxmox: {e}")
    
    def get_capacity(self):
        if not self.connection:
            raise Exception("Not connected to hypervisor")
        if self.hypervisor.type == 'vcenter':
            return self._get_capacity_vcenter()
        elif self.hypervisor.type == 'proxmox':
            return self._get_capacity_proxmox()
        else:
            raise ValueError("Invalid hypervisor type")

    def _get_capacity_vcenter(self):
        # Implementación para obtener capacidad en vCenter
        try:
            # Ejemplo: Obtener datos de recursos del clúster
            return {
                "cpu_total": 100,
                "cpu_used": 50,
                "ram_total": 256,
                "ram_used": 128,
                "disk_total": 1024,
                "disk_used": 512,
            }
        except Exception as e:
            raise Exception(f"Failed to get capacity from vCenter: {e}")

    def _get_capacity_proxmox(self):
        # Implementación para obtener capacidad en Proxmox
        try:
            # Ejemplo: Obtener datos de recursos del nodo
            return {
                "cpu_total": 80,
                "cpu_used": 40,
                "ram_total": 128,
                "ram_used": 64,
                "disk_total": 512,
                "disk_used": 256,
            }
        except Exception as e:
            raise Exception(f"Failed to get capacity from Proxmox: {e}")
    
    def check_connection(self):
        try:
            self.connect()
            self.disconnect()
            return "connected"
        except Exception as e:
            print(f"Error checking connection to {self.hypervisor.name}: {e}")
            return "error"
