import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './front/js/pages/Home.jsx';
import ServiceDetails from './front/js/pages/ServiceDetails.js';
import ServiceForm from './front/js/pages/ServiceForm.js';
import injectContext from './front/js/store/appContext';
import Dahsboard from './front/js/pages/Dahsboard.jsx';
import Layout from './front/js/component/Layout'; // Import Layout
import ServiceSelector from './front/js/pages/ServiceSelector'; // Import ServiceSelector

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Wrap other routes with Layout */}
                <Route path="/*" element={<Layout />}>
                    <Route path="dashboard" element={<Dahsboard />} />
                    <Route path="service-selector" element={<ServiceSelector />} />
                    <Route path="services/:id" element={<ServiceDetails />} />
                    <Route path="services/create" element={<ServiceForm />} />
                    <Route path="services/edit/:id" element={<ServiceForm />} />
                     {/* Add the new route */}
                </Route>
            </Routes>
        </Router>
    );
};

export default injectContext(App);
