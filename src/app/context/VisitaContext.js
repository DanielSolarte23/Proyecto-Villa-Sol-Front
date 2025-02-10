"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

import axios from "axios";

const VisitaContext = createContext();

export function VisitaProvider({ children }) {
    const [visitas, setVisitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const cargarVisitantes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3004/api/visitante');

            // Formatear las visitas
            const formatoVisitas = response.data
                .map(visita => ({
                    id: visita.id,
                    nombre: visita.nombre,
                    apartamento: visita.apartamento?.numeroDeApartamento,
                    cedula: visita.cedula,
                    // Convertir las fechas a objetos Date si son válidas
                    fechaIngreso: visita.fechaHoraIngreso ? new Date(visita.fechaHoraIngreso) : null,
                    fechaSalida: visita.fechaHoraSalida ? new Date(visita.fechaHoraSalida) : null,
                    estado: visita.estado
                }))
                .sort((a, b) => {
                    // Ordenar por fecha de ingreso (de más antigua a más reciente)
                    if (a.fechaIngreso && b.fechaIngreso) {
                        return b.fechaIngreso - a.fechaIngreso;
                    }
                    return a.fechaIngreso ? -1 : 1; // Colocar las entradas sin fecha al final
                });
 
            // Convertir las fechas a texto antes de asignar el estado
            const visitasConFormato = formatoVisitas.map(visita => ({
                ...visita,
                fechaIngreso: visita.fechaIngreso ? visita.fechaIngreso.toLocaleString('es-CO') : 'Sin registro',
                fechaSalida: visita.fechaSalida ? visita.fechaSalida.toLocaleString('es-CO') : 'Sin registro'
            }));    

            setVisitas(visitasConFormato); 
            // console.log(visitasConFormato);
            // Actualizar el estado con los datos ordenados y formateados
        } catch (error) {
            setError('Error al cargar los Visitantes');
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };



    const agregarVisita = async (nuevaVisita) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3004/api/visitante', {
                nombre: nuevaVisita.nombre,
                cedula: nuevaVisita.cedula,
                fechaHoraIngreso: nuevaVisita.fechaHoraIngreso,
                apartamentoId: nuevaVisita.apartamentoId
            });
            console.log('response', response);
            await cargarVisitantes();
            return { succes: true, data: response.data };
        } catch (error) {
            setError('Error al agregar visitante');
            return { succes: false, error };
        } finally {
            setLoading(false)
        }
    }

    const actualizarVisita = async (id, nuevaVisita) => {
        try {
            setLoading(true);
            const response = await axios.put(`http://localhost:3004/api/visitante/${id}`, nuevaVisita);
            console.log('response', response);
            await cargarVisitantes();
            return { success: true };
        } catch (error) {
            setError('Error al actualizar la visita');
            console.error('Error', error);
            return { success: false, error };
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        cargarVisitantes();
    }, []);

    const value = {
        visitas,
        loading,
        error,
        agregarVisita,
        actualizarVisita,
    };

    return <VisitaContext.Provider value={value}>{children}</VisitaContext.Provider>

}

export function useVisita() {
    const context = useContext(VisitaContext);
    if (!context) {
        throw new Error('useVisitas debe estar dentro del provider VisitaContext')
    }

    return context;
}