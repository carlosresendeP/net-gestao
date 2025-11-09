import { Mail, Phone, Linkedin, User, X } from "lucide-react";

interface ContactCardProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactCard({ isOpen, onClose }: ContactCardProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay/Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Card Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[650px] px-4 animate-in zoom-in-95 duration-200">
                <div className="bg-linear-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-2xl border border-gray-700 relative">
                    {/* Botão Fechar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold">Carlos Paula</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 hover:bg-gray-700/50 p-3 rounded-lg transition-all duration-200">
                            <div className="bg-blue-600/20 p-2 rounded-lg">
                                <Mail className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Email</p>
                                <p className="text-gray-200 font-medium">dev.carlosresende@hotmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 hover:bg-gray-700/50 p-3 rounded-lg transition-all duration-200">
                            <div className="bg-green-600/20 p-2 rounded-lg">
                                <Phone className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Telefone</p>
                                <p className="text-gray-200 font-medium">+55 32 99828-3189</p>
                            </div>
                        </div>

                        <a
                            href="www.linkedin.com/in/carlos-paula2001"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 hover:bg-gray-700/50 p-3 rounded-lg transition-all duration-200 cursor-pointer group"
                        >
                            <div className="bg-blue-500/20 p-2 rounded-lg">
                                <Linkedin className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">LinkedIn</p>
                                <p className="text-gray-200 font-medium group-hover:text-blue-400 transition-colors">
                                    Conecte-se comigo
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}