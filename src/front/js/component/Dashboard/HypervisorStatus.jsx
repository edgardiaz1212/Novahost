import React, { useEffect, useState } from 'react';
import { Server, Cpu, HardDrive, MemoryStick, BarChart } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HypervisorStatus({ hypervisors, isLoading, predefinedPlans }) {
  const [vmCapacityData, setVmCapacityData] = useState([]);
  const [hypervisorCapacities, setHypervisorCapacities] = useState({});

  // Helper function to calculate percentage with error handling
  const calculatePercentage = (used, total) => {
    if (total === 0 || used === undefined || total === undefined) return 0;
    return Math.round((used / total) * 100);
  };

  // Helper function to get progress bar color
  const getProgressBarColor = (percentage) => {
    if (percentage < 50) return 'bg-success';
    if (percentage < 80) return 'bg-warning';
    return 'bg-danger';
  };

  // Helper function to render resource usage
  const renderResourceUsage = (icon, label, used, total) => {
    const percentage = calculatePercentage(used, total);
    return (
      <div className="mb-3">
        <div className="d-flex align-items-center mb-1">
          {icon}
          <span className="fw-bold">{label}:</span>
          <span className="ms-auto">
            {used || 0} / {total || 0} {label === 'RAM' ? 'GB' : label === 'Disco' ? 'GB' : 'Cores'}
          </span>
        </div>
        <div className="progress">
          <div
            className={`progress-bar ${getProgressBarColor(percentage)}`}
            role="progressbar"
            style={{ width: `${percentage}%` }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${label} usage`} // Add ARIA label
          >
            {percentage}%
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!isLoading && hypervisors) {
      fetchHypervisorCapacities();
    }
  }, [hypervisors, isLoading]);

  useEffect(() => {
    console.log("plan",predefinedPlans)
    if (!isLoading && hypervisors && predefinedPlans && Object.keys(hypervisorCapacities).length > 0) {
      calculateVmCapacity();
    }
  }, [hypervisors, predefinedPlans, isLoading, hypervisorCapacities]);

  const fetchHypervisorCapacities = async () => {
    const capacities = {};
    for (const hypervisor of hypervisors) {
      try {
        const response = await fetch(`/api/hypervisor/${hypervisor.id}/capacity`);
        if (!response.ok) {
          throw new Error(`Failed to fetch capacity for ${hypervisor.name}`);
        }
        const data = await response.json();
        capacities[hypervisor.name] = data;
      } catch (error) {
        console.error(error);
      }
    }
    setHypervisorCapacities(capacities);
  };

  const calculateVmCapacity = () => {
    const capacityData = [];

    hypervisors.forEach((hypervisor) => {
      const hypervisorCapacity = {
        name: hypervisor.name,
        capacities: [],
        ram_available: hypervisorCapacities[hypervisor.name]?.ram_total - hypervisorCapacities[hypervisor.name]?.ram_used,
        disk_available: hypervisorCapacities[hypervisor.name]?.disk_total - hypervisorCapacities[hypervisor.name]?.disk_used,
        cpu_available: hypervisorCapacities[hypervisor.name]?.cpu_total - hypervisorCapacities[hypervisor.name]?.cpu_used,
      };

      predefinedPlans.forEach((plan) => {
        const maxVms = calculateMaxVms(hypervisorCapacity, plan);
        hypervisorCapacity.capacities.push({
          planName: plan.nombre,
          maxVms,
        });
      });

      capacityData.push(hypervisorCapacity);
    });

    setVmCapacityData(capacityData);
  };

  const calculateMaxVms = (hypervisor, plan) => {
    const ramRatio = hypervisor.ram_available / parseInt(plan.ram);
    const diskRatio = hypervisor.disk_available / parseInt(plan.disco);
    const processorRatio = hypervisor.cpu_available / parseInt(plan.procesador);

    return Math.floor(Math.min(ramRatio, diskRatio, processorRatio));
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Capacidad de VMs por Plan',
      },
    },
  };

  const getChartData = (hypervisorCapacity) => {
    const labels = hypervisorCapacity.capacities.map((capacity) => capacity.planName);
    const data = hypervisorCapacity.capacities.map((capacity) => capacity.maxVms);

    return {
      labels,
      datasets: [
        {
          label: 'Cantidad de VMs',
          data: data,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
  };

  return (
    <div className="mb-4">
      <h2 className="h4 fw-bold text-gray-800 mb-4 d-flex align-items-center gap-2">
        <BarChart className="w-6 h-6 text-indigo-600" />
        Estado de Hipervisores
      </h2>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
            {hypervisors.map((hypervisor) => (
              <div className="col" key={hypervisor.id || hypervisor.name}>
                {/* Use hypervisor.id if available, otherwise use hypervisor.name */}
                <div className="card shadow-sm">
                  <div className="card-header d-flex align-items-center gap-2">
                    <Server className="text-primary" />
                    <h5 className="mb-0">{hypervisor.name}</h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Tipo:</strong> {hypervisor.type}
                    </p>
                    <p>
                      <strong>Hostname:</strong> {hypervisor.hostname}
                    </p>
                    
                    {/* Render resource usage */}
                    {renderResourceUsage(
                      <Cpu className="text-secondary me-2" size={16} />,
                      'CPU',
                      hypervisorCapacities[hypervisor.name]?.cpu_used,
                      hypervisorCapacities[hypervisor.name]?.cpu_total
                    )}
                    {renderResourceUsage(
                      <MemoryStick className="text-secondary me-2" size={16} />,
                      'RAM',
                      hypervisorCapacities[hypervisor.name]?.ram_used,
                      hypervisorCapacities[hypervisor.name]?.ram_total
                    )}
                    {renderResourceUsage(
                      <HardDrive className="text-secondary me-2" size={16} />,
                      'Disco',
                      hypervisorCapacities[hypervisor.name]?.disk_used,
                      hypervisorCapacities[hypervisor.name]?.disk_total
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {vmCapacityData.map((hypervisorCapacity) => (
            <div key={hypervisorCapacity.name} className="mb-4">
              <h3 className="h5">{hypervisorCapacity.name}</h3>
              <Bar options={chartOptions} data={getChartData(hypervisorCapacity)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HypervisorStatus;
