"use client";
import Header from "@/app/components/Header";
import BarraLateralSeguridad from "@/app/components/BarraLateralSeguridad";
import { useState } from "react";
import { PropietariosProvider } from '@/app/context/PropietarioContext';
import { ApartamentoProvider } from "@/app/context/ApartamentosContext";
import { VisitaProvider } from "@/app/context/VisitaContext";

export default function SeguridadLayout({ children }) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisible = () => {
        setIsVisible((prevState) => !prevState);
    };

    return (
        <div className="h-screen w-full">
            {/* Header */}
            <Header onToggle={toggleVisible} />

            {/* Contenido principal */}
            <main className="relative flex h-[88%]">
                {/* Barra lateral */}
                <div
                    className={`absolute md:w-1/5 top-0 left-0 h-full transform transition-transform md:relative md:translate-x-0 ${isVisible ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <BarraLateralSeguridad />
                </div>

                {/* Contenedor principal */}
                <div className="flex-1 h-full">
                    <ApartamentoProvider>
                        <PropietariosProvider>
                            <VisitaProvider>
                                {children}
                            </VisitaProvider>
                        </PropietariosProvider>
                    </ApartamentoProvider>
                </div>
            </main >
        </div >
    );
}
