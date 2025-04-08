import { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { CircleCheckBig } from "lucide-react";
import "../../styles/Home.css";

export default function Home() {
  const { store, actions } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const navigate = useNavigate(); // Initialize useNavigate

  // Login form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetLoginForm,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (data) => {
    console.log("onLoginSubmit called", data);
    setIsLoading(true);
    const success = await actions.login(data.email, data.password);
    console.log("actions.login returned", success);
    setIsLoading(false);
    if (success) {
      // Redirect to dashboard on successful login
      navigate("/dashboard"); // Use navigate to redirect
    } else {
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
    resetLoginForm();
  };

  return (
    <div className="container-fluid min-h-screen">
      <ToastContainer />
      <div className="row">
        {/* Authentication Forms */}
        <div className="col-12 col-lg-4 d-flex flex-column justify-content-center p-5">
          <h1 className="mb-6 text-2xl font-bold ">
            <strong>Novahost</strong>{" "}
          </h1>
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link active`}
                    onClick={() => setMode("login")}
                  >
                    Iniciar Sesión
                  </button>
                </li>
              </ul>
              <p className="card-text mt-3">
                Ingresa tus credenciales para acceder a tu cuenta.
              </p>
            </div>
            <div className="card-body">
              <form
                onSubmit={handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Correo Electrónico"
                    {...register("email", {
                      required: "El correo electrónico es requerido",
                      validate: (value) => {
                        if (value.length < 1) {
                          return "El correo electrónico es requerido";
                        }
                        if (
                          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                            value
                          )
                        ) {
                          return "Correo electrónico inválido";
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="text-danger">{errors.email.message}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Contraseña"
                    {...register("password", {
                      required: "La contraseña es requerida",
                      validate: (value) => {
                        if (value.length < 1) {
                          return "La contraseña es requerida";
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.password && (
                    <div className="text-danger">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Iniciando Sesión...
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
        <div className="hero col-12 col-lg-8 bg-primary text-white d-flex flex-column  p-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="display-4  mb-4">
                  Portal de Gestión de VM
                </h1>
                <p className="lead mb-5">
                  Una plataforma integral para que los operadores de centros de
                  datos gestionen las implementaciones de máquinas virtuales en
                  los hipervisores Proxmox y vCenter.
                </p>
              </div>
            </div>
            <div className="row ">
              <div className="col-9 mx-auto">
                <ul className="list-group ">
                  <li className="d-flex text-start">
                    <p>
                      <CircleCheckBig size={28} color="#ffffff" /> Crea
                      fácilmente máquinas virtuales con configuraciones
                      predefinidas o personalizadas
                    </p>
                  </li>
                  <li className="d-flex text-start">
                    <p>
                      <CircleCheckBig size={28} color="#ffffff" /> Gestiona las
                      conexiones de hipervisores para entornos Proxmox y vCenter
                    </p>
                  </li>
                  <li className="d-flex text-start ">
                    <p>
                      <CircleCheckBig size={28} color="#ffffff" /> Realiza un
                      seguimiento de los datos de los clientes e informa los
                      números de las máquinas virtuales
                    </p>
                  </li>
                  <li className="d-flex text-start ">
                    <p>
                      <CircleCheckBig size={28} color="#ffffff" /> Control de
                      acceso basado en roles para administradores, operadores y
                      espectadores
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
