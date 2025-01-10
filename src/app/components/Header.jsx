import Image from 'next/image';

function Header({ onToggle }) {
    return (
        <div className='w-screen h-[12%] flex justify-between  items-center px-10 shadow-lg'>
            <div className='h-full'>
                <img className='h-full object-contain' src="/images/VIlla_del_sol.png" alt="" />
            </div>
            <p className='text-orange-400 hidden md:block md:text-lg font-medium'>Nombre de Usuario</p>
            <div onClick={onToggle} className='w-10 h-10 bg-orange-500 md:hidden flex justify-center items-center text-lg rounded-md'><i className="fa-solid fa-bars text-white"></i></div>
        </div>
    )
}

export default Header