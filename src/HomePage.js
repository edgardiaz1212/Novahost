import React, { useEffect, useState } from 'react';

const HomePage = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch('/api/services') // Adjust the endpoint as necessary
            .then(response => response.json())
            .then(data => setServices(data))
            .catch(error => console.error('Error fetching services:', error));
    }, []);

    return (
        <div>
            <h1>Available Hosting Services</h1>
            <ul>
                {services.map(service => (
                    <li key={service.id}>{service.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
