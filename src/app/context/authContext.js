"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const authContext = createContext();

// Crear instancia de axios con mejor manejo de errores
const api = axios.create({
    baseURL: 'http://localhost:3004/api',
    withCredentials: true
});


api.interceptors.request.use(
    (config) => {
        console.log('🚀 Request:', {
            url: config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export function useAuth() {
    const context = useContext(authContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const clearAuthState = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const verifyToken = async () => {
        try {
            const response = await api.get('/auth/verify');
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (err) {
            clearAuthState();
            console.error('Token verification failed:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            console.log('📝 Attempting login with credentials:', {
                username: credentials.username,
                passwordLength: credentials.password?.length
            });

            const response = await api.post('/auth/login', credentials);

            console.log('✅ Login response:', response.data);

            if (response.data.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                console.log("Este es el usuario dentro del login:", response.data.user);
                return { success: true, data: response.data.user };
            }

            throw new Error('Respuesta del servidor no contiene datos del usuario');
        } catch (err) {
            const errorDetail = {
                status: err.response?.status,
                data: err.response?.data,
                message: err.response?.data?.message || err.message,
                raw: err
            };

            console.error('❌ Login error details:', errorDetail);

            const errorMessage = err.response?.data?.message ||
                err.response?.statusText ||
                err.message ||
                'Error al iniciar sesión';

            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
                details: errorDetail
            };
        }
    };




    const registro = async (userData) => {
        try {
            console.log('📝 Attempting registration with data:', {
                ...userData,
                password: userData.password ? '[HIDDEN]' : undefined
            });

            const response = await api.post('/auth/register', userData);

            console.log('✅ Registration response:', response.data);

            if (response.data.user) {
                return await login({
                    username: userData.username,
                    password: userData.password
                });
            }

            throw new Error('Error en el registro: respuesta inválida del servidor');
        } catch (err) {
            const errorDetail = {
                status: err.response?.status,
                data: err.response?.data,
                message: err.response?.data?.message || err.message
            };

            console.error('❌ Registration error details:', errorDetail);

            const errorMessage = err.response?.data?.message ||
                'Error al registrar usuario';

            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
                details: errorDetail
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            clearAuthState();
        } catch (err) {
            console.error('Logout error:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            clearAuthState();
        }
    };

    useEffect(() => {
        if (user) {
            console.log("Este es el usuario después de haber sido actualizado:", user);
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        verifyToken();
    }, []);

    return (
        <authContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            error,
            login,
            logout,
            registro,
            verifyToken
        }}>
            {children}
        </authContext.Provider>
    );
}