import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import HomePage from './front/js/pages/Home.jsx';
import ServiceDetails from './front/js/pages/ServiceDetails.js'; // Import ServiceDetails
import ServiceForm from './front/js/pages/ServiceForm.js'; // Import ServiceForm
import injectContext from './front/js/store/appContext'; // Import injectContext
import Dahsboard from './front/js/pages/Dahsboard.jsx';

const App = () => {
    return (
        <Router>
            <Routes> {/* Use Routes instead of Switch */}
                <Route path="/" element={<HomePage />} /> {/* Use element prop */}
                <Route path="/dashboard" element={<Dahsboard />} /> {/* Route for dashboard */}
                <Route path="/services/:id" element={<ServiceDetails />} /> 
                <Route path="/services/create" element={<ServiceForm />} /> {/* Route for creating a service */}
                <Route path="/services/edit/:id" element={<ServiceForm />} /> {/* Route for editing a service */}
            </Routes>
        </Router>
    );
};

export default injectContext(App); // Wrap App with injectContext
