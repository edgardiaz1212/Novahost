import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Import useLocation
import { Context } from '../store/appContext';
import RequestsTable from '../component/Dashboard/RequestsTable.jsx';
import VirtualMachinesTable from '../component/Details/VirtualMachinesTable.jsx';

function Details() {
  const { store } = useContext(Context);
  const { category } = useParams();
  const location = useLocation(); // Get location object
  const { color } = location.state || {}; // Get color from state, default to empty object if not present
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    switch (category) {
      case 'completed':
        setData(store.requests.filter(req => req.status === "Completado"));
        setTitle('Solicitudes Completadas');
        break;
      case 'failed':
        setData(store.requests.filter(req => req.status === "Falla"));
        setTitle('Solicitudes Fallidas');
        break;
      case 'inProgress':
        setData(store.requests.filter(req => req.status === "En Proceso"));
        setTitle('Solicitudes En Proceso');
        break;
      case 'total':
        setData(store.virtualMachines);
        setTitle('Total de Máquinas Virtuales');
        break;
      default:
        setData([]);
        setTitle('Detalles');
    }
  }, [category, store.requests, store.virtualMachines]);

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-4">
        <h1 className={`h3 mb-4 p-3 ${color ? `border-start border-5 ${color}` : ''}`}>{title}</h1> {/* Apply color to h1 */}
        {category === 'total' ? (
          <VirtualMachinesTable virtualMachines={data} />
        ) : (
          <RequestsTable requests={data} hypervisors={store.hypervisors} />
        )}
      </div>
    </div>
  );
}

export default Details;
