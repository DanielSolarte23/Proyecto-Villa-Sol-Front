"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PagoContext = createContext();

export function PagoProvider({ children }) {
    const [pago, setPago] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarPagos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3004/api/pago');

            const FormatoPagos = response.data.map(pago => ({
                id: pago.id,
                nombrePropietario: pago.propietario?.nombre ?? pago.propietario_nombre ?? 'Nombre desconocido',
                numeroApto: pago.apartamento?.numeroDeApartamento,
                bloque: pago.apartamento?.bloque,
                monto: pago.monto,
                vencimiento: new Date(pago.createdAt).toLocaleDateString('es-CO'),
                estado: pago.estado,
            }));

            setPago(FormatoPagos);
        } catch (error) {
            setError('Error al cargar los pagos');
            console.error('Error', error);
        } finally {
            setLoading(false);
        }
    };


    const agregarPago = async (nuevoPago) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3004/api/pago', {
                monto: nuevoPago.monto,
                estado: nuevoPago.estado,
                propietarioId: nuevoPago.propietarioId,
            });
            console.log('response', response);
            await cargarPagos();
            return { success: true, data: response.data };
        } catch (error) {
            setError('Error al agregar el pago');
            console.error('Error', error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const actualizarPago = async (id, nuevoPago) => {
        try {
            setLoading(true);
            const response = await axios.put(`http://localhost:3004/api/pago/${id}`, nuevoPago);
            console.log('response', response);
            await cargarPagos();
            return { success: true };
        } catch (error) {
            setError('Error al actualizar el pago');
            console.error('Error', error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        cargarPagos();
    }, []);

    const value = {
        pago,
        loading,
        error,
        agregarPago,
        actualizarPago,
    };

    return <PagoContext.Provider value={value}>{children}</PagoContext.Provider>;

}
export function usePago() {
    const context = useContext(PagoContext);
    if (!context) {
        throw new Error('usePago debe estar dentro del proveedor PagoContext');
    }
    return context;
}