"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

function TablaConModal() {
  const [datos, setDatos] = useState([]);
  const [usuarios, setUsuarios] = useState();
  const [datosSeleccionados, setDatosSeleccionados] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    remitenteName: "",
    cargo: "",
    motivo: "",
    descripcion: "",
    estado: "no leido", // Cambiado para coincidir con el backend
  });

  useEffect(() => {
    cargarInformes(),
      cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3004/api/users");
      const usuariosFormateados = response.data.map((usuario) => ({
        id: usuario.id,
        name: usuario.name,
        role: usuario.role,
      }));
      setUsuarios(usuariosFormateados);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  const cargarInformes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3004/api/informes");
      const informesFormateados = response.data.map((informe) => ({
        id: informe.id,
        remitenteName: informe.remitente?.name || '',
        cargo: informe.cargo,
        motivo: informe.motivo,
        descripcion: informe.descripcion,
        estado: informe.estado,
        createdAt: new Date(informe.createdAt).toLocaleDateString()
      }));
      setDatos(informesFormateados);
    } catch (error) {
      setError("Ocurrió un error al cargar los informes.");
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const mostrarTextoCompleto = async (item) => {
    setDatosSeleccionados(item);
    setMostrarModal(true);

    if (item.estado === 'no leido') {
      try {
        await actualizarEstadoInforme(item.id);
      } catch (error) {
        setError("No se pudo actualizar el estado del informe");
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  const actualizarEstadoInforme = async (id) => {
    try {
      // Actualizar usando la misma ruta base que se usa para obtener los informes
      await axios.patch(`http://localhost:3004/api/informes/${id}`, {
        estado: "leido"
      });

      // Actualizar el estado local
      setDatos(prevDatos =>
        prevDatos.map(informe =>
          informe.id === id ? { ...informe, estado: "leido" } : informe
        )
      );

      // Actualizar datosSeleccionados si es necesario
      setDatosSeleccionados(prev =>
        prev && prev.id === id ? { ...prev, estado: "leido" } : prev
      );
    } catch (error) {
      console.error("Error al realizar el PATCH:", error.response || error.message);
      throw new Error("Error al actualizar el estado del informe");

    }
  };


  const eliminarInforme = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3004/api/informes/${id}`);
      await cargarInformes();
      setMostrarModalConfirmacion(false);
    } catch (error) {
      setError("Ocurrió un error al eliminar el informe.");
      console.error("Error deleting report:", error);
    } finally {
      setLoading(false);
    }
  };

  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState(null);


  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if (name === "usuario") {
      // Buscar el usuario seleccionado por su ID
      const usuarioSeleccionado = usuarios.find((usuario) => usuario.id === parseInt(value));

      // Actualizar el estado con el ID del usuario y el cargo (role)
      setNuevoRegistro((prev) => ({
        ...prev,
        usuario: value, // Actualiza el usuario seleccionado
        cargo: usuarioSeleccionado ? usuarioSeleccionado.role : "", // Actualiza el cargo con el role
      }));
    } else {
      setNuevoRegistro((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const agregarRegistro = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3004/api/informes", {
        ...nuevoRegistro,
        remitenteId: usuarios.find((usuario) => usuario.id === parseInt(nuevoRegistro.usuario))?.id,
        estado: "no leido"
      });

      await cargarInformes();
      setNuevoRegistro({
        remitenteName: "",
        cargo: "",
        motivo: "",
        descripcion: "",
        estado: "no leido",
      });
      setMostrarModal(false);
    } catch (error) {
      setError("Ocurrió un error al agregar el informe.");
      console.error("Error adding report:", error);
    } finally {
      setLoading(false);
    }
  };

  const limitarPalabras = (texto, maxPalabras) => {
    if (!texto) return '';
    const palabras = texto.split(" ");
    return palabras.length > maxPalabras
      ? palabras.slice(0, maxPalabras).join(" ") + "..."
      : texto;
  };

  const confirmarEliminacion = (id) => {
    setRegistroAEliminar(id);
    setMostrarModalConfirmacion(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full w-full gap-3">
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 78,
                color: 'rgb(249, 115, 22)',
              }}
              spin
            />
          }
        />
        <p className="text-orange-600">Cargando Informes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex flex-col justify-center items-center p-6 rounded-lg bg-orange-500 text-white max-w-sm text-center">
          <CloseOutlined className="text-6xl mb-4" />
          <div className="text-lg font-semibold">{error}</div>
        </div>
      </div>
    );

  }

  return (
    <div className="p-2 mx-auto max-w-7xl">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <header className="h-14 w-full flex items-center mb-4">
        <button
          onClick={() => {
            setMostrarModal(true);
            setDatosSeleccionados(null);
          }}
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md font-medium text-white text-sm sm:text-base"
        >
          + Agregar Informe
        </button>
      </header>

      <div className="w-full overflow-x-auto shadow-md rounded-lg">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-1 py-3 text-left text-xs sm:text-sm text-gray-500 uppercase font-medium">Fecha</th>
                <th className="px-1 py-3 text-left text-xs sm:text-sm text-gray-500 uppercase font-medium">Remitente</th>
                <th className="px-1 py-3 text-left text-xs sm:text-sm text-gray-500 uppercase font-medium">Cargo</th>
                <th className="hidden sm:table-cell px-1 py-3 text-left text-xs sm:text-sm text-gray-500 uppercase font-medium">Motivo</th>
                <th className="hidden md:table-cell px-1 py-3 text-left text-xs sm:text-sm text-gray-500 uppercase font-medium">Descripción</th>
                <th className="px-1 py-3 text-left text-xs sm:text-sm text-gray-500 uppercase font-medium">Estado</th>
                <th className="px-1 py-3 text-center text-xs sm:text-sm text-gray-500 uppercase font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datos.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-2 text-xs sm:text-sm">{item.createdAt}</td>
                  <td className="p-2 text-xs sm:text-sm">{item.remitenteName}</td>
                  <td className="p-2 text-xs sm:text-sm">{item.cargo}</td>
                  <td className="hidden sm:table-cell p-2 text-xs sm:text-sm">{item.motivo}</td>
                  <td className="hidden md:table-cell p-2 text-xs sm:text-sm">
                    {limitarPalabras(item.descripcion, 5)}
                  </td>
                  <td className="p-2 text-xs sm:text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.estado === 'leido' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="p-2 text-center space-x-2">
                    <button
                      onClick={() => mostrarTextoCompleto(item)}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-1 sm:py-1 sm:px-3 rounded text-xs sm:text-sm"
                    >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <button
                      onClick={() => confirmarEliminacion(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 sm:py-1 sm:px-3 rounded text-xs sm:text-sm"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {datosSeleccionados ? "Detalles del Informe" : "Agregar Informe"}
              </h2>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {!datosSeleccionados ? <div>
                  <label className="block text-sm font-medium mb-1">Usuario:</label>
                  <select
                    name="usuario"
                    value={nuevoRegistro.usuario}
                    onChange={manejarCambio}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Seleccione un usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.name}
                      </option>
                    ))}
                  </select>
                </div> : <div>
                  <label className="block text-sm font-medium mb-1">Cargo:</label>
                  <input
                    type="text"
                    name="cargo"
                    value={datosSeleccionados?.remitenteName || nuevoRegistro.remitenteName}
                    onChange={manejarCambio}
                    className="w-full border rounded-md p-2 text-sm"
                    readOnly={!!datosSeleccionados}
                  />
                </div>}
                {!datosSeleccionados ? <div>
                  <label className="block text-sm font-medium mb-1">Cargo:</label>
                  <select
                    name="cargo"
                    value={nuevoRegistro.cargo}
                    onChange={manejarCambio}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Seleccione un cargo</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Personal de Seguridad">Personal de Seguridad</option>
                  </select>
                </div> : <div>
                  <label className="block text-sm font-medium mb-1">Cargo:</label>
                  <input
                    type="text"
                    name="cargo"
                    value={datosSeleccionados?.cargo || nuevoRegistro.cargo}
                    onChange={manejarCambio}
                    className="w-full border rounded-md p-2 text-sm"
                    readOnly={!!datosSeleccionados}
                  />
                </div>}
                <div>
                  <label className="block text-sm font-medium mb-1">Motivo:</label>
                  <input
                    type="text"
                    name="motivo"
                    value={datosSeleccionados?.motivo || nuevoRegistro.motivo}
                    onChange={manejarCambio}
                    className="w-full border rounded-md p-2 text-sm"
                    readOnly={!!datosSeleccionados}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción:</label>
                  <textarea
                    name="descripcion"
                    value={datosSeleccionados?.descripcion || nuevoRegistro.descripcion}
                    onChange={manejarCambio}
                    className="w-full border rounded-md p-2 text-sm"
                    rows="4"
                    readOnly={!!datosSeleccionados}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
                  {!datosSeleccionados && (
                    <button
                      onClick={agregarRegistro}
                      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Agregar
                    </button>
                  )}
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {mostrarModalConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Confirmación de Eliminación</h2>
              <p className="text-sm sm:text-base">¿Estás seguro de que deseas eliminar este informe?</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
                <button
                  onClick={() => eliminarInforme(registroAEliminar)}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setMostrarModalConfirmacion(false)}
                  className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TablaConModal;