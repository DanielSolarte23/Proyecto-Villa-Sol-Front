"use client"

import { useUser } from '@/app/context/UserContext';
import React, { useState, useMemo } from 'react';
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const UserManagement = () => {
  const {
    user,
    loading,
    error,
    actualizarUser,
    agregarUser,
    eliminarUser,
  } = useUser()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombres: '',
    documento: '',
    telefono: '',
    usuario: '',
    contrasena: '',
    rol: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;


  // Función para cambiar de página
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const filterVisitas = useMemo(() => {
    if (!searchQuery) return user;

    const lowercaseQuery = searchQuery.toLowerCase().trim();

    return user.filter(usr =>
      (usr.name || "").toLowerCase().includes(lowercaseQuery) ||
      (usr.cedula || "").toLowerCase().includes(lowercaseQuery) ||
      (usr.telefono || "").toLowerCase().includes(lowercaseQuery) ||
      (usr.username || "").toLowerCase().includes(lowercaseQuery) ||
      (usr.role || "").toLowerCase().includes(lowercaseQuery)
    );
  }, [user, searchQuery]);


  const currentItems = filterVisitas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filterVisitas.length / itemsPerPage);

  // Generar array de números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Número máximo de páginas visibles

    if (totalPages <= maxVisiblePages) {
      // Si hay menos páginas que el máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 3) {
        // Inicio de la lista
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Final de la lista
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // Medio de la lista
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const abrirModal = (usuario) => {
    if (usuario) {
      setUsuarioSeleccionado(usuario);
      setNuevoUsuario({
        nombres: usuario.name,
        documento: usuario.cedula,
        telefono: usuario.phone,
        usuario: usuario.username,
        contrasena: usuario.password,
        rol: usuario.role
      });
    } else {
      setUsuarioSeleccionado(null);
      setNuevoUsuario({
        nombres: '',
        documento: '',
        telefono: '',
        usuario: '',
        contrasena: '',
        rol: ''
      });
    }
    setIsModalOpen(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault()

    const usuarioParaEnviar = {
      name: nuevoUsuario.nombres,
      cedula: nuevoUsuario.documento,
      phone: nuevoUsuario.telefono,
      username: nuevoUsuario.usuario,
      password: nuevoUsuario.contrasena,
      role: nuevoUsuario.rol
    };

    if (usuarioSeleccionado) {
      await actualizarUser(usuarioSeleccionado.id, usuarioParaEnviar);
    } else {
      await agregarUser(usuarioParaEnviar);
    }

    setIsModalOpen(false);
    setUsuarioSeleccionado(null);
    setNuevoUsuario({
      nombres: '',
      documento: '',
      telefono: '',
      usuario: '',
      contrasena: '',
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUsuarioSeleccionado(null);
    setNuevoUsuario({
      name: "",
      cedula: "",
      phone: "",
      username: "",
      password: "",
      role: ""
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full w-full gap-3">
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 78,
                color: '#d80909',
              }}
              spin
            />
          }
        />
        <p className="text-rojo">Cargando Propietarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div
          className="flex flex-col justify-center items-center p-6 rounded-lg"
          style={{
            backgroundColor: '#d80909',
            color: 'white',
            maxWidth: '300px',
            textAlign: 'center',
          }}
        >
          <CloseOutlined style={{ fontSize: 78, marginBottom: 16 }} />
          <div className="text-lg font-semibold">{error}</div>
        </div>
      </div>
    );
  }


  const handleDelete = (id) => {
    setUsuarioAEliminar(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    eliminarUser(usuarioAEliminar);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-2 py-2 h-full">
      <div className="flex justify-between items-center h-[5%] w-full pt-2 2xl:pt-0">
        <button
          onClick={() => abrirModal(null)}
          className="px-4 py-2 bg-rojo text-white rounded-md hover:bg-rojo transition-colors"
        >
          + Agregar nuevo usuario
        </button>
        <div className=" relative  w-full md:w-1/3 flex items-center">
          <i className="fa-solid left-3 text-zinc-400 absolute fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Buscar Usuarios..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-3 pl-10 py-2 border border-zinc-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rojo"
          />
        </div>
      </div>
      <div className='overflow-x-auto w-full h-[95%] flex flex-col justify-between'>
        <div className='mt-4 2xl:mt-2 w-full overflow-x-auto shadow-xl rounded-lg'>
          <div className="min-w-full">
            <table className="w-full min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="px-2 py-3 2xl:py-4 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase">Nombre</th>
                  <th className="px-2 py-3 2xl:py-4 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase">Cedula</th>
                  <th className="px-2 py-3 2xl:py-4 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase">Telefono</th>
                  <th className="px-2 py-3 2xl:py-4 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase">Usuario</th>
                  <th className="px-2 py-3 2xl:py-4 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase">Contraseña</th>
                  <th className="px-2 py-3 2xl:py-4 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-white uppercase">Rol</th>
                  <th className="px-2 py-3 2xl:py-4 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-medium text-white uppercase">Editar</th>
                  <th className="px-2 py-3 2xl:py-4 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-medium text-white uppercase">Eliminar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-0.45 2xl:py-1.20 sm:py-3 text-xs sm:text-sm whitespace-normal font-medium">{item.name}</td>
                    <td className="px-2 py-0.45 2xl:py-1.20 sm:py-3 text-xs sm:text-sm whitespace-normal text-gray-500">{item.cedula}</td>
                    <td className="px-2 py-0.45 2xl:py-1.20 sm:py-3 text-xs sm:text-sm whitespace-normal text-gray-500">{item.telefono}</td>
                    <td className="px-2 py-0.45 2xl:py-1.20 sm:py-3 text-xs sm:text-sm whitespace-normal text-gray-500">{item.username}</td>
                    <td className="px-2 py-0.45 2xl:py-1.20 sm:py-3 text-xs sm:text-sm whitespace-normal text-gray-500">******</td>
                    <td className="px-2 py-0.45 2xl:py-1.20 sm:py-3 text-xs sm:text-sm whitespace-normal text-gray-500">{item.role}</td>
                    <td className="px-2 py-0.45 2xl:py-1.20 sm:py-3 text-center">
                      <button
                        onClick={() => abrirModal(item)}
                        className="bg-rojo hover:bg-zinc-800 text-white py-1 px-3 rounded text-xs sm:text-sm"
                      >
                        <i className="fa-solid fa-pen text-xs sm:text-sm"></i>
                      </button>
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-rojo hover:bg-zinc-800 text-white py-1 px-3 rounded text-xs sm:text-sm"
                      >
                        <i className="fa-solid fa-trash text-xs sm:text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-4 py-1 rounded-md ${currentPage === 1
              ? 'text-gray-500 bg-gray-100 cursor-not-allowed'
              : 'text-gray-700 bg-white hover:bg-zinc-800 hover:text-white transition-colors duration-300'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {getPageNumbers().map((number, index) => (
            <button
              key={index}
              onClick={() => number !== '...' ? paginate(number) : null}
              className={`hidden sm:block px-4 py-1 rounded-md ${number === currentPage
                ? 'bg-rojo text-white'
                : number === '...'
                  ? 'text-gray-700 cursor-default'
                  : 'text-gray-700 bg-white hover:bg-zinc-800 hover:text-white transition-colors duration-300'
                }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-4 py-1 rounded-md ${currentPage === totalPages
              ? 'text-gray-500 bg-gray-100 cursor-not-allowed'
              : 'text-gray-700 bg-white hover:bg-orange-500 hover:text-white transition-colors duration-300'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {usuarioSeleccionado ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type='text'
                    name="nombres"
                    placeholder="Nombres"
                    value={nuevoUsuario.nombres}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-rojo"
                    required
                  />
                </div>
                <div>
                  <input
                    type='text'
                    name="documento"
                    placeholder="Numero de documento"
                    value={nuevoUsuario.documento}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-rojo"
                  />
                </div>
                <div>
                  <input
                    name="telefono"
                    placeholder="Telefono"
                    value={nuevoUsuario.telefono}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-rojo"
                  />
                </div>
                <div>
                  <input
                    name="usuario"
                    placeholder="Usuario"
                    value={nuevoUsuario.usuario}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-rojo"
                  />
                </div>
                <div>
                  <input
                    name="contrasena"
                    placeholder="Contraseña"
                    value={nuevoUsuario.contrasena}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-rojo"
                  />
                </div>
                <div>
                  <input
                    name="rol"
                    type="tex"
                    placeholder="Rol o cargo"
                    value={nuevoUsuario.rol}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-rojo"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                  >
                    {usuarioSeleccionado ? 'Actualizar' : 'Agregar'}
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
                  onClick={confirmDelete(usuarioAEliminar)}
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
