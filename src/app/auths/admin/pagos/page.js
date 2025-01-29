"use client"

import React, { useState } from "react";
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { usePago } from "@/app/context/PagoContext";
import { usePropietarios } from "@/app/context/PropietarioContext";



function PaymentPage() {
  const {
    pago,
    loading,
    error,
    agregarPago,
    actualizarPago,
  } = usePago();

  const { propietarios } = usePropietarios()

  const [modalVisible, setModalVisible] = useState(false);
  const [facturaVisible, setFacturaVisible] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [nuevoPago, setNuevoPago] = useState({
    monto: "",
    estado: "",
    propietarioId: "",
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pago.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(pago.length / itemsPerPage);

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
    setNuevoPago(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const abrirModal = (pago) => {
    if (pago) {
      setPagoSeleccionado(pago);
      setNuevoPago({
        monto: pago.monto,
        estado: pago.estado,
        propietarioId: pago.propietarioId,
      });
    } else {
      setPagoSeleccionado(null);
      setNuevoPago({
        monto: "",
        estado: "",
        propietarioId: "",
      });
      // console.log(propietarios);
    }
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const pagoParaEnviar = {
        monto: nuevoPago.monto,
        estado: nuevoPago.estado,
        propietarioId: parseInt(nuevoPago.propietarioId)
      };

      if (pagoSeleccionado) {
        await actualizarPago(pagoSeleccionado.id, pagoParaEnviar);
      } else {
        await agregarPago(pagoParaEnviar);
      }

      setModalVisible(false);
      setPagoSeleccionado(null);
      setNuevoPago({
        monto: "",
        estado: "",
        propietarioId: "",
      });
    } catch (error) {
      console.error("Error al guardar el pago:", error);
    }
  };

  const abrirFactura = (pago) => {
    setPagoSeleccionado(pago);
    setFacturaVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setPagoSeleccionado(null);
    setNuevoPago({
      monto: "",
      estado: "",
      propietarioId: "",
    });
  };

  const cerrarFactura = () => {
    setPagoSeleccionado(null);
    setFacturaVisible(false);
  };

  const generarPDF = () => {
    if (!pagoSeleccionado) return;

    const doc = new jsPDF();
    doc.setFont('helvetica');

    // Usar la URL pública directamente
    const imgUrl = '/images/Villa_del_sol.png';
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Importante para CORS

    const addImageToPdf = () => {
      return new Promise((resolve) => {
        img.onload = () => {
          resolve();
        };
        img.src = imgUrl;
      });
    };

    const generatePdfWithImage = async () => {
      try {
        await addImageToPdf();
        const pageWidth = doc.internal.pageSize.width;
        const imgWidth = 50;
        const imgHeight = 25;
        const imgX = (pageWidth - imgWidth) / 2;
        doc.addImage(img, 'PNG', imgX, 10, imgWidth, imgHeight);

        // Encabezado centrado
        doc.setFontSize(20);
        doc.text('Factura de Administración', pageWidth / 2, 70, { align: 'center' });

        // Subtítulo centrado
        doc.setFontSize(12);
        doc.text('Conjunto Residencial Villa del Sol', pageWidth / 2, 80, { align: 'center' });
        doc.text('NIT: XXX-XXXXX', pageWidth / 2, 85, { align: 'center' });

        // Detalles del pago
        const startY = 100;
        const leftMargin = 20;
        const lineHeight = 7;

        doc.setFont('helvetica', 'bold');
        doc.text('Detalles del Pago:', leftMargin, startY);
        doc.setFont('helvetica', 'normal');

        doc.text(`Propietario: ${pagoSeleccionado.nombrePropietario}`, leftMargin, startY + lineHeight);
        doc.text(`Apartamento: ${pagoSeleccionado.numeroApto}`, leftMargin, startY + (lineHeight * 2));
        doc.text(`Monto: $${pagoSeleccionado.monto.toLocaleString()}`, leftMargin, startY + (lineHeight * 3));
        doc.text(`Fecha de pago: ${pagoSeleccionado.vencimiento}`, leftMargin, startY + (lineHeight * 4));
        doc.text(`Estado: ${pagoSeleccionado.estado}`, leftMargin, startY + (lineHeight * 5));


        const desglose = [
          ['Concepto', 'Valor'],
          ['Administración', `$${pagoSeleccionado.monto.toLocaleString()}`],
        ];

        doc.autoTable({
          startY: startY + (lineHeight * 7),
          head: [['Concepto', 'Valor']],
          body: desglose.slice(1),
          theme: 'grid',
          headStyles: { fillColor: [255, 128, 0] },
          styles: {
            halign: 'center',
            fontSize: 12,
          },
          margin: { left: 20, right: 20 }, // Márgenes para centrar la tabla
        });

        // Pie de página centrado
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.text('Este documento es una representación digital de su factura.', pageWidth / 2, pageHeight - 30, { align: 'center' });
        doc.text('Para cualquier consulta, por favor contacte a administración.', pageWidth / 2, pageHeight - 20, { align: 'center' });

        // Guardar el PDF
        const fileName = `Factura_${pagoSeleccionado.nombrePropietario}_${pagoSeleccionado.numeroApto}.pdf`;
        doc.save(fileName);
      } catch (error) {
        console.error('Error generando PDF:', error);
      }
    };

    generatePdfWithImage();
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
        <p className="text-rojo">Cargando Pagos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div
          className="flex flex-col justify-center items-center p-6 rounded-lg bg-rojo text-white max-w-300"
        >
          <CloseOutlined className="text-6xl mb-4" />
          <div className="text-lg font-semibold">{error}</div>
        </div>
      </div>
    );
  }


  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-2 py-2 h-full">
      <div className="flex justify-between items-center h-[5%] w-full pt-2 2xl:pt-0">
        <button
          onClick={() => abrirModal(null)}
          className="px-4 py-2 bg-rojo text-white rounded-md hover:bg-rojo transition-colors"
        >
          + Agregar Pago
        </button>
        <div className=" relative  w-full md:w-1/3 flex items-center">
          <i className="fa-solid left-3 text-zinc-400 absolute fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Buscar pagos..."
            // value={searchQuery}
            // onChange={handleSearchChange}
            className="px-3 pl-10 py-2 border border-zinc-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-rojo"
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full h-[95%] flex flex-col justify-between">
        <div className="mt-4 2xl:mt-2 w-full overflow-x-auto rounded-lg shadow-xl">
          <div className="min-w-full rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nombre del propietario
                  </th>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Número de apartamento
                  </th>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Bloque
                  </th>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Fecha de Pago
                  </th>
                  <th className="px-4 py-3 2xl:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 2xl:py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Editar
                  </th>
                  <th className="px-4 py-3 2xl:py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Detalles
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-sm font-medium">{item.nombrePropietario}</td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-sm text-gray-500">{item.numeroApto}</td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-sm text-gray-500">{item.bloque}</td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-sm text-gray-500">${item.monto.toLocaleString()}</td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-sm text-gray-500">{item.vencimiento}</td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-sm text-gray-500 capitalize">{item.estado}</td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-sm text-gray-500 text-center">
                      <button
                        onClick={() => abrirModal(item)}
                        className="bg-rojo hover:bg-zinc-800 text-white font-bold py-1 px-3 rounded"
                        aria-label="Editar pago"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </td>
                    <td className="px-4 py-0.45 2xl:py-1.20 text-sm text-center">
                      <button
                        onClick={() => abrirFactura(item)}
                        className="bg-rojo hover:bg-zinc-800 text-white font-bold py-1 px-3 rounded mr-2"
                        aria-label="Ver factura"
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
        <div className="flex justify-center mt-4 space-x-1">
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
              : 'text-gray-700 bg-white hover:bg-rojo hover:text-white transition-colors duration-300'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>



      {/* Modal de Edición/Creación */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {pagoSeleccionado ? "Editar Pago" : "Registrar Pago"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {pagoSeleccionado ? <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del propietario</label>
                    <input
                      type="text"
                      name="nombrePropietario"
                      value={pagoSeleccionado?.nombrePropietario || ""}
                      disabled
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Numero de apartamento</label>
                    <input
                      type="text"
                      name="numeroApto"
                      value={pagoSeleccionado?.numeroApto || ""}
                      disabled

                      className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Monto</label>
                    <input
                      type="number"
                      name="monto"
                      value={nuevoPago?.monto || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de Pago</label>
                    <input
                      type="text"
                      name="vencimiento"
                      value={pagoSeleccionado?.vencimiento || ""}
                      disabled
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      name="estado"
                      value={nuevoPago?.estado || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-rojo focus:border-rojo"
                    >
                      <option value="">Seleccione un estado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div> : <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del propietario</label>
                    <select
                      name="propietarioId"
                      value={nuevoPago.propietarioId}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      required
                    >
                      <option value="">Seleccione un propietario</option>
                      {propietarios.map((propietario) => (
                        <option key={propietario.id} value={propietario.id}>
                          {propietario.Nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Monto</label>
                    <input
                      type="number"
                      name="monto"
                      value={nuevoPago?.monto || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      name="estado"
                      value={nuevoPago?.estado || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-rojo focus:border-rojo"
                    >
                      <option value="">Seleccione un estado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm"
                  >
                    X Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {facturaVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Detalles pago de administración</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del propietario</label>
                  <p className="text-sm">{pagoSeleccionado?.nombrePropietario || ""}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Numero de apartamento</label>
                  <p className="text-sm">{pagoSeleccionado?.numeroApto || ""}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monto</label>
                  <p className="text-sm">${pagoSeleccionado?.monto?.toLocaleString() || ""}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de vencimiento</label>
                  <p className="text-sm">{pagoSeleccionado?.vencimiento || ""}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <p className="text-sm capitalize">{pagoSeleccionado?.estado || ""}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={cerrarFactura}
                  className="bg-rojo hover:bg-rojo text-white font-bold py-2 px-4 rounded text-sm"
                >
                  X Cerrar
                </button>
                <button
                  onClick={generarPDF}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded text-sm flex items-center gap-2"
                >
                  Descargar PDF <i className="fa-solid fa-file-pdf"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;