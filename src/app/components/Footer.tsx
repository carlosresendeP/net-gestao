export function Footer(){

    const date = new Date();
    const year = date.getFullYear();

    return(
        <footer className="w-full bg-gray-950 p-4 flex flex-col justify-center items-center ">
            <p className="text-sm text-gray-700 ">© {year} Gestão para Grupos de Networking</p>
            <p className="text-sm text-gray-700 ">Desenvolvido Por <span className="font-semibold text-blue-600">Carlos Paula</span></p>
        </footer>
    )
}