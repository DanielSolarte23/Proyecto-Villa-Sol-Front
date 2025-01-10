"use client"

import axios from "axios";
import React, { useEffect, useState } from "react";
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function page() {
  const [datos, setDatos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [facturaVisible, setFacturaVisible] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3004/api/pago');

      const FormatoPagos = response.data.map(pago => ({
        id: pago.id,
        nombrePropietario: pago.propietario?.name,
        numeroApto: pago.apartamento?.numeroDeApartamento,
        monto: pago.monto,
        // Guardamos tanto la fecha formateada para mostrar como la fecha original
        vencimiento: new Date(pago.fechaVencimiento).toLocaleDateString('es-CO'),
        fechaVencimientoOriginal: pago.fechaVencimiento,
        estado: pago.estado,
      }));
      setDatos(FormatoPagos);
    } catch (error) {
      setError('Error al cargar los pagos');
      console.error('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFechaParaInput = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  };

  const guardarCambios = async () => {
    try {
      if (!pagoSeleccionado) return;

      // Preparamos los datos para la actualización
      const datosActualizados = {
        monto: pagoSeleccionado.monto,
        // Si la fecha no se modificó, usamos la fecha original
        fechaVencimiento: pagoSeleccionado.nuevaFechaVencimiento || pagoSeleccionado.fechaVencimientoOriginal,
        estado: pagoSeleccionado.estado
      };

      await axios.put(`http://localhost:3004/api/pago/${pagoSeleccionado.id}`, datosActualizados);

      await cargarPagos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar', error);
      alert('Error al guardar los cambios');
    }
  };

  const abrirModal = (pago) => {
    setPagoSeleccionado({
      ...pago,

      fechaVencimientoOriginal: pago.fechaVencimientoOriginal
    });
    setModalVisible(true);
  };
  const abrirfactura = (pago) => {
    setPagoSeleccionado(pago);
    setFacturaVisible(true);
  };

  const cerrarModal = () => {
    setPagoSeleccionado(null);
    setModalVisible(false);
  };
  const cerrarFactura = () => {
    setPagoSeleccionado(null);
    setFacturaVisible(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full w-full gap-3">
        <Spin
          tip="Loading"
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
        <p className="text-orange-600">Cargando Pagos...</p>
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
          <CloseOutlined style={{ fontSize: 78, marginBottom: 16 }} /> {/* Ícono blanco */}
          <div className="text-lg font-semibold">{error}</div> {/* Texto blanco */}
        </div>
      </div>
    );
  }


  const generarPDF = () => {
    if (!pagoSeleccionado) return;

    // Crear nuevo documento PDF
    const doc = new jsPDF();

    // Configurar fuente
    doc.setFont('helvetica');

    // Agregar título
    doc.setFontSize(20);
    doc.text('Factura de Administración', 105, 20, { align: 'center' });

    // Agregar logo o encabezado (opcional)
    doc.setFontSize(12);
    doc.text('Edificio/Conjunto Residencial', 105, 30, { align: 'center' });
    doc.text('NIT: XXX-XXXXX', 105, 35, { align: 'center' });

    // Agregar información del pago
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    // Sección de datos del propietario
    const startY = 50;
    const leftMargin = 20;
    const lineHeight = 7;

    doc.text('Detalles del Pago:', leftMargin, startY);
    doc.setFont('helvetica', 'normal');

    doc.text(`Propietario: ${pagoSeleccionado.nombrePropietario}`, leftMargin, startY + lineHeight);
    doc.text(`Apartamento: ${pagoSeleccionado.numeroApto}`, leftMargin, startY + (lineHeight * 2));
    doc.text(`Monto: $${pagoSeleccionado.monto.toLocaleString()}`, leftMargin, startY + (lineHeight * 3));
    doc.text(`Fecha de Vencimiento: ${pagoSeleccionado.vencimiento}`, leftMargin, startY + (lineHeight * 4));
    doc.text(`Estado: ${pagoSeleccionado.estado}`, leftMargin, startY + (lineHeight * 5));

    // Agregar tabla de desglose (opcional)
    const desglose = [
      ['Concepto', 'Valor'],
      ['Administración', `$${pagoSeleccionado.monto.toLocaleString()}`],
      // Puedes agregar más conceptos si es necesario
    ];

    doc.autoTable({
      startY: startY + (lineHeight * 7),
      head: [['Concepto', 'Valor']],
      body: desglose.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [255, 128, 0] }, // Color naranja para el encabezado
      styles: {
        halign: 'center',
        fontSize: 12
      }
    });

    // Agregar pie de página
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text('Este documento es una representación digital de su factura.', 105, pageHeight - 30, { align: 'center' });
    doc.text('Para cualquier consulta, por favor contacte a administración.', 105, pageHeight - 20, { align: 'center' });

    // Generar nombre del archivo
    const fileName = `Factura_${pagoSeleccionado.nombrePropietario}_${pagoSeleccionado.numeroApto}.pdf`;

    // Descargar el PDF
    doc.save(fileName);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-5">
      {/* Tabla */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-full rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border shadow-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre <br className="hidden sm:block" /> del propietario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número <br className="hidden sm:block" /> de apartamento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de <br className="hidden sm:block" /> vencimiento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-2 py-2 sm:px-4 text-xs sm:text-sm text-center font-medium uppercase tracking-wider text-gray-500">Acción</th>
                  <th className="px-2 py-2 sm:px-4 text-xs sm:text-sm text-center font-medium uppercase tracking-wider text-gray-500">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datos.map((item) => (
                  <tr key={item.id} className="bg-white divide-y divide-gray-200">
                    <td className="px-2 py-2 sm:px-4 text-xs sm:text-sm whitespace-normal">{item.nombrePropietario}</td>
                    <td className="px-2 py-2 sm:px-4 text-xs sm:text-sm whitespace-normal">{item.numeroApto}</td>
                    <td className="px-2 py-2 sm:px-4 text-xs sm:text-sm whitespace-normal">{item.monto}</td>
                    <td className="px-2 py-2 sm:px-4 text-xs sm:text-sm whitespace-normal">{item.vencimiento}</td>
                    <td className="px-2 py-2 sm:px-4 text-xs sm:text-sm whitespace-normal">{item.estado}</td>
                    <td className="px-2 py-2 sm:px-4 text-center">
                      <button
                        onClick={() => abrirfactura(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold py-1 px-2 sm:px-3 rounded"
                      >
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </td>
                    <td className="px-2 py-2 sm:px-4 text-center">
                      <button
                        onClick={() => abrirModal(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold py-1 px-2 sm:px-3 rounded"
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
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Detalles pago de administración</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del propietario</label>
                  <input
                    type="text"
                    value={pagoSeleccionado?.nombrePropietario || ""}
                    disabled
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Numero de apartamento</label>
                  <input
                    type="text"
                    value={pagoSeleccionado?.numeroApto || ""}
                    disabled
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monto</label>
                  <input
                    type="number"
                    value={pagoSeleccionado?.monto || ""}
                    onChange={(e) =>
                      setPagoSeleccionado({ ...pagoSeleccionado, monto: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de vencimiento</label>
                  <input
                    type="date"
                    value={formatearFechaParaInput(pagoSeleccionado?.fechaVencimientoOriginal)}
                    onChange={(e) => {
                      setPagoSeleccionado({
                        ...pagoSeleccionado,
                        nuevaFechaVencimiento: new Date(e.target.value).toISOString()
                      });
                    }}
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select value={pagoSeleccionado?.estado || ""}
                    onChange={(e) =>
                      setPagoSeleccionado({
                        ...pagoSeleccionado,
                        estado: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Seleccione un estado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={cerrarModal}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  X Cancelar
                </button>
                <button
                  onClick={guardarCambios}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Factura Modal */}
      {/* Factura Modal */}
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
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-sm"
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

export default page;