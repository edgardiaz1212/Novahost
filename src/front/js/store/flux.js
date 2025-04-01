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
      tokenExpiresIn: sessionStorage.getItem("tokenExpiresIn") || null, // Store token expiration
      services: [], 
      virtualMachines: [], 
      hypervisors: [],
      hypervisorVMs: [],
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
              tokenExpiresIn: data.expires_in, // New field for token expiration
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
              tokenExpiresIn: null,
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
            tokenExpiresIn: null,
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
                Authorization: `Bearer ${token}`,
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
      // ***Gestion de usuarios***
      fetchCurrentUser: async () => {
        const store = getStore();
        const token = sessionStorage.getItem("token");
        try {
          // If no token, immediately return false
          if (!token) {
            console.log("No authentication token found");
            setStore({
              user: null,
              isAuthenticated: false,
            });
            return false;
          }

          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/current-user`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();

            // Update store with user data
            setStore({
              user: data.user,
              isAuthenticated: true,
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
              token: null,
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
            token: null,
          });

          // Clear session storage
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("isAuthenticated");

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
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
      addUser: async (userData) => {
        const store = getStore();
        const token = sessionStorage.getItem("token");
        console.log("flux", token);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/add-user`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Add authorization header
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
      deleteUser: async (userId) => {
        const store = getStore();
        try {
          const token = sessionStorage.getItem("token"); // Use sessionStorage
          if (!token) {
            console.error("No token found for delete user.");
            return false;
          }
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/delete-user/${userId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`, // Correctly format the token
              },
            }
          );

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
          console.log(store.token);
          return false;
        }
      },
//***Gestion servicios*** 
 // Fetch services
 fetchServices: async () => {
  const store = getStore();
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/services`,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          }
      );
      if (response.ok) {
          const data = await response.json();
          setStore({ services: data });
          console.log("Services fetched:", data);
          return data;
      } else {
          console.error("Failed to fetch services");
          return false;
      }
  } catch (error) {
      console.error("Error fetching services:", error);
      return false;
  }
},
//  update service order
updateServiceOrder: async (newOrder) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/update-service-order`,
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(newOrder),
          }
      );
      if (response.ok) {
          console.log("Service order updated successfully");
          getActions().fetchServices(); // Refresh service list
          return true;
      } else {
          console.error("Failed to update service order");
          return false;
      }
  } catch (error) {
      console.error("Error updating service order:", error);
      return false;
  }
},
// Add a new service
addService: async (serviceData) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/add-service`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add authorization header
        },
        body: JSON.stringify(serviceData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Service added successfully:", data);
      getActions().fetchServices(); // Refresh service list
      return true;
    } else {
      const errorData = await response.json();
      console.error("Failed to add service:", errorData);
      return false;
    }
  } catch (error) {
    console.error("Error adding service:", error);
    return false;
  }
},

// Update an existing service
updateService: async (serviceId, serviceData) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/edit-service/${serviceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add authorization header
        },
        body: JSON.stringify(serviceData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Service updated successfully:", data);
      getActions().fetchServices(); // Refresh service list
      return true;
    } else {
      const errorData = await response.json();
      console.error("Failed to update service:", errorData);
      return false;
    }
  } catch (error) {
    console.error("Error updating service:", error);
    return false;
  }
},

// Delete a service
deleteService: async (serviceId) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/delete-service/${serviceId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Add authorization header
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Service deleted successfully:", data);
      getActions().fetchServices(); // Refresh service list
      return true;
    } else {
      const errorData = await response.json();
      console.error("Failed to delete service:", errorData);
      return false;
    }
  } catch (error) {
    console.error("Error deleting service:", error);
    return false;
  }
},
//***Gestion de Clientes Usuario Final***
// Fetch clients
fetchClients: async () => {
  const store = getStore();
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/clients`,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          }
      );
      if (response.ok) {
          const data = await response.json();
          setStore({ clients: data });
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

// Add a new client
addClient: async (clientData) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/add-client`,
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(clientData),
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log("Client added successfully:", data);
          getActions().fetchClients(); // Refresh client list
          return true;
      } else {
          const errorData = await response.json();
          console.error("Failed to add client:", errorData);
          return false;
      }
  } catch (error) {
      console.error("Error adding client:", error);
      return false;
  }
},

// Update an existing client
updateClient: async (clientId, clientData) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/edit-client/${clientId}`,
          {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(clientData),
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log("Client updated successfully:", data);
          getActions().fetchClients(); // Refresh client list
          return true;
      } else {
          const errorData = await response.json();
          console.error("Failed to update client:", errorData);
          return false;
      }
  } catch (error) {
      console.error("Error updating client:", error);
      return false;
  }
},

// Delete a client
deleteClient: async (clientId) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/delete-client/${clientId}`,
          {
              method: "DELETE",
              headers: {
                  "Authorization": `Bearer ${token}`,
              },
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log("Client deleted successfully:", data);
          getActions().fetchClients(); // Refresh client list
          return true;
      } else {
          const errorData = await response.json();
          console.error("Failed to delete client:", errorData);
          return false;
      }
  } catch (error) {
      console.error("Error deleting client:", error);
      return false;
  }
},
//***Gestion de Maquinas Virtuales***
fetchVirtualMachines: async () => {
  const store = getStore();
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/virtual-machines`,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          }
      );
      if (response.ok) {
          const data = await response.json();
          setStore({ virtualMachines: data });
          console.log("Virtual Machines fetched:", data);
          return data;
      } else {
          console.error("Failed to fetch Virtual Machines");
          return false;
      }
  } catch (error) {
      console.error("Error fetching Virtual Machines:", error);
      return false;
  }
},

addVirtualMachine: async (vmData) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/add-virtual-machine`,
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(vmData),
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log("Virtual Machine added successfully:", data);
          getActions().fetchVirtualMachines(); // Refresh VM list
          return true;
      } else {
          const errorData = await response.json();
          console.error("Failed to add Virtual Machine:", errorData);
          return false;
      }
  } catch (error) {
      console.error("Error adding Virtual Machine:", error);
      return false;
  }
},

updateVirtualMachine: async (vmId, vmData) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/edit-virtual-machine/${vmId}`,
          {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(vmData),
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log("Virtual Machine updated successfully:", data);
          getActions().fetchVirtualMachines(); // Refresh VM list
          return true;
      } else {
          const errorData = await response.json();
          console.error("Failed to update Virtual Machine:", errorData);
          return false;
      }
  } catch (error) {
      console.error("Error updating Virtual Machine:", error);
      return false;
  }
},

deleteVirtualMachine: async (vmId) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/delete-virtual-machine/${vmId}`,
          {
              method: "DELETE",
              headers: {
                  "Authorization": `Bearer ${token}`,
              },
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log("Virtual Machine deleted successfully:", data);
          getActions().fetchVirtualMachines(); // Refresh VM list
          return true;
      } else {
          const errorData = await response.json();
          console.error("Failed to delete Virtual Machine:", errorData);
          return false;
      }
  } catch (error) {
      console.error("Error deleting Virtual Machine:", error);
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



// ***Gestion de Hypervisores***
fetchHypervisors: async () => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/hypervisors`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setStore({ hypervisors: data });
      console.log("Hypervisors fetched:", data);
      return data;
    } else {
      console.error("Failed to fetch Hypervisors");
      return false;
    }
  } catch (error) {
    console.error("Error fetching Hypervisors:", error);
    return false;
  }
},

addHypervisor: async (hypervisorData) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/add-hypervisor`,
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(hypervisorData),
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log("Hypervisor added successfully:", data);
          getActions().fetchHypervisors(); // Refresh hypervisor list
          return true;
      } else {
          const errorData = await response.json();
          console.error("Failed to add Hypervisor:", errorData);
          return false;
      }
  } catch (error) {
      console.error("Error adding Hypervisor:", error);
      return false;
  }
},

updateHypervisor: async (hypervisorId, hypervisorData) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/edit-hypervisor/${hypervisorId}`,
          {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(hypervisorData),
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log("Hypervisor updated successfully:", data);
          getActions().fetchHypervisors(); // Refresh hypervisor list
          return true;
      } else {
          const errorData = await response.json();
          console.error("Failed to update Hypervisor:", errorData);
          return false;
      }
  } catch (error) {
      console.error("Error updating Hypervisor:", error);
      return false;
  }
},

deleteHypervisor: async (hypervisorId) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/delete-hypervisor/${hypervisorId}`,
          {
              method: "DELETE",
              headers: {
                  "Authorization": `Bearer ${token}`,
              },
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log("Hypervisor deleted successfully:", data);
          getActions().fetchHypervisors(); // Refresh hypervisor list
          return true;
      } else {
          const errorData = await response.json();
          console.error("Failed to delete Hypervisor:", errorData);
          return false;
      }
  } catch (error) {
      console.error("Error deleting Hypervisor:", error);
      return false;
  }
},

fetchHypervisorVMs: async (hypervisorId) => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/hypervisor/${hypervisorId}/vms`,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
          }
      );
      if (response.ok) {
          const data = await response.json();
          setStore({ hypervisorVMs: data });
          console.log("Hypervisor VMs fetched:", data);
          return data;
      } else {
          console.error("Failed to fetch Hypervisor VMs");
          return false;
      }
  } catch (error) {
      console.error("Error fetching Hypervisor VMs:", error);
      return false;
  }
},

//*Creacion maquinas Virtuales
createVirtualMachine: async (hypervisorId, vmSpec) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/create-vm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hypervisor_id: hypervisorId, vm_spec: vmSpec }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("VM created successfully:", data);
      return data;
    } else {
      console.error("Failed to create VM");
      return false;
    }
  } catch (error) {
    console.error("Error creating VM:", error);
    return false;
  }
},
//capacidad de un hipervisor
fetchHypervisorCapacity: async (hypervisorId) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/hypervisor/${hypervisorId}/capacity`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("Hypervisor capacity fetched:", data);
      return data;
    } else {
      console.error("Failed to fetch hypervisor capacity");
      return false;
    }
  } catch (error) {
    console.error("Error fetching hypervisor capacity:", error);
    return false;
  }
},
//Listar Hypervisores
fetchHypervisors: async () => {
  const store = getStore();
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/hypervisors`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setStore({ hypervisors: data });
      console.log("Hypervisors fetched:", data);
      return data;
    } else {
      console.error("Failed to fetch hypervisors");
      return false;
    }
  } catch (error) {
    console.error("Error fetching hypervisors:", error);
    return false;
  }
},
//Fetch maquinas virtuales
fetchVirtualMachines: async () => {
  const store = getStore();
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/virtual-machines`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setStore({ virtualMachines: data });
      console.log("Virtual Machines fetched:", data);
      return data;
    } else {
      console.error("Failed to fetch Virtual Machines");
      return false;
    }
  } catch (error) {
    console.error("Error fetching Virtual Machines:", error);
    return false;
  }
},


     
    },
  };
};

export default getState;
