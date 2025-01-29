"use client"
import { usePropietarios } from '@/app/context/PropietarioContext';
import React, { useState } from "react";
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useApartamentos } from '@/app/context/ApartamentosContext';

function Page() {
  const {
    propietarios,
    // apartamentos,
    loading,
    error,
    agregarPropietario,
    actualizarPropietario,
    eliminarInforme,
  } = usePropietarios();

  const { apartamentos } = useApartamentos()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datosSeleccionados, setDatosSeleccionados] = useState(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [propietarioAEliminar, setPropietarioAEliminar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [nuevoPropietario, setNuevoPropietario] = useState({
    Nombre: "",
    Cedula: "",
    Telefono: "",
    Apartamento: "",
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
        Nombre: propietario.Nombre,
        Cedula: propietario.Cedula,
        Telefono: propietario.Telefono,
        Apartamento: propietario.apartamentoId // Usa directamente el ID del apartamento
      });
      console.log(propietario);
      
    } else {
      setDatosSeleccionados(null);
      setNuevoPropietario({
        Nombre: "",
        Cedula: "",
        Telefono: "",
        Apartamento: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosParaEnviar = {
      nombre: nuevoPropietario.Nombre,
      cedula: nuevoPropietario.Cedula,
      telefono: nuevoPropietario.Telefono,
      apartamentoId: nuevoPropietario.Apartamento
    };
    console.log(`Estos son los datos que esta envaindo ${datosParaEnviar}`);

    if (datosSeleccionados) {
      await actualizarPropietario(datosSeleccionados.id, datosParaEnviar);
    } else {
      await agregarPropietario(datosParaEnviar);
    }

    setIsModalOpen(false);
    setDatosSeleccionados(null);
    setNuevoPropietario({
      Nombre: "",
      Cedula: "",
      Telefono: "",
      Apartamento: "",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDatosSeleccionados(null);
    setNuevoPropietario({
      Nombre: "",
      Cedula: "",
      Telefono: "",
      Apartamento: "",
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

  const handleEliminar = (id) => {
    setPropietarioAEliminar(id);
    setMostrarModalConfirmacion(true);
  };

  const confirmarEliminacion = () => {
    eliminarInforme(propietarioAEliminar);
    setMostrarModalConfirmacion(false);
  };



  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-2 py-2 h-full ">
      <div className="flex justify-between items-center h-[5%] w-full pt-2 2xl:pt-0">
        <button
          onClick={() => abrirModal(null)}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-rojo text-white text-sm sm:text-base rounded-md hover:bg-zinc-800 transition-colors"
        >
          + Agregar un nuevo propietario
        </button>
        <div className=" relative  w-full md:w-1/3 flex items-center">
          <i className="fa-solid left-3 text-zinc-400 absolute fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Buscar propietarios..."
            // value={searchQuery}
            // onChange={handleSearchChange}
            className="px-3 pl-10 py-2 border border-zinc-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rojo"
          />
        </div>
      </div>
      <div className="overflow-x-auto w-full h-[95%] flex flex-col justify-between">
        <div className="mt-4 2xl:mt-2 bg-white rounded-lg shadow-lg">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 2xl:py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Bloque
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 2xl:py-4 text-center text-xs font-medium text-white uppercase tracking-wider ">
                    Apartamento
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Cedula
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Telefono
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Estado Pago
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-4 py-3 2xl:py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Editar
                  </th>
                  <th className="px-4 py-3 2xl:py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Eliminar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-0.45 2xl:py-1.20 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.Nombre}</div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-0.45 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500 text-center">
                      {item.bloque}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-0.45 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500 text-center">
                      {item.Apartamento}
                    </td>
                    <td className="hidden md:table-cell px-4 py-0.45 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500">
                      {item.Cedula}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-0.45 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500">
                      {item.Telefono}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-0.45 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500">
                      {item.pago}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-0.45 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500">
                      {item.FechaRegistro}
                    </td>
                    <td className="px-2 py-0.45 2xl:py-1.20 text-center">
                      <button
                        onClick={() => abrirModal(item)}
                        className="bg-rojo hover:bg-zinc-800 text-white p-1 sm:py-1 sm:px-3 rounded text-xs sm:text-sm"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </td>
                    <td className="px-2 text-center py-0.45 2xl:py-1.20">
                      <button
                        onClick={() => handleEliminar(item.id)}
                        className="bg-rojo hover:bg-zinc-800 text-white p-1 sm:py-1 sm:px-3 rounded text-xs sm:text-sm"
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



      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {datosSeleccionados ? 'Editar Usuario' : 'Nuevo Propietario'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="Nombre" className="text-sm font-medium text-gray-700">Nombre completo</label>
                  <input
                    type="text"
                    name="Nombre"
                    placeholder="Nombres"
                    value={nuevoPropietario.Nombre}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="Cedula" className="text-sm font-medium text-gray-700">Documento de identidad</label>
                  <input
                    name="Cedula"
                    placeholder="Cedula"
                    value={nuevoPropietario.Cedula}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="Apartamento" className="text-sm font-medium text-gray-700">Apartamento</label>
                  <select
                    name="Apartamento"
                    value={nuevoPropietario.Apartamento}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Seleccione un apartamento</option>
                    {apartamentos.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        // Puedes agregar esto para debug
                        // selected={item.id === nuevoPropietario.Apartamento}
                      >
                        bloque: {item.bloque} apartamento: {item.nroApto}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="Telefono" className="text-sm font-medium text-gray-700">Telefono</label>
                  <input
                    name="Telefono"
                    placeholder="Teléfono"
                    value={nuevoPropietario.Telefono}
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