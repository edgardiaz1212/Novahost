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
      token: storedToken || null,// Initialize with session storage value
      tokenExpiresIn: sessionStorage.getItem("tokenExpiresIn") || null, // Store token expiration
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
            setStore({ 
              user: data.user, 
              isAuthenticated: true,
              token: data.token,
              tokenExpiresIn: data.expires_in // New field for token expiration
            });
            
            // Update session storage
            sessionStorage.setItem("isAuthenticated", "true");
            sessionStorage.setItem("user", JSON.stringify(data.user));
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("tokenExpiresIn", data.expires_in);
            
            console.log("Autenticado", data.user, data.token);
            return data;
          } else {
            // Reset authentication on failure
            setStore({ 
              isAuthenticated: false, 
              user: null, 
              token: null,
              tokenExpiresIn: null 
            });
            
            // Clear session storage
            sessionStorage.removeItem("isAuthenticated");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("tokenExpiresIn");
            
            console.log("Error al autenticar");
            return false;
          }
        } catch (error) {
          // Reset authentication on error
          setStore({ 
            isAuthenticated: false, 
            user: null, 
            token: null,
            tokenExpiresIn: null 
          });
          
          // Clear session storage
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("tokenExpiresIn");
          
          console.log("Error during login", error);
          return false;
        }
      },

      logout: async () => {
        const store = getStore();
        try {
          const token = sessionStorage.getItem("token");
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/logout`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            // Simple logout method that only clears client-side data
            setStore({
              user: null,
              isAuthenticated: false,
              token: null,
              tokenExpiresIn: null,
            });
    
            // Clear session storage completely
            sessionStorage.removeItem("isAuthenticated");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("tokenExpiresIn");
    
            console.log("Logout successful");
            return true;
          } else {
            console.log("Error during logout");
            return false;
          }
        } catch (error) {
          console.log("Error during logout", error);
          return false;
        }
      },
    
      fetchCurrentUser: async () => {
        const store = getStore();
        const token = sessionStorage.getItem("token");
        try {
          
          // If no token, immediately return false
          if (!token) {
            console.log("No authentication token found");
            setStore({ 
              user: null, 
              isAuthenticated: false 
            });
            return false;
          }
      
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/current-user`, 
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
            }
          );
      
          if (response.ok) {
            const data = await response.json();
            
            // Update store with user data
            setStore({ 
              user: data.user,
              isAuthenticated: true
            });
      
            // Update session storage
            sessionStorage.setItem("user", JSON.stringify(data.user));
            
            console.log("Current user fetched successfully", data.user);
            return data.user;
          } else {
            // Handle authentication failure
            console.log("Failed to fetch current user");
            
            // Clear authentication
            setStore({ 
              user: null, 
              isAuthenticated: false,
              token: null
            });
            
            // Clear session storage
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("isAuthenticated");
            
            return false;
          }
        } catch (error) {
          console.error("Error fetching current user:", error);
          
          // Clear authentication on error
          setStore({ 
            user: null, 
            isAuthenticated: false,
            token: null
          });
          
          // Clear session storage
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("isAuthenticated");
          
          return false;
        }
      },
      
      // Update current user
      updateCurrentUser: async (userData) => {
        const store = getStore();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/edit-user`, // Endpoint to update user
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
              },
              body: JSON.stringify(userData),
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStore({ user: data.user }); // Update the store with the updated user
            sessionStorage.setItem("user", JSON.stringify(data.user));
            console.log("Current user updated:", data);
            return true;
          } else {
            console.error("Failed to update current user");
            return false;
          }
        } catch (error) {
          console.error("Error updating current user:", error);
          return false;
        }
      },
      updateUser: async (userId, userData) => {
        const store = getStore();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/edit-user/${userId}`, // New endpoint with user ID
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify(userData),
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log("User updated:", data);
                getActions().fetchUsers(); // Refresh user list after update
                return true;
            } else {
                console.error("Failed to update user");
                return false;
            }
        } catch (error) {
            console.error("Error updating user:", error);
            return false;
        }
    },

    deleteUser: async (userId) => {
      const store = getStore();
      try {
      
        const token = sessionStorage.getItem('token'); // Use sessionStorage
        if (!token) {
          console.error("No token found for delete user.");
          return false;
        }
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/delete-user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // Correctly format the token
          }
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error deleting user:", errorData);
          return false;
        }
    
        const data = await response.json();
        console.log("User deleted successfully:", data);
        getActions().fetchUsers();
        return true;
      } catch (error) {
        console.error("Error deleting user:", error);
        console.log(store.token)
        return false;
      }
    },
    
      addUser: async (userData) => {
        const store = getStore();
        const token = sessionStorage.getItem("token");
        console.log("flux",token)
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/add-user`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Add authorization header
              },
              body: JSON.stringify(userData),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("User added successfully:", data);
            getActions().fetchUsers(); // Refresh user list
            return true;
          } else {
            const errorData = await response.json();
            console.error("Failed to add user:", errorData);
            return false; // Or throw an error
          }
        } catch (error) {
          console.error("Error adding user:", error);
          return false; // Or throw an error
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
