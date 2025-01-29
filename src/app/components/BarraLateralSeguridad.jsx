import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";
import { usePathname } from 'next/navigation';

function BarraLateralSeguridad() {
    const pathname = usePathname(); 

    console.log("Esta es la ruta", pathname); 

    return (
        <div className='h-full w-full px-2 py-2 bg-white'>
            <ul className='h-full w-full grid grid-rows-6 gap-2'>
                {/* Apartamentos */}
                <Link 
                    href="/auths/seguridad"
                    className={`rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-zinc-800 transition-colors gap-2 ${pathname === "/auths/seguridad" ? 'bg-zinc-800' : 'bg-rojo'}`}
                >
                    <i className="fa-solid fa-building"></i>
                    <p>Apartamentos</p>
                </Link>
                {/* Propietarios */}
                <Link 
                    href="/auths/seguridad/propietarios"
                    className={`rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-zinc-800 transition-colors gap-2 ${pathname === "/auths/seguridad/propietarios" ? 'bg-zinc-800' : 'bg-rojo'}`}
                >
                    <i className="fa-solid fa-building-user"></i>
                    <p>Propietarios</p>
                </Link>
                {/* Visitante */}
                <Link 
                    href="/auths/seguridad/visitantes"
                    className={`rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-zinc-800 transition-colors gap-2 ${pathname === "/auths/seguridad/visitantes" ? 'bg-zinc-800' : 'bg-rojo'}`}
                >
                    <i className="fa-solid fa-person-walking"></i>
                    <p>Visitante</p>
                </Link>
                {/* Registro de informes */}
                <Link 
                    href="/auths/seguridad/informes"
                    className={`rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-zinc-800 transition-colors gap-2 ${pathname === "/auths/seguridad/informes" ? 'bg-zinc-800' : 'bg-rojo'}`}
                >
                    <i className="fa-solid fa-book"></i>
                    <p>Registro de informes</p>
                </Link>
            </ul>
        </div>
    );
}

export default BarraLateralSeguridad;
