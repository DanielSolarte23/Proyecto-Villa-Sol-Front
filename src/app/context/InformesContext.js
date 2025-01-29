"use client"

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const InformesContext = createContext();

export function InformesProvider({ children }) {
    const [informes, setInformes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarInformes = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3004/api/informes");
            const informesFormateados = response.data.map((informe) => ({
                id: informe.id,
                remitenteName: informe.remitente?.name || '',
                remitenteRole: informe.remitente?.role,
                // cargo: informe.cargo,
                motivo: informe.motivo,
                descripcion: informe.descripcion,
                estado: informe.estado,
                fechaRegistro: informe.createdAt ? new Date(informe.createdAt) : null,
            })).sort((a, b) => {
                if (a.fechaRegistro && b.fechaRegistro) {
                    return b.fechaRegistro - a.fechaRegistro;
                }
                return a.fechaRegistro ? -1 : 1
            });

            const informesConFormato = informesFormateados.map(informe => ({
                ...informe,
                fechaRegistro: informe.fechaRegistro ? informe.fechaRegistro.toLocaleString('es-CO') : 'Sin registro',
            }))

            setInformes(informesConFormato);
        } catch (error) {
            setError("Ocurrió un error al cargar los informes.");
            console.error("Error loading reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const agregarInforme = async (nuevoInforme) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3004/api/informes', {
                cargo: nuevoInforme.cargo,
                motivo: nuevoInforme.motivo,
                descripcion: nuevoInforme.descripcion,
                estado: nuevoInforme.estado,
                remitenteId: nuevoInforme.remitenteId
            });

            await cargarInformes()
            return { success: true, data: response.data };
        } catch (error) {
            setError(error.response?.data?.error || "Error al agregar el informe");
            return { success: false, error }
        } finally {
            setLoading(false)
        }
    }

    const eliminarInforme = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:3004/api/informes/${id}`);
            await cargarInformes()
        } catch (error) {
            setError("Ocurrió un error al eliminar el informe.");
            console.error("Error deleting report:", error);
        } finally {
            setLoading(false);
        }
    }

    const actualizarEstadoInformeContext = async (id) => {
        try {
            // Hacer la petición PATCH al servidor
            await axios.patch(`http://localhost:3004/api/informes/${id}`, {
                estado: "leido",
            });

            // Actualizar el estado global (informes)
            setInformes((prevDatos) =>
                prevDatos.map((informe) =>
                    informe.id === id ? { ...informe, estado: "leido" } : informe
                )
            );
        } catch (error) {
            console.error("Error al realizar el PATCH:", error.response || error.message);
            throw new Error("Error al actualizar el estado del informe");
        }
    }

    useEffect(() => {
        cargarInformes();
    }, []);

    const value = {
        informes,
        loading,
        error,
        agregarInforme,
        eliminarInforme,
        actualizarEstadoInformeContext,
    };


    return (
        <InformesContext.Provider value={value}>
            {children}
        </InformesContext.Provider>
    );
}

export function useInformes() {
    const context = useContext(InformesContext);
    if (!context) {
        throw new Error('UseInformes debe estar dentro de InformesProvider');
    }
    return context;
}



// const informe = {
//     "cargo": "Seguridad",
//     "motivo": "Reporte",
//     "descripcion": "El dia de hoy estoy probando el api",
//     "estado": "leido",
//     "remitenteId": null,
// }

