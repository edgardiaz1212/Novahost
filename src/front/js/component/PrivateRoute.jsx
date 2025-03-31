import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext';

const PrivateRoute = ({ children }) => {
  const { store, actions } = useContext(Context);
  const location = useLocation();

  useEffect(() => {
    // Check if the user is authenticated when the route changes
    if (!store.isAuthenticated) {
      actions.fetchCurrentUser();
    }
  }, [location, store.isAuthenticated]);

  // If the user is still loading, you might want to show a loading indicator
  if (store.user === undefined) {
    return <div>Loading...</div>;
  }

  return store.isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
