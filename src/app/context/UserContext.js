"use client"

import React, { createContext, useContext, useState, useEffect, use } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarUser = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3004/api/users');

            const FormatoUser = response.data.map(user => ({
                id: user.id,
                name: user.name,
                cedula: user.cedula,
                telefono: user.phone,
                username: user.username,
                password: user.password,
                role: user.role,
            }));

            setUser(FormatoUser);
        } catch (error) {
            setError('Error al cargar los usuarios');
            console.error('Error', error);
        } finally {
            setLoading(false);
        }
    }

    const agregarUser = async (nuevoUser) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3004/api/users', {
                name: nuevoUser.name,
                cedula: nuevoUser.cedula,
                phone: nuevoUser.phone,
                username: nuevoUser.username,
                password: nuevoUser.password,
                role: nuevoUser.role,
            });
            console.log('response', response);
            await cargarUser();
            return { success: true, data: response.data };
        } catch (error) {
            setError('Error al agregar el usuario');
            console.error('Error', error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }

    const actualizarUser = async (id, nuevoUser) => {
        try {
            setLoading(true);
            const response = await axios.put(`http://localhost:3004/api/users/${id}`, nuevoUser);
            console.log('response', response);
            await cargarUser();
            return { success: true, data: response.data };
        } catch (error) {
            setError('Error al actualizar el usuario');
            console.error('Error', error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const eliminarUser = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3004/api/users/${id}`);
            console.log('response', response);
            await cargarUser();
            return { success: true, data: response.data };
        } catch (error) {
            setError('Error al eliminar el usuario');
            console.error('Error', error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUser();
    }, []);

    const value = {
        user,
        loading,
        error,
        actualizarUser,
        agregarUser,
        eliminarUser,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe estar dentro del proveedor UserContext');
    }
    return context;
}