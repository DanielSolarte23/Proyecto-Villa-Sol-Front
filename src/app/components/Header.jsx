import { useAuth } from '../context/authContext';
import { useState, useRef, useEffect } from 'react';
import "@fortawesome/fontawesome-free"
import Link from 'next/link';


function Header({ onToggle }) {
    const { user, logout } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    const handleToggleModal = () => {
        setModalVisible((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Cierra el modal si se hace clic fuera del modal
            if (!event.target.closest('.modal') && modalVisible) {
                setModalVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalVisible]);

    return (
        <div className="w-screen h-[12%] flex justify-between items-center px-10 shadow-lg relative">
            <div className="h-full py-2 flex items-center">
                <img
                    className="h-[50%] sm:h-[90%] object-contain"
                    src="/images/VIlla_del_sol2.png"
                    alt="Villa del Sol"
                />
            </div>

            <div className="flex gap-4 items-center">
                <p className='text-zinc-800 text-xl hidden md:block'>{user.name}</p>
                {/* Este es el div que alterna el modal */}
                <div
                    onClick={handleToggleModal} // Alterna el estado del modal
                    className="text-white hidden md:block md:text-2xl font-medium bg-rojo px-4 py-2 rounded-full cursor-pointer"
                >
                    {user.name[0]}
                </div>
            </div>

            {/* Botón hamburguesa */}
            <div
                onClick={onToggle}
                className="w-10 h-10 bg-rojo md:hidden flex justify-center items-center text-lg rounded-md"
            >
                <i className="fa-solid fa-bars text-vinotinto"></i>
            </div>

            {/* Modal */}
            {modalVisible && (
                <div
                    className="modal absolute top-20 right-10 bg-white border rounded-md p-4 z-50 shadow-xl"
                >
                    <ul>
                        <li
                            className="py-2 hover:bg-gray-200 cursor-pointer flex gap-2 items-center px-2 rounded-md"
                            onClick={handleToggleModal} // Cierra el modal cuando se hace clic en "Perfil"
                        >
                            <Link
                                href={user?.role === "administrador" ? "/auths/admin/perfil" : "/auths/seguridad/perfil"}
                                className="w-full h-full"
                            >
                                <i className="fa-solid fa-user"></i> Perfil
                            </Link>
                        </li>
                        <hr />
                        <li
                            className="py-2 hover:bg-gray-200 cursor-pointer flex gap-2 items-center px-2 rounded-md"
                            onClick={() => {
                                logout && logout();
                                handleToggleModal(); 
                            }}
                        >
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            Cerrar Sesión
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Header;
