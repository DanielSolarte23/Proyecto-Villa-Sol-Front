"use client"

import React, { useState } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      nombre: 'Nombre U',
      cedula: '10000000',
      telefono: '3145477698',
      usuario: 'UsuarioEjm1',
      rol: 'Admin',
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    documento: '',
    telefono: '',
    usuario: '',
    contrasena: '',
    rol: '',
    cargo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      nombres: '',
      apellidos: '',
      documento: '',
      telefono: '',
      usuario: '',
      contrasena: '',
      rol: '',
      cargo: '',
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      nombres: user.nombre,
      apellidos: '',
      documento: user.cedula,
      telefono: user.telefono,
      usuario: user.usuario,
      contrasena: '********',
      rol: user.rol,
      cargo: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      setUsers(users.map(user =>
        user.id === selectedUser.id
          ? { ...user, nombre: formData.nombres, cedula: formData.documento, telefono: formData.telefono, usuario: formData.usuario, rol: formData.rol }
          : user
      ));
    } else {
      setUsers([...users, {
        id: users.length + 1,
        nombre: formData.nombres,
        cedula: formData.documento,
        telefono: formData.telefono,
        usuario: formData.usuario,
        rol: formData.rol,
      }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full px-2 py-5">
      <button
        onClick={handleAddUser}
        className="px-3 py-2 sm:px-4 sm:py-2 mb-4 bg-orange-500 text-white text-sm sm:text-base rounded-md hover:bg-orange-600 transition-colors"
      >
        + Agregar un nuevo usuario
      </button>

      <div className="w-full overflow-x-auto rounded-lg shadow">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-3 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-2 py-3 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Cedula</th>
              <th className="px-2 py-3 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Telefono</th>
              <th className="px-2 py-3 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-2 py-3 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Contraseña</th>
              <th className="px-2 py-3 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-2 py-3 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase">Acciones</th>
              <th className="px-2 py-3 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm whitespace-normal">{user.nombre}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm whitespace-normal">{user.cedula}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm whitespace-normal">{user.telefono}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm whitespace-normal">{user.usuario}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm whitespace-normal">********</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm whitespace-normal">{user.rol}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    <i className="fa-solid fa-pen text-xs sm:text-sm"></i>
                  </button>
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    <i className="fa-solid fa-trash text-xs sm:text-sm"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    name="nombres"
                    placeholder="Nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    name="apellidos"
                    placeholder="Apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    name="documento"
                    placeholder="Documento de identidad"
                    value={formData.documento}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    name="usuario"
                    placeholder="Nombre de usuario"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    name="contrasena"
                    type="password"
                    placeholder="Contraseña"
                    value={formData.contrasena}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    name="rol"
                    placeholder="Rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    name="cargo"
                    placeholder="Cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">¿Está seguro de eliminar este usuario?</h2>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;