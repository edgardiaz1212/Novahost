import React, { useEffect, useState } from 'react';

const ServiceDetails = ({ match }) => {
    const [service, setService] = useState(null);
    const serviceId = match.params.id; // Assuming you're using React Router

    useEffect(() => {
        fetch(`/api/services/${serviceId}`) // Adjust the endpoint as necessary
            .then(response => response.json())
            .then(data => setService(data))
            .catch(error => console.error('Error fetching service details:', error));
    }, [serviceId]);

    if (!service) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            <p>Price: {service.price}</p>
        </div>
    );
};

export default ServiceDetails;
