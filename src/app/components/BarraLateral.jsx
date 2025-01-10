import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";

function BarraLateral() {
    return (
        <div className='h-full w-full px-2 py-2 bg-white'>
            <ul className='h-full w-full grid grid-rows-6 gap-2'>
                <Link href="/auths/admin" className='bg-orange-500 rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-black transition-colors gap-2'><i className="fa-solid fa-building"></i><p>Apartamentos</p></Link>
                <Link href="/auths/admin/propietarios" className='bg-orange-500 rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-black transition-colors gap-2'><i className="fa-solid fa-building-user"></i> <p>Propietarios</p></Link>
                <Link href="/auths/admin/visitantes" className='bg-orange-500 rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-black transition-colors gap-2'><i className="fa-solid fa-person-walking"></i> <p>Visitante</p></Link>
                <Link href="/auths/admin/pagos" className='bg-orange-500 rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-black transition-colors gap-2'><i className="fa-solid fa-hand-holding-dollar"></i> <p>Pagos</p></Link>
                <Link href="/auths/admin/informes" className='bg-orange-500 rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-black transition-colors gap-2'><i className="fa-solid fa-book"></i> <p>Registro de informes</p></Link>
                <Link href="/auths/admin/usuarios" className='bg-orange-500 rounded-md flex items-center pl-3 text-white font-medium text-lg hover:bg-black transition-colors gap-2'><i className="fa-solid fa-users"></i> <p>Gestion de usuarios</p></Link>
            </ul>
        </div>
    )
}

export default BarraLateral