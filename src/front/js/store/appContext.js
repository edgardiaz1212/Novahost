import React, { useState, useEffect } from "react";
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

        useEffect(() => {
            /**
             * This function is the equivalent to "window.onLoad", it only runs once on the entire application lifetime
             * you should do your ajax requests or fetch api requests here. Do not use setState() to save data in the
             * store, instead use actions, like this:
             **/
            // Example: state.actions.loadSomeData(); <---- calling this function from the flux.js actions
            // Check token expiration every 5 seconds (adjust as needed)
            const intervalId = setInterval(() => {
                state.actions.checkTokenExpiration();
            }, 5000); // 5000 milliseconds = 5 seconds

            // Cleanup function to clear the interval when the component unmounts
            return () => clearInterval(intervalId);
        }, []);

        return (
            <Context.Provider value={state}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;
