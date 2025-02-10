"use client";

import { useUser } from "@/app/context/UserContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";

const Perfil = () => {
  const [editando, setEditando] = useState(false);
  const { perfil, actualizarUser, eliminarUser, loading } = useUser();
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [newPassword, setNewPassword] = useState(""); 
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (perfil) {
      setFormData({
        name: perfil.name || '',
        cedula: perfil.cedula || '',
        telefono: perfil.telefono || '',
        username: perfil.username || '',
        role: perfil.role || ''
      });
    }
  }, [perfil]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setNewPassword(value);
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
    setMessage({ text: "", type: "" }); // Limpiar el mensaje al modificar el formulario
  };

  const handleGuardar = async () => {
    if (!formData.name || !formData.username) {
      setMessage({ text: "Los campos nombre y usuario son obligatorios", type: "error" });
      return;
    }

    try {
      const datosActualizados = {
        ...formData,
        ...(newPassword && { password: newPassword }) // Solo incluye password si hay una nueva
      };

      const resultado = await actualizarUser(user.id, datosActualizados);
      if (resultado.success) {
        setMessage({ text: "Perfil actualizado exitosamente", type: "success" });
        setEditando(false);
        setNewPassword(""); // Limpiamos la contraseña después de actualizar
        setTimeout(() => setMessage({ text: "", type: "" }), 3000); // Limpiar el mensaje después de un tiempo
      } else {
        setMessage({ text: "Error al actualizar el perfil", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error al actualizar el perfil", type: "error" });
    }
  };

  const handleEliminar = async () => {
    const confirmar = window.confirm("¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (confirmar) {
      try {
        const resultado = await eliminarUser(user.id);
        if (resultado.success) {
          window.location.href = "/login"; // Redirigir al login después de eliminar la cuenta
        } else {
          setMessage({ text: "Error al eliminar la cuenta", type: "error" });
        }
      } catch (error) {
        setMessage({ text: "Error al eliminar la cuenta", type: "error" });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-3 h-full">
      <div className="bg-white shadow-lg rounded-lg p-6 h-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800  h-[5%]">Perfil de Usuario</h2>
        <div className="h-[10%] w-full ">
        {message.text && (
          <div className={`border px-4 py-3 rounded relative mb-4 ${message.type === "error" ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
            {message.text}
          </div>
        )}
        </div>

        <div className="">
          <div className="md:flex h-full">
            <div className="md:w-1/3 flex flex-col justify-start items-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fbKWx3FrfmwLauu0iXO4wY8VgjAcngaKqA&s" alt="User" />

              <input type="file" className=""/>
            </div>
            <div className="md:w-2/3 flex flex-col h-full">
              {[{ label: "Nombre", name: "name", type: "text", disabled: !editando },
                { label: "Cédula", name: "cedula", type: "text", disabled: true },
                { label: "Teléfono", name: "telefono", type: "text", disabled: !editando },
                { label: "Usuario", name: "username", type: "text", disabled: !editando },
                { label: "Rol", name: "role", type: "text", disabled: true }].map(field => (
                  <label key={field.name} className="block">
                    <span className="text-gray-700 text-sm font-medium">{field.label}:</span>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      disabled={field.disabled}
                      className={`w-full border rounded-md py-4 px-2 text-sm 
                        ${field.disabled ? 'bg-gray-50' : 'bg-white'}
                        ${editando && !field.disabled ? 'border-zinc-300 focus:ring-2 focus:ring-zinc-200' : 'border-gray-300'}
                        transition-all duration-200`}
                    />
                  </label>
                ))}

              {editando && (
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Nueva Contraseña:</span>
                  <input
                    type="password"
                    name="password"
                    value={newPassword}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para mantener la actual"
                    className="mt-1 w-full border rounded-md p-2 text-sm border-blue-300 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
              )}

              <div className="mt-6 flex justify-between gap-4">
                <button
                  onClick={editando ? handleGuardar : () => setEditando(true)}
                  className={`flex-1 px-4 py-4 rounded-md text-white font-medium transition-colors duration-200
                    ${editando ? 'bg-zinc-500 hover:bg-zinc-800' : 'bg-zinc-800 hover:bg-zinc-600'}`}
                >
                  {editando ? 'Guardar' : 'Editar'}
                </button>

                <button
                  onClick={handleEliminar}
                  className="flex-1 bg-rojo hover:bg-red-600 text-white px-4 py-4 rounded-md font-medium transition-colors duration-200"
                >
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
