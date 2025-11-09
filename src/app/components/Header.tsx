"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
    onContactClick: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
    const pathname = usePathname();

    // O botão voltar só aparece no admin e na interação
    const showBackButton = pathname === "/admin" || pathname === "/cadastro" || pathname === "/login";

    return (
        <header className="w-full bg-gray-950 shadow-lg p-4 flex justify-between items-center lg:px-32">
            <h1 className="text-ls font-bold text-gray-100 dark:text-zinc-200">
                Gestão para Grupos de Networking
            </h1>
            <ul className="flex items-center justify-center gap-3">
                {showBackButton && (
                    <li className="bg-gray-800 w-fit rounded-xl p-2 hover:bg-blue-500 hover:border-blue-600 transition-all">
                        <Link href={'/'} className="text-sm font-semibold text-white flex items-center justify-center gap-2">
                            <LogOut /> Voltar
                        </Link>
                    </li>
                )}
                <li>
                    <Button
                        onClick={onContactClick}
                        className="font-bold text-sm bg-blue-600 px-4 py-3 rounded-lg text-white hover:bg-blue-900 transition-colors"
                    >
                        Contato
                    </Button>
                </li>
            </ul>
        </header>
    );
}
