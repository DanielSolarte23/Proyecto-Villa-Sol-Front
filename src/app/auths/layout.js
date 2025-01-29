'use client';

import { useAuth } from '@/app/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function ProtectedLayout({ children }) {
    const { loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/'); // Redirige a la página de login si no está autenticado
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return <div className="flex flex-col justify-center items-center h-screen w-full gap-3">
        <Spin 
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 150,
                color: '#d80909',
              }}
              spin
            />
          }
        />
        <p className="text-rojo text-2xl">Cargando...</p>
      </div>; // Muestra un mensaje mientras se verifica el estado
    }

    // Renderiza los hijos solo si el usuario está autenticado
    return isAuthenticated ? <>{children}</> : null;
}
