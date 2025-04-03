import React, { useState, useEffect, useRef } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const injectContext = PassedComponent => {
    const StoreWrapper = props => {
        const [state, setState] = useState(
            getState({
                getStore: () => state.store,
                getActions: () => state.actions,
                setStore: updatedStore =>
                    setState({
                        store: Object.assign(state.store, updatedStore),
                        actions: { ...state.actions }
                    })
            })
        );
        const intervalIdRef = useRef(null); // Use useRef to store the interval ID

        useEffect(() => {
            // ... (existing code)
            intervalIdRef.current = setInterval(() => {
                state.actions.checkTokenExpiration();
            }, 5000);

            // Cleanup function to clear the interval when the component unmounts or when the user logs out
            return () => {
                if (intervalIdRef.current) {
                    clearInterval(intervalIdRef.current);
                }
            };
        }, []);

        useEffect(() => {
            // Clear the interval when the user logs out
            if (!state.store.isAuthenticated) {
                if (intervalIdRef.current) {
                    clearInterval(intervalIdRef.current);
                    intervalIdRef.current = null; // Reset the ref
                }
            }
        }, [state.store.isAuthenticated]);

        return (
            <Context.Provider value={state}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;
