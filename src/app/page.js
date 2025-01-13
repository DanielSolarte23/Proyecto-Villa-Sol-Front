import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen log flex pb-2 flex-col items-center">
      <div className="2xl:h-44 xl:mt-3 xl:h-40 h-20">
        <img className="h-full object-contain " src="/images/VIlla_del_sol.png" alt="Logo villa del sol" />
      </div>
      <div className="lg:h-4/6 lg:w-1/3 h-full rounded-lg filter">
        <div className="2xl:py-5 px-10 rounded-xl h-full shadow-2xl py-5">
          <div className="h-[5%] w-full"></div>
          <h1 className="text-3xl font-bold h-[15%] text-black flex items-start">
            Inicio Sesión
          </h1>
          <form className="h-[60%]">
            <div className="h-[40%]">
              <label className="h-[10%] font-semibold">Usuario</label>
              <input
                type="email"
                // {...register("email", { required: true })}
                className="w-full bg-transparent border border-orange-400 outline-none text-xl text-orange-400 px-4 py-2 rounded-md h-[60%]  shadow-xl placeholder:text-white"
                placeholder="Ingresa el usuario"
              />
              {/* {errors.email && (
                  <p className="text-red-500 text-sm">El correo es requerido</p>
                )} */}
            </div>
            <div className="h-[40%]">
              <label className="h-[10%] font-semibold">Contraseña</label>
              <input
                type="password"
                // {...register("password", { required: true })}
                className="w-full bg-transparent border border-orange-400 outline-none text-xl text-orange-400 px-4 py-2 rounded-md h-[60%] placeholder:text-white shadow-lg"
                placeholder="Contraseña"
              />
              {/* {errors.password && (
                  <p className="text-red-500 text-sm">
                    La contraseña es requerida
                  </p>
                )} */}
            </div>
            <div className="h-[20%] flex items-center">
              <Link href="/auths/admin">
                <button
                  className="bg-orange-400 px-3 w-full h-full py-1 rounded-md hover:bg-orange-500 text-xl text-white font-semibold"
                  type="submit"
                >
                  Iniciar Sesión
                </button></Link>
            </div>
          </form>
          <div className="h-[10%] flex items-center">
            <Link
              // to="/forgot-password"
              href="#"
              className="text-orange-400 hover:text-orange-500 text-base whitespace-nowrap lg:text-lg">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="h-[10%]">
            {/* {signErrors.map((error, i) => (
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
