import { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from 'react-toastify';

export default function AuthPage() {
  const { store, actions } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    const success = await actions.login(data.username, data.password);
    setIsLoading(false);
    if (!success) {
      toast.error("Error al iniciar sesión", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Authentication Forms */}
      <div className="flex flex-col justify-center w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Portal de Gestión de VM</h1>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Iniciar Sesión</h5>
            <p className="card-text">
              Ingresa tus credenciales para acceder a tu cuenta.
            </p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Nombre de Usuario"
                  {...register("username", {
                    required: "El nombre de usuario es requerido",
                    minLength: {
                      value: 1,
                      message: "El nombre de usuario es requerido",
                    },
                  })}
                />
                {errors.username && <div className="text-danger">{errors.username.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Contraseña"
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 1,
                      message: "La contraseña es requerida",
                    },
                  })}
                />
                {errors.password && <div className="text-danger">{errors.password.message}</div>}
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Iniciando Sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hidden flex-1 bg-gradient-to-br from-primary/90 to-primary/70 lg:flex flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Portal de Gestión de VM
          </h1>
          <p className="text-xl">
            Una plataforma integral para que los operadores de centros de datos gestionen las implementaciones de máquinas virtuales en los hipervisores Proxmox y vCenter.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="bg-white text-primary rounded-full p-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p>Crea fácilmente máquinas virtuales con configuraciones predefinidas o personalizadas</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-white text-primary rounded-full p-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p>Gestiona las conexiones de hipervisores para entornos Proxmox y vCenter</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-white text-primary rounded-full p-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p>Realiza un seguimiento de los datos de los clientes e informa los números de las máquinas virtuales</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-white text-primary rounded-full p-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p>Control de acceso basado en roles para administradores, operadores y espectadores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
