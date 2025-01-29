"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const ApartamentoContext = createContext();

export function ApartamentoProvider({children}) {
    const [apartamentos, setApartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarApartamentos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3004/api/apartamentos');
            const apartamentosFormateados = response.data.map(apto => ({
                id: apto.id,
                nroApto: apto.numeroDeApartamento,
                bloque: apto.bloque,
                metros: `${apto.metros} mts`,
                propietario: apto.propietario?.nombre || 'Sin asignar',
                propietarioId: apto.propietarioId,
                estado: apto.estado
            }));
            setApartamentos(apartamentosFormateados);
        } catch (err) {
            setError('Error al cargar los apartamentos');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const actualizarApartamento = async (datos) => {
        try {
            setLoading(true);
            // Asegúrate de que la URL sea correcta y que el ID se tome del objeto datos
            await axios.put(`http://localhost:3004/api/apartamentos/${datos.id}`, {
                numeroDeApartamento: datos.numeroDeApartamento,
                bloque: datos.bloque,
                metros: parseInt(datos.metros),
                estado: datos.estado,
                propietarioId: datos.propietarioId
            });
            await cargarApartamentos();
            return { success: true };
        } catch (error) {
            setError('Error al actualizar el apartamento');
            console.error('Error', error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarApartamentos();
    }, []);

    const value = {
        apartamentos,
        loading,
        error,
        actualizarApartamento,
    };

    return (
        <ApartamentoContext.Provider value={value}>{children}</ApartamentoContext.Provider>
    );
}

export function useApartamentos() {
    const context = useContext(ApartamentoContext);
    if(!context) {
        throw new Error('useApartamentos debe ser usado dentro de ApartamentosProvider')
    }
    return context;
}