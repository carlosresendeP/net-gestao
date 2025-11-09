import Link from "next/link";


export default function Home() {
  return (

    
    <div className="w-full h-screen">
      <main className=" w-full min-h-screen  bg-gray-950 px-4 flex flex-col items-center justify-center lg:px-32 py-16">

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full text-center ">
          <h1 className="text-6xl font-bold text-white">A plataforma Definitiva para gerir e expandir seus grupos de Network</h1>
          <p className="text-gray-300 mt-4 text-lg">
            Otimize a gestão do seu grupo de networking com nossa plataforma intuitiva e eficiente.
          </p>
        

          <div className="mt-10 flex gap-4">
            <Link href="/cadastro" className="font-bold text-lg w-sm text-white bg-gray-800 hover:bg-blue-500 px-4 py-3 rounded-lg mt-6">
            Começe agora
            </Link>
            <Link href="/login" className="font-bold text-lg w-sm text-white bg-gray-800 hover:bg-blue-500 px-4 py-3 rounded-lg mt-6">
            Já é membro? Faça login
            </Link>
          </div>

          </div>
      </main>
    </div>
  );
}
