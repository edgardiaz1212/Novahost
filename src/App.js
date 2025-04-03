import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './front/js/pages/Home.jsx';
import injectContext, { Context } from './front/js/store/appContext';
import Dahsboard from './front/js/pages/Dahsboard.jsx';
import Layout from './front/js/component/Layout';
import ServiceSelector from './front/js/pages/ServiceSelector';
import Configuration from './front/js/pages/Configuration.jsx';
import AprobacionServicios from './front/js/pages/AprobacionServicios.jsx';
import Details from './front/js/pages/Details.jsx';
import ReportsPage from './front/js/pages/ReportsPage.jsx';

const App = () => {
    const { store, actions } = useContext(Context);
    const { isAuthenticated, redirectPath } = store;
    const navigate = useNavigate();

    useEffect(() => {
        if (redirectPath) {
            navigate(redirectPath);
            actions.setRedirectPath(null);
        }
    }, [redirectPath, navigate]);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            {isAuthenticated ? (
                <Route path="/*" element={<Layout />}>
                    <Route path="dashboard" element={<Dahsboard />} />
                    <Route path="service-selector" element={<ServiceSelector />} />
                    <Route path="configuracion" element={<Configuration />} />
                    <Route path="aprobacion" element={<AprobacionServicios />} />
                    <Route path="details/:category" element={<Details />} /> 
                    <Route path="reports" element={<ReportsPage/>} /> 
                    <Route path="*" element={<h1>404</h1>} />
                </Route>
            ) : (
                <Route path="/*" element={<HomePage />} />
            )}
        </Routes>
    );
};

const AppWithContext = injectContext(App);

const Root = () => {
    return (
        <Router>
            <AppWithContext />
        </Router>
    );
};

export default Root;
