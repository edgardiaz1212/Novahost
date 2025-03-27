const getState = ({ getStore, getActions, setStore }) => {
  // Check authentication state from session storage on load
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const storedUser = JSON.parse(sessionStorage.getItem("user")); // Retrieve user data from session storage
  const storedToken = sessionStorage.getItem("token"); // Retrieve token from session storage
  return {
    store: {
      message: null,
      isAuthenticated: isAuthenticated, // Initialize with session storage value
      user: storedUser || null,
      serverResources: [], // Add a store variable for server resources
      requests: [], // Add a store variable for requests
      users: [], // Add a store variable for users
      clients: [], // Add a store variable for clients
      token: storedToken || null, // Initialize with session storage value
    },

    actions: {
      // Autenticación
      login: async (email, password) => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ user: data.user, isAuthenticated: true });
            sessionStorage.setItem("isAuthenticated", "true"); // Store authentication state in session storage
            sessionStorage.setItem("user", JSON.stringify(data.user)); // Store user data in session storage
            sessionStorage.setItem("token", data.token); // Store token in session storage
            console.log("Autenticado", data.user, data.token); // Update isAuthenticated
            return data;
          } else {
            setStore({ isAuthenticated: false, user: null }); // Set to false and clear user on login failure
            sessionStorage.removeItem("isAuthenticated");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            console.log("Error al autenticar");

            return false;
          }
        } catch (error) {
          setStore({ isAuthenticated: false, user: null });
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
          console.log("Error during login", error);
          return false;
        }
      },

      logout: async () => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/logout`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
              },
            }
          );
          if (response.ok) {
            setStore({ user: null, isAuthenticated: false });
            sessionStorage.removeItem("isAuthenticated");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            console.log("Logout successful");
            return true;
          } else {
            console.error("Logout failed");
            return false;
          }
        } catch (error) {
          console.error("Error during logout", error);
          return false;
        }
      },

      // Fetch server resources
      fetchServerResources: async () => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/server-resources`, // Replace with your actual endpoint
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ serverResources: data }); // Update the store with fetched data
            console.log("Server resources fetched:", data);
            return data;
          } else {
            console.error("Failed to fetch server resources");
            return false;
          }
        } catch (error) {
          console.error("Error fetching server resources:", error);
          return false;
        }
      },
      // Fetch requests
      fetchRequests: async () => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/requests`, // Replace with your actual endpoint
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ requests: data }); // Update the store with fetched data
            console.log("Requests fetched:", data);
            return data;
          } else {
            console.error("Failed to fetch requests");
            return false;
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
          return false;
        }
      },
      // Fetch users
      fetchUsers: async () => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/users`, // Replace with your actual endpoint
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ users: data }); // Update the store with fetched data
            console.log("Users fetched:", data);
            return data;
          } else {
            console.error("Failed to fetch users");
            return false;
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          return false;
        }
      },
      // Fetch clients
      fetchClients: async () => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/clients`, // Replace with your actual endpoint
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ clients: data }); // Update the store with fetched data
            console.log("Clients fetched:", data);
            return data;
          } else {
            console.error("Failed to fetch clients");
            return false;
          }
        } catch (error) {
          console.error("Error fetching clients:", error);
          return false;
        }
      },
    },
  };
};

export default getState;
