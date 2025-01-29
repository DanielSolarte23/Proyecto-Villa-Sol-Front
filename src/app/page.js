"use client"

import { useForm } from "react-hook-form";
import { useAuth } from "@/app/context/authContext";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
// import { Link } from 'next/link';

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    user,
    isAuthenticated,
    loading,
    error,
    login,
  } = useAuth();


  const [mounted, setMounted] = useState(false);

  const onSubmit = handleSubmit((data) => {
    login(data);
  });

  const router = useRouter();


  useEffect(() => {
    setMounted(true);

    if (isAuthenticated && user) {
      if (user.role === 'administrador') {
        router.push('/auths/admin');
      } else if (user.role === 'personal de seguridad') {
        router.push('/auths/seguridad');
      }
    }
  }, [loading, isAuthenticated, router, user]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-screen w-screen log flex pb-2 flex-col items-center">
      <div className="2xl:h-36 xl:mt-3 xl:h-40 h-20 py-5">
        <img className="h-full object-contain" src="/images/VIlla_del_sol2.png" alt="Logo villa del sol" />
      </div>
      <div className="lg:h-4/6 lg:w-1/3 h-full rounded-lg filter shadow-2xl border" >
        <div className="2xl:py-5 px-10 rounded-xl h-full shadow-2xl py-5 ">
          <h1 className="text-3xl font-bold h-[15%] text-zinc-800 flex items-center">
            Inicio Sesión
          </h1>
          <form onSubmit={onSubmit} className="h-[75%]">

            <div className="h-[40%]">
              <input
                type="text"
                {...register("username", { required: true })}
                className="w-full bg-transparent border outline-none text-xl text-rojo px-4 py-2 rounded-md h-[70%]  shadow-xl placeholder:text-zinc-800"
                placeholder="Correo"
                autoComplete="off"
              />
              {errors.username && (
                <p className="text-red-500 text-sm 2xl:text-lg">El nombre de usuario es requerido</p>
              )}
            </div>

            <div className="h-[40%]">
              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full bg-transparent border outline-none text-xl text-rojo px-4 py-2 rounded-md h-[70%] placeholder:text-zinc-800 shadow-xl"
                placeholder="Contraseña"
              />
              <div className="w-full h-[10%]">
                {errors.password && (
                  <p className="text-red-500 text-sm 2xl:text-lg">
                    La contraseña es requerida
                  </p>
                )}
              </div>
            </div>
            <div className="h-[20%] flex items-center">
              <button
                className="transition bg-rojo px-3 w-full  h-full py-1 rounded-md hover:bg-zinc-800 hover:text-rojo text-2xl text-zinc-800 font-semibold"
                type="submit"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
          <div className="h-[10%]">
            {/* {error.map((error, i) => (
              <div className="text-red-500" key={i}>
                {error}
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}
