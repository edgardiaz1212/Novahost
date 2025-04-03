import React, { useState, useEffect, useMemo } from 'react';
import SummarySection from '../component/ReportsPage/SummarySection';
import ReportsSection from '../component/ReportsPage/ReportsSection';
import * as XLSX from 'xlsx';

function ReportsPage({ requests = [], virtualMachines = [], hypervisors = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Memoize requests and virtualMachines
  const memoizedRequests = useMemo(() => requests, [JSON.stringify(requests)]);
  const memoizedVirtualMachines = useMemo(() => virtualMachines, [JSON.stringify(virtualMachines)]);

  useEffect(() => {
    let dataToFilter = [];
    let newHeaders = [];
    switch (selectedCategory) {
      case 'completed':
        dataToFilter = memoizedRequests.filter(req => req.status === "Completado");
        newHeaders = [
          { label: "Ticket#", key: "id" },
          { label: "Cliente", key: "client" },
          { label: "Servicio", key: "service" },
          { label: "Estado", key: "status" },
          { label: "Hypervisor", key: "hypervisor" },
          { label: "Fecha", key: "date" },
        ];
        break;
      case 'failed':
        dataToFilter = memoizedRequests.filter(req => req.status === "Falla");
        newHeaders = [
          { label: "Ticket#", key: "id" },
          { label: "Cliente", key: "client" },
          { label: "Servicio", key: "service" },
          { label: "Estado", key: "status" },
          { label: "Hypervisor", key: "hypervisor" },
          { label: "Fecha", key: "date" },
        ];
        break;
      case 'inProgress':
        dataToFilter = memoizedRequests.filter(req => req.status === "En Proceso");
        newHeaders = [
          { label: "Ticket#", key: "id" },
          { label: "Cliente", key: "client" },
          { label: "Servicio", key: "service" },
          { label: "Estado", key: "status" },
          { label: "Hypervisor", key: "hypervisor" },
          { label: "Fecha", key: "date" },
        ];
        break;
      case 'total':
        dataToFilter = memoizedVirtualMachines;
        newHeaders = [
          { label: "ID", key: "id" },
          { label: "Nombre", key: "name" },
          { label: "CPU", key: "cpu" },
          { label: "RAM", key: "ram" },
          { label: "Disco", key: "disk" },
          { label: "Hypervisor", key: "hypervisor_id" },
        ];
        break;
      default:
        dataToFilter = [...memoizedRequests, ...memoizedVirtualMachines];
        newHeaders = [
          { label: "Ticket#", key: "id" },
          { label: "Cliente", key: "client" },
          { label: "Servicio", key: "service" },
          { label: "Estado", key: "status" },
          { label: "Hypervisor", key: "hypervisor" },
          { label: "Fecha", key: "date" },
        ];
        break;
    }
    setFilteredData(dataToFilter);
    setHeaders(newHeaders);
    setCurrentPage(0);
  }, [selectedCategory, memoizedRequests, memoizedVirtualMachines]);

  // Date Range Filtering
  const filteredByDate = useMemo(() => {
    if (!dateRange.start || !dateRange.end) {
      return filteredData;
    }
    return filteredData.filter(item => {
      if (!item.date) return false; // Skip items without a date
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [filteredData, dateRange]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleStartDateChange = (event) => {
    setDateRange({ ...dateRange, start: event.target.value });
  };

  const handleEndDateChange = (event) => {
    setDateRange({ ...dateRange, end: event.target.value });
  };

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredByDate.length / itemsPerPage);
  const currentItems = filteredByDate.slice(offset, offset + itemsPerPage);

  // Helper functions for Excel generation
  const generateExcel = (data, headers, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename);
  };

  const downloadVMsByHypervisor = () => {
    const vmCountsByHypervisor = virtualMachines.reduce((acc, vm) => {
      const hypervisor = hypervisors.find(h => h.id === vm.hypervisor_id);
      const hypervisorName = hypervisor ? hypervisor.name : 'N/A';
      acc[hypervisorName] = (acc[hypervisorName] || 0) + 1;
      return acc;
    }, {});

    const data = Object.entries(vmCountsByHypervisor).map(([hypervisor, count]) => ({
      Hypervisor: hypervisor,
      "Cantidad de VMs": count,
    }));
    generateExcel(data, ["Hypervisor", "Cantidad de VMs"], "VMs_por_Hypervisor.xlsx");
  };

  const downloadClientVMs = () => {
    const data = virtualMachines.map(vm => ({
      ID: vm.id,
      Nombre: vm.name,
      Cliente: vm.client || 'N/A', // Assuming there's a client field
      Hypervisor: hypervisors.find(h => h.id === vm.hypervisor_id)?.name || 'N/A',
    }));
    generateExcel(data, ["ID", "Nombre", "Cliente", "Hypervisor"], "VMs_de_Clientes.xlsx");
  };

  const downloadVMsThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const data = virtualMachines.filter(vm => new Date(vm.created_at).getMonth() === currentMonth).map(vm => ({
      ID: vm.id,
      Nombre: vm.name,
      Creada: new Date(vm.created_at).toLocaleString(),
    }));
    generateExcel(data, ["ID", "Nombre", "Creada"], "VMs_Mes_Actual.xlsx");
  };

  const downloadVMsThisYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const data = virtualMachines.filter(vm => new Date(vm.created_at).getFullYear() === currentYear).map(vm => ({
      ID: vm.id,
      Nombre: vm.name,
      Creada: new Date(vm.created_at).toLocaleString(),
    }));
    generateExcel(data, ["ID", "Nombre", "Creada"], "VMs_Año_Actual.xlsx");
  };

  const downloadAllVMs = () => {
    const data = virtualMachines.map(vm => ({
      ID: vm.id,
      Nombre: vm.name,
      CPU: vm.cpu,
      RAM: vm.ram,
      Disco: vm.disk,
      Hypervisor: hypervisors.find(h => h.id === vm.hypervisor_id)?.name || 'N/A',
      Creada: new Date(vm.created_at).toLocaleString(),
    }));
    generateExcel(data, ["ID", "Nombre", "CPU", "RAM", "Disco", "Hypervisor", "Creada"], "Todas_las_VMs.xlsx");
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-4">
        <h1 className="h3 mb-4 p-3 border-start border-5 border-primary">Reportes y Resúmenes</h1>
        <SummarySection
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          dateRange={dateRange}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          headers={headers}
          currentItems={currentItems}
          hypervisors={hypervisors}
          pageCount={pageCount}
          handlePageClick={handlePageClick}
        />
        <ReportsSection
          downloadVMsByHypervisor={downloadVMsByHypervisor}
          downloadClientVMs={downloadClientVMs}
          downloadVMsThisMonth={downloadVMsThisMonth}
          downloadVMsThisYear={downloadVMsThisYear}
          downloadAllVMs={downloadAllVMs}
        />
      </div>
    </div>
  );
}

export default ReportsPage;
