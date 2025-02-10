"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authContext } from "./authContext";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [users, setUsers] = useState([]); // Para todos los usuarios
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(authContext);
    const [perfil, setPerfil] = useState(null); // Para un solo usuario

    // Cargar todos los usuarios
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
                role: user.role,
            }));

            setUsers(FormatoUser); // Ahora guarda en users en lugar de perfil
        } catch (error) {
            setError('Error al cargar los usuarios');
            console.error('Error', error);
        } finally {
            setLoading(false);
        }
    }

    // Cargar un usuario específico
    const cargarUnUser = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3004/api/users/${user.id}`);
    
            const FormatoUser = {
                id: response.data.id,
                name: response.data.name,
                cedula: response.data.cedula,
                telefono: response.data.phone,
                username: response.data.username,
                password: response.data.password,
                role: response.data.role,
            };
    
            setPerfil(FormatoUser); 

        
        } catch (error) {
            setError('Error al cargar el usuario');
            console.error('Error', error);
        } finally {
            setLoading(false);
        }
    };

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
            await cargarUser(); // Recarga la lista de usuarios
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
            await cargarUser(); // Recarga la lista de usuarios
            if (id === user.id) {
                await cargarUnUser(); // Si se actualizó el usuario actual, recarga su perfil
            }
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
            await cargarUser(); // Recarga la lista tras eliminar
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
        if (user?.role === 'administrador') {
            cargarUser(); 
        }
        cargarUnUser();
    }, [user]);

    const value = {
        users,    
        perfil,      
        loading,
        error,
        cargarUser, 
        cargarUnUser,
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