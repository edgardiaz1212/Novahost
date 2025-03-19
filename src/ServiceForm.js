import React, { useState } from 'react';

const ServiceForm = ({ service }) => {
    const [name, setName] = useState(service ? service.name : '');
    const [description, setDescription] = useState(service ? service.description : '');
    const [price, setPrice] = useState(service ? service.price : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = service ? 'PUT' : 'POST';
        const url = service ? `/api/services/${service.id}` : '/api/services'; // Adjust the endpoint as necessary

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, price }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Service saved:', data);
                // Optionally redirect or update the UI
            })
            .catch(error => console.error('Error saving service:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Service Name"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Service Description"
                required
            />
            <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Service Price"
                required
            />
            <button type="submit">{service ? 'Update' : 'Create'} Service</button>
        </form>
    );
};

export default ServiceForm;
