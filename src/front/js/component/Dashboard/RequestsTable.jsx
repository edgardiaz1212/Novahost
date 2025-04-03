import React, { useState, useEffect, useMemo } from 'react';
import { Filter } from 'lucide-react';

function RequestsTable({ virtualMachines = [] }) {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([
    { label: "ID", key: "id" },
    { label: "Nombre", key: "nombre_maquina" },
    { label: "IP", key: "ip" },
    { label: "Plataforma", key: "platform" },
    { label: "Estado", key: "status" },
    { label: "Creada", key: "created_at" },
  ]);

  // Memoize the virtualMachines data to prevent unnecessary re-renders
  const memoizedVirtualMachines = useMemo(() => virtualMachines, [JSON.stringify(virtualMachines)]);

  useEffect(() => {
    let dataToFilter = [];
    if (selectedMonth === 'all') {
      dataToFilter = memoizedVirtualMachines;
    } else {
      dataToFilter = memoizedVirtualMachines.filter(vm => {
        const creationDate = new Date(vm.created_at);
        const creationMonth = creationDate.getMonth() + 1; // Month is 0-indexed
        return creationMonth === parseInt(selectedMonth);
      });
    }
    setFilteredData(dataToFilter);
  }, [selectedMonth, memoizedVirtualMachines]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const getMonthOptions = () => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const uniqueMonths = new Set();
    memoizedVirtualMachines.forEach(vm => {
      const creationDate = new Date(vm.created_at);
      uniqueMonths.add(creationDate.getMonth() + 1);
    });

    return Array.from(uniqueMonths).sort((a, b) => a - b).map(monthNumber => (
      <option key={monthNumber} value={monthNumber}>
        {months[monthNumber - 1]}
      </option>
    ));
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-4">
        <h1 className="h3 mb-4 p-3 border-start border-5 border-primary">Máquinas Virtuales</h1>

        <div className="mb-3">
          <div className="d-flex gap-3 align-items-center">
            <Filter size={16} />
            <label htmlFor="monthFilter" className="form-label">Filtrar por Mes:</label>
            <select id="monthFilter" className="form-select" onChange={handleMonthChange} value={selectedMonth}>
              <option value="all">Todos</option>
              {getMonthOptions()}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                {headers.map((header) => (
                  <th key={header.key} scope="col">{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  {headers.map((header) => {
                    let value = item[header.key];
                    if (header.key === 'created_at') {
                      value = new Date(value).toLocaleString();
                    }
                    return <td key={`${item.id}-${header.key}`}>{value}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RequestsTable;
