"use client"

import React, { useEffect, useState, useMemo } from "react";
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useVisita } from "@/app/context/VisitaContext";

function Page() {


  const { visitas,
    loading,
    error,
  } = useVisita();


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
    if (!searchQuery) return visitas;

    const lowercaseQuery = searchQuery.toLowerCase().trim();

    return visitas.filter(visita =>
      (visita.nombre || "").toLowerCase().includes(lowercaseQuery) ||
      (visita.apartamento || "").toLowerCase().includes(lowercaseQuery) ||
      (visita.cedula || "").toLowerCase().includes(lowercaseQuery) ||
      (visita.fechaIngreso || "").toLowerCase().includes(lowercaseQuery) ||
      (visita.estado || "").toLowerCase().includes(lowercaseQuery)
    );
  }, [visitas, searchQuery]);


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
        <p className="text-rojo">Cargando Visitantes...</p>
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

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-2 py-2 h-full">
      <div className="flex justify-end items-center h-[5%] w-full pt-2 2xl:pt-0">
        <div className=" relative  w-full md:w-1/3 flex items-center">
          <i className="fa-solid left-3 text-zinc-400 absolute fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Buscar visitantes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-3 pl-10 py-2 border border-zinc-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rojo"
          />
        </div>
      </div>
      <div className="overflow-x-auto w-full h-[95%] flex flex-col justify-between">
        <div className="mt-4 2xl:mt-2 bg-white rounded-lg shadow">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Apartamento
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Cedula
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Ingreso
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Salida
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="hidden sm:table-cell px-4 py-0.45 2xl:py-1.20 whitespace-nowrap text-sm font-medium">
                      {item.nombre}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-0.45 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500">
                      {item.apartamento}
                    </td>
                    <td className="hidden md:table-cell px-4 py-0.45 2xl:py-1.20 whitespace-nowrap text-sm text-gray-500">
                      {item.cedula}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-0.45 2xl:py-1.20 text-sm text-gray-500">
                      {item.fechaIngreso}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-0.45 2xl:py-1.20 text-sm text-gray-500">
                      {item.fechaSalida}
                    </td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.estado === "terminado"
                          ? "bg-zinc-200 text-zinc-800"
                          : "bg-red-200 text-red-800"
                          }`}
                      >
                        {item.estado}
                      </span>
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
    </div>
  );
}

export default Page;