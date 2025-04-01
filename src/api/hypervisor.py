# c:\Users\AdminLocal\Documents\Github\proyectonovahost\Novahost\src\api\hypervisors.py

from pyVim import connect
from pyVmomi import vim
from proxmoxer import ProxmoxAPI
from api.models import Hypervisor
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
