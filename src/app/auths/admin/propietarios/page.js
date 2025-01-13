"use client"
import { usePropietarios } from '@/app/context/PropietarioContext';
import React, { useState } from "react";
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

function Page() {
  const {
    propietarios,
    apartamentos,
    loading,
    error,
    agregarPropietario,
    actualizarPropietario,
    eliminarInforme,
  } = usePropietarios();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datosSeleccionados, setDatosSeleccionados] = useState(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [propietarioAEliminar, setPropietarioAEliminar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [nuevoPropietario, setNuevoPropietario] = useState({
    nombre: "",
    apartamento: "",
    cedula: "",
    telefono: "",
    estadoPago: "pendiente",
  });


  //Funcion para paginacion
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = propietarios.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(propietarios.length / itemsPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPropietario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const abrirModal = (propietario) => {
    if (propietario) {
      setDatosSeleccionados(propietario);
      setNuevoPropietario({
        nombre: propietario.Nombre,
        apartamento: propietario.Apartamento,
        cedula: propietario.Cedula,
        telefono: propietario.Telefono,
        estadoPago: propietario.pago,
      });
      console.log(propietario);
    } else {
      setDatosSeleccionados(null);
      setNuevoPropietario({
        nombre: "",
        apartamento: "",
        cedula: "",
        telefono: "",
        estadoPago: "pendiente",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosParaEnviar = {
      nombre: nuevoPropietario.nombre,
      cedula: nuevoPropietario.cedula,
      telefono: nuevoPropietario.telefono,
      apartamentoId: apartamentos.find(apt => apt.numeroDeApartamento === nuevoPropietario.apartamento)?.id
    };

    if (datosSeleccionados) {
      await actualizarPropietario(datosSeleccionados.id, datosParaEnviar);
    } else {
      await agregarPropietario(datosParaEnviar);
    }

    setIsModalOpen(false);
    setDatosSeleccionados(null);
    setNuevoPropietario({
      nombre: "",
      apartamento: "",
      cedula: "",
      telefono: "",
      estadoPago: "pendiente",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDatosSeleccionados(null);
    setNuevoPropietario({
      nombre: "",
      apartamento: "",
      cedula: "",
      telefono: "",
      estadoPago: "pendiente",
    });
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
        <p className="text-orange-600">Cargando Propietarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div
          className="flex flex-col justify-center items-center p-6 rounded-lg"
          style={{
            backgroundColor: 'rgb(249, 115, 22)',
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

  const handleEliminar = (id) => {
    setPropietarioAEliminar(id);
    setMostrarModalConfirmacion(true);
  };

  const confirmarEliminacion = () => {
    eliminarInforme(propietarioAEliminar);
    setMostrarModalConfirmacion(false);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-2 h-full ">
      <div className='h-[9%] flex items-center'>
        <button
          onClick={() => abrirModal(null)}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-orange-500 text-white text-sm sm:text-base rounded-md hover:bg-orange-600 transition-colors"
        >
          + Agregar un nuevo usuario
        </button>
      </div>
      <div className="overflow-x-auto w-full h-[91%] flex flex-col justify-between">
        <div className="mt-4 bg-white rounded-lg shadow-lg">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bloque
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ">
                    Apartamento
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cedula
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefono
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado Pago
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accion
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.Nombre}</div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {item.bloque}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {item.Apartamento}
                    </td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.Cedula}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.Telefono}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.pago}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.FechaRegistro}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => abrirModal(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white p-1 sm:py-1 sm:px-3 rounded text-xs sm:text-sm"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleEliminar(item.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white p-1 sm:py-1 sm:px-3 rounded text-xs sm:text-sm"
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
        <div className="flex justify-center mt-4 space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-4 py-1 rounded-md ${currentPage === 1
              ? 'text-gray-500 bg-gray-100 cursor-not-allowed'
              : 'text-gray-700 bg-white hover:bg-orange-500 hover:text-white transition-colors duration-300'
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
                ? 'bg-orange-500 text-white'
                : number === '...'
                  ? 'text-gray-700 cursor-default'
                  : 'text-gray-700 bg-white hover:bg-orange-500 hover:text-white transition-colors duration-300'
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



      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {datosSeleccionados ? 'Editar Usuario' : 'Nuevo Propietario'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombres"
                    value={nuevoPropietario.nombre}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cedula" className="text-sm font-medium text-gray-700">Documento de identidad</label>
                  <input
                    name="cedula"
                    placeholder="Cedula"
                    value={nuevoPropietario.cedula}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="apartamento" className="text-sm font-medium text-gray-700">Apartamento</label>
                  <select
                    name="apartamento"
                    value={nuevoPropietario.apartamento}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Seleccione un apartamento</option>
                    {apartamentos.map((item) => (
                      <option key={item.id} value={item.numeroDeApartamento}>
                        bloque: {item.bloque} apartamento: {item.numeroDeApartamento}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="telefono" className="text-sm font-medium text-gray-700">Telefono</label>
                  <input
                    name="telefono"
                    placeholder="Teléfono"
                    value={nuevoPropietario.telefono}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
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
                    {datosSeleccionados ? 'Actualizar' : 'Guardar'}
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
              <p className="text-sm sm:text-base">¿Estás seguro de que deseas eliminar este propietario?</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
                <button
                  onClick={() => confirmarEliminacion(propietarioAEliminar)}
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

export default Page;