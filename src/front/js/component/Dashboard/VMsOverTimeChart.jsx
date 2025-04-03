import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function VMsOverTimeChart({ virtualMachines }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (virtualMachines && virtualMachines.length > 0) {
      const vcenterData = {};
      const proxmoxData = {};
      const allDates = new Set();

      virtualMachines.forEach((vm) => {
        const date = new Date(vm.created_at).toLocaleDateString();
        allDates.add(date);

        if (vm.platform === 'vcenter') {
          vcenterData[date] = (vcenterData[date] || 0) + 1;
        } else if (vm.platform === 'proxmox') {
          proxmoxData[date] = (proxmoxData[date] || 0) + 1;
        }
      });

      const sortedDates = Array.from(allDates).sort();

      const vcenterCounts = sortedDates.map((date) => vcenterData[date] || 0);
      const proxmoxCounts = sortedDates.map((date) => proxmoxData[date] || 0);

      setChartData({
        labels: sortedDates,
        datasets: [
          {
            label: 'vCenter',
            data: vcenterCounts,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Proxmox',
            data: proxmoxCounts,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      });
    }
  }, [virtualMachines]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'VMs Creadas por Plataforma a lo largo del Tiempo',
      },
    },
  };

  return (
    <div className="mb-4">
      <Line options={options} data={chartData} />
    </div>
  );
}

export default VMsOverTimeChart;
