"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

function Page() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPropietarios();
  }, []);

  const cargarPropietarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3004/api/propietarios');
      const propietariosFormateados = response.data.map(propietario => ({
        id: propietario.id,
        Nombre: propietario.name,
        Apartamento: propietario.apartamento?.numeroDeApartamento || 'Sin asignar',
        Cedula: propietario.cedula,
        Telefono: propietario.phone,
        FechaRegistro: new Date(propietario.createdAt).toLocaleDateString('es-CO'), // Formatear la fecha
      }));

      setDatos(propietariosFormateados);
      console.log(propietariosFormateados);
    } catch (error) {
      setError('Error al cargar los propietarios');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-2">
      <div className="mt-4 bg-white rounded-lg shadow">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apartamento
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cedula
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefono
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* {datos.map((item, index) => ( */}
              {datos.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.Nombre}</div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.Apartamento}
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.Cedula}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.Telefono}
                  </td>
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.FechaRegistro}
                  </td>
                  {/* 
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>*/}
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Page;