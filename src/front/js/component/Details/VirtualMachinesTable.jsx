import React from 'react';

function VirtualMachinesTable({ virtualMachines }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {virtualMachines.map((vm) => (
            <tr key={vm.id}>
              <td>{vm.id}</td>
              <td>{vm.name}</td>
              <td>{vm.status}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VirtualMachinesTable;
