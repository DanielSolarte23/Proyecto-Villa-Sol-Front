"use client"
import React, { useState, useMemo } from "react";
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useApartamentos } from "@/app/context/ApartamentosContext";


function Page() {

  const {
    apartamentos,
    loading,
    error, actualizarApartamento } = useApartamentos();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [apartamentoSeleccionado, setApartamentoSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [nuevoApartamento, setNuevoApartamento] = useState({
    numeroApto: "",
    bloque: "",
    metros: "",
    propietario: "",
    estado: ""
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;


  // Función para cambiar de página
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const filteredApartamentos = useMemo(() => {
    if (!searchQuery) return apartamentos;

    const lowercaseQuery = searchQuery.toLowerCase().trim();

    return apartamentos.filter(apto =>
      apto.nroApto.toLowerCase().includes(lowercaseQuery) ||
      apto.bloque.toLowerCase().includes(lowercaseQuery) ||
      apto.propietario.toLowerCase().includes(lowercaseQuery) ||
      apto.metros.toLowerCase().includes(lowercaseQuery) ||
      apto.estado.toLowerCase().includes(lowercaseQuery)
    );
  }, [apartamentos, searchQuery]);

  const currentItems = filteredApartamentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApartamentos.length / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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
    setNuevoApartamento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const abrirModal = (apartamento) => {
    setApartamentoSeleccionado(apartamento);
    // Actualizar el estado del formulario con los datos actuales
    setNuevoApartamento({
      numeroApto: apartamento.nroApto,
      bloque: apartamento.bloque,
      metros: apartamento.metros,
      propietario: apartamento.propietario,
      estado: apartamento.estado
    });
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const metrosNumero = nuevoApartamento.metros.split(' ')[0];

    const datosParaEnviar = {
      id: apartamentoSeleccionado.id,
      numeroDeApartamento: nuevoApartamento.numeroApto,
      bloque: nuevoApartamento.bloque,
      metros: metrosNumero,
      estado: nuevoApartamento.estado,
      propietarioId: apartamentoSeleccionado.propietarioId
    };

    try {
      const resultado = await actualizarApartamento(datosParaEnviar);

      if (resultado.success) {
        setModalVisible(false);
        setApartamentoSeleccionado(null);
        setNuevoApartamento({
          numeroApto: "",
          bloque: "",
          metros: "",
          propietario: "",
          estado: ""
        });
      } else {
        console.error('Error al actualizar el apartamento');
      }
    } catch (error) {
      console.error('Error en la actualización:', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setApartamentoSeleccionado(null);
    setNuevoApartamento({
      numeroApto: "",
      bloque: "",
      metros: "",
      propietario: "",
      estado: ""
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
        <p className="text-rojo">Cargando Apartamentos...</p>
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
          <CloseOutlined style={{ fontSize: 78, marginBottom: 16 }} /> {/* Ícono blanco */}
          <div className="text-lg font-semibold">{error}</div> {/* Texto blanco */}
        </div>
      </div>
    );
  }


  return (
    <div className="2xl:w-full mx-auto px-4 sm:px-6 lg:px-2 py-2 h-full">
      {/* Search Input */}
      <div className='flex justify-end items-center h-[5%] w-full pt-2 2xl:pt-0'>
        <div className=" relative  w-full md:w-1/3 flex items-center">
          <i className="fa-solid left-3 text-zinc-400 absolute fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Buscar apartamentos..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-3 pl-10 py-2 border border-zinc-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rojo"
          />
        </div>
      </div>
      {/* Tabla Responsive */}
      <div className="overflow-x-auto w-full h-[95%] flex flex-col justify-between">
        <div className="mt-4 2xl:mt-3 bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-3 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nro Apto
                  </th>
                  <th className="hidden sm:table-cell px-3 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Bloque
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Metros²
                  </th>
                  <th className="px-3 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Propietario
                  </th>
                  <th className="hidden sm:table-cell px-3 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-3 py-3 2xl:py-4 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 xl:py-0.90 2xl:py-1.20 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="hidden sm:block font-medium mr-2 text-gray-500">Apto:</div>
                        {item.nroApto}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 xl:py-0.90 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500">
                      {item.bloque}
                    </td>
                    <td className="hidden md:table-cell px-3 xl:py-0.90 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500">
                      {item.metros}
                    </td>
                    <td className="px-3 xl:py-0.90 2xl:py-1.20 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="sm:hidden font-medium mr-2 text-gray-500">Prop:</div>
                        {item.propietario}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 xl:py-0.90 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500">
                      {item.estado}
                    </td>
                    <td className="px-3 xl:py-0.90 2xl:py-1.20 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => abrirModal(item)}
                        className="bg-rojo hover:bg-zinc-500 text-white py-1 px-3 rounded text-xs sm:text-sm"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-4 space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-4 py-1 rounded-md ${currentPage === 1
              ? 'text-gray-500 bg-gray-100 cursor-not-allowed'
              : 'text-gray-700 bg-white hover:bg-rojo hover:text-white transition-colors duration-300'
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
                  : 'text-gray-700 bg-white hover:bg-rojo hover:text-white transition-colors duration-300'
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

      {/* Modal Responsive */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold">Apartamentos</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de apartamento
                    </label>
                    <input
                      type="text"
                      name="numeroApto"
                      value={nuevoApartamento.numeroApto}
                      onChange={handleInputChange}
                      disabled
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bloque
                    </label>
                    <input
                      type="text"
                      name="bloque"
                      value={nuevoApartamento.bloque}
                      onChange={handleInputChange}
                      disabled
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metros cuadrados
                    </label>
                    <input
                      type="text"
                      name="metros"
                      value={nuevoApartamento.metros}
                      onChange={handleInputChange}
                      disabled
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Propietario
                    </label>
                    <input
                      type="text"
                      name="propietario"
                      value={nuevoApartamento.propietario}
                      onChange={handleInputChange}
                      disabled
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={nuevoApartamento.estado}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Selecciona un estado</option>
                      <option value="ocupado">Ocupado</option>
                      <option value="desocupado">Desocupado</option>
                      <option value="mantenimiento">Mantenimiento</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <button
                    onClick={handleCloseModal}
                    type="button"
                    className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"  // Cambio aquí para que el formulario se envíe
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>

  );
}

export default Page;