import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './front/js/pages/Home.jsx';
import injectContext from './front/js/store/appContext';
import Dahsboard from './front/js/pages/Dahsboard.jsx';
import Layout from './front/js/component/Layout'; // Import Layout
import ServiceSelector from './front/js/pages/ServiceSelector'; // Import ServiceSelector
import Configuration from './front/js/pages/Configuration.jsx';
import AprobacionServicios from './front/js/pages/AprobacionServicios.jsx';
import PrivateRoute from './front/js/component/PrivateRoute'; // Import PrivateRoute
import { Context } from './front/js/store/appContext';

const App = () => {
    const { actions } = useContext(Context);
    useEffect(() => {
        actions.fetchCurrentUser();
    }, []);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Wrap other routes with Layout and PrivateRoute */}
                <Route path="/*" element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }>
                    <Route path="dashboard" element={<Dahsboard />} />
                    <Route path="service-selector" element={<ServiceSelector />} />
                    <Route path="configuracion" element={<Configuration />} />
                    <Route path="aprobacion" element={<AprobacionServicios />} />
                    <Route path="*" element={<h1>404</h1>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default injectContext(App);
