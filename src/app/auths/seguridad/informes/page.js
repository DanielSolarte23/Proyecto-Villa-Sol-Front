"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useInformes } from "@/app/context/InformesContext";
import { useAuth } from "@/app/context/authContext";
// import { useUser } from "@/app/context/UserContext";

function TablaConModal() {

  const { informesId,  loading, error, agregarInforme, } = useInformes();
  const { user } = useAuth();

  const [informeSeleccionado, setInformeSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [detalles, setDetalles] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [nuevoInforme, setNuevoInforme] = useState({
    cargo: "", // Este campo existe en el estado
    motivo: "",
    descripcion: "",
    estado: "no leido",
    remitenteId: `${user.id}`,
});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = informesId.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(informesId.length / itemsPerPage);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoInforme({ ...nuevoInforme, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await agregarInforme(nuevoInforme);

    if (result.success) {
        setMostrarModal(false);
        setCurrentPage(1);
        setNuevoInforme({
            cargo: "",
            motivo: "",
            descripcion: "",
            estado: "no leido",
            remitenteId: `${user.id}`,
        })
    } else {
        console.log(result.error);
        console.log(nuevoInforme);
    }
};


  const mostrarTextoCompleto = async (item) => {
    setInformeSeleccionado(item);
    setDetalles(true);
  };



  const limitarPalabras = (texto, maxPalabras) => {
    if (!texto) return '';
    const palabras = texto.split(" ");
    return palabras.length > maxPalabras
      ? palabras.slice(0, maxPalabras).join(" ") + "..."
      : texto;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full w-full gap-3">
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 78,
                color: 'rgb(216, 9, 9)',
              }}
              spin
            />
          }
        />
        <p className="text-rojo">Cargando Informes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex flex-col justify-center items-center p-6 rounded-lg bg-rojo text-white max-w-sm text-center">
          <CloseOutlined className="text-6xl mb-4" />
          <div className="text-lg font-semibold">{error}</div>
        </div>
      </div>
    );

  }

  return (
    <div className="p-2 mx-auto h-full">
      <div className="flex justify-between items-center h-[5%] w-full pt-2 2xl:pt-0">
        <button
          onClick={() => {
            setMostrarModal(true);
          }}
          className="px-4 py-2 bg-rojo text-white rounded-md hover:bg-rojo transition-colors"
        >
          + Agregar Informe
        </button>
        <div className=" relative  w-full md:w-1/3 flex items-center">
          <i className="fa-solid left-3 text-zinc-400 absolute fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Buscar informes..."
            // value={searchQuery}
            // onChange={handleSearchChange}
            className="px-3 pl-10 py-2 border border-zinc-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rojo"
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full h-[95%] flex flex-col justify-between">
        <div className="mt-4 2xl:mt-2 w-full overflow-x-auto shadow-xl rounded-lg">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs sm:text-sm text-white uppercase font-medium">Fecha</th>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs sm:text-sm text-white uppercase font-medium">Remitente</th>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs sm:text-sm text-white uppercase font-medium">Cargo</th>
                  <th className="hidden sm:table-cell px-4 py-3 2xl:py-4 text-left text-xs sm:text-sm text-white uppercase font-medium">Motivo</th>
                  <th className="hidden md:table-cell px-4 py-3 2xl:py-4 text-left text-xs sm:text-sm text-white uppercase font-medium">Descripción</th>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs sm:text-sm text-white uppercase font-medium">Estado</th>
                  <th className="px-4 py-3 2xl:py-4 text-center text-xs sm:text-sm text-white uppercase font-medium">Detalles</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-0.45 2xl:py-1.20 text-xs sm:text-sm font-medium">{item.fechaRegistro}</td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-xs sm:text-sm text-gray-500">{item.remitenteName}</td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-xs sm:text-sm text-gray-500">{item.remitenteRole}</td>
                    <td className="hidden sm:table-cell px-4 py-0.45 2xl:py-1.20 text-xs sm:text-sm text-gray-500">{item.motivo}</td>
                    <td className="hidden md:table-cell px-4 py-0.45 2xl:py-1.20 text-xs sm:text-sm text-gray-500">
                      {limitarPalabras(item.descripcion, 5)}
                    </td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-xs sm:text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.estado === 'leido' ? 'bg-red-200 text-zinc-800bg-zinc-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-center space-x-2">
                      <button
                        onClick={() => mostrarTextoCompleto(item)}
                        className="bg-rojo hover:bg-zinc-800 text-white p-1 sm:py-1 sm:px-3 rounded text-xs sm:text-sm"
                      >
                        <i className="fa-solid fa-magnifying-glass"></i>
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
              : 'text-gray-700 bg-white hover:bg-zinc-800 hover:text-white transition-colors duration-300'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {detalles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 flex flex-col gap-5">
              <div className="w-full flex justify-between">
                <h2 className="text-lg sm:text-xl font-bold mb-4">
                  Detalles del informe
                </h2>
                <i onClick={() => setDetalles(false)} className="fa-solid fa-xmark text-xl"></i>
              </div>
              <div>
                <h2 className='font-medium'>Fecha de registro</h2>
                <p>{informeSeleccionado.fechaRegistro}</p>
              </div>
              <div>
                <h2 className='font-medium'>Nombre del remitente</h2>
                <p>{informeSeleccionado.remitenteName}</p>
              </div>
              <div>
                <h2 className='font-medium'>Cargo del remitente</h2>
                <p>{informeSeleccionado.remitenteRole}</p>
              </div>
              <div>
                <h2 className='font-medium'>Motivo</h2>
                <p>{informeSeleccionado.motivo}</p>
              </div>
              <div>
                <h2 className='font-medium'>Descripción</h2>
                <p>{informeSeleccionado.descripcion}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Agregar Informe
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Usuario:</label>
                  <div className="w-full border rounded-md p-2 text-sm bg-gray-100">
                    {user.name}  {/* Muestra solo el nombre */}
                  </div>
                  <input type="hidden" name="remitenteId" value={user.id} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Motivo:</label>
                  <select name="motivo" value={nuevoInforme.motivo} onChange={handleChange} className="w-full border rounded-md p-2 text-sm">
                    <option value="">Seleccione un motivo</option>
                    <option value="Queja">Queja</option>
                    <option value="Reclamo">Reclamo</option>
                    <option value="Peticion">Peticion</option>
                    <option value="Revista">Revista</option>
                    <option value="Novedad">Novedad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción:</label>
                  <textarea
                    name="descripcion"
                    value={nuevoInforme.descripcion}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-sm"
                    rows="4"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-rojo hover:bg-rojo text-white px-4 py-2 rounded-md text-sm"
                  >
                    Agregar
                  </button>

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
    </div>
  );
}

export default TablaConModal;