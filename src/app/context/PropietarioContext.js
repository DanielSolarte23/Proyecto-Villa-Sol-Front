"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PropietariosContext = createContext();

export function PropietariosProvider({ children }) {
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarPropietarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3004/api/propietario');
      const propietariosFormateados = response.data.map(propietario => ({
        id: propietario.propietarioId,
        Nombre: propietario.nombre,
        bloque: propietario.apartamentoBloque,
        Apartamento: propietario.apartamentoNumero,
        apartamentoId: propietario.apartamentoId,
        Cedula: propietario.cedula,
        Telefono: propietario.telefono,
        pago: propietario.estadoPago,
        FechaRegistro: new Date(propietario.propietarioCreado).toLocaleDateString('es-CO'),
      }));
  
      setPropietarios(propietariosFormateados);
    } catch (error) {
      setError('Error al cargar los propietarios');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarPropietario = async (nuevoPropietario) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3004/api/propietario', {
        nombre: nuevoPropietario.nombre,
        cedula: nuevoPropietario.cedula,
        telefono: nuevoPropietario.telefono,
        apartamentoId: nuevoPropietario.apartamentoId
      });
      await cargarPropietarios();
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data?.error || 'Error al agregar el propietario');
      console.error('Error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const actualizarPropietario = async (id, datos) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:3004/api/propietario/${id}`, datos);
      await cargarPropietarios();
      await cargarApartamentos();
      return { success: true };
    } catch (error) {
      setError('Error al actualizar el propietario');
      console.error('Error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const eliminarInforme = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3004/api/propietario/${id}`);
      await cargarPropietarios();
      // setMostrarModalConfirmacion(false);
    } catch (error) {
      setError("Ocurrió un error al eliminar el Propietario.");
      console.error("Error deleting report:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    cargarPropietarios();
  }, []);

  const value = {
    propietarios,
    loading,
    error,
    agregarPropietario,
    actualizarPropietario,
    eliminarInforme,
  };

  return (
    <PropietariosContext.Provider value={value}>
      {children}
    </PropietariosContext.Provider>
  );
}

export function usePropietarios() {
  const context = useContext(PropietariosContext);
  if (!context) {
    throw new Error('usePropietarios debe ser usado dentro de PropietariosProvider');
  }
  return context;
}