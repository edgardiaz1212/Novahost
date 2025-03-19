import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage';
import ServiceDetails from './ServiceDetails';
import ServiceForm from './ServiceForm';
import ContactPage from './ContactPage';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/services/:id" component={ServiceDetails} />
                <Route path="/services/new" component={ServiceForm} />
                <Route path="/contact" component={ContactPage} />
            </Switch>
        </Router>
    );
};

export default App;
