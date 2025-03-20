import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './front/js/pages/Home.jsx';
import injectContext from './front/js/store/appContext';
import Dahsboard from './front/js/pages/Dahsboard.jsx';
import Layout from './front/js/component/Layout'; // Import Layout
import ServiceSelector from './front/js/pages/ServiceSelector'; // Import ServiceSelector
import Configuration from './front/js/pages/Configuration.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Wrap other routes with Layout */}
                <Route path="/*" element={<Layout />}>
                    <Route path="dashboard" element={<Dahsboard />} />
                    <Route path="service-selector" element={<ServiceSelector />} />
                    <Route path="configuracion" element={<Configuration/>} />
                    <Route path="*" element={<h1>404</h1>} />

                     {/* Add the new route */}
                </Route>
            </Routes>
        </Router>
    );
};

export default injectContext(App);
