'use client';
// import { useAuth } from '../context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

export default function ProtectedLayout({ children }) {
    //   const { loading, isAuthenticated } = useAuth();
    //   const router = useRouter();

    //   useEffect(() => {
    //     if (!loading && !isAuthenticated) {
    //       router.push('/login'); // Redirige a la página de login si no está autenticado
    //     }
    //   }, [loading, isAuthenticated, router]);

    //   if (loading) return <h1>Loading...</h1>;

    //   return isAuthenticated ? <>{children}</> : null;
    return (<>{children}</>)
}
