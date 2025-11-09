import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function SuccessCard() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8 space-y-6 text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center"
            >
                <div className="bg-green-600/20 p-4 rounded-full">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
            </motion.div>

            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white">
                    Obrigado por se inscrever!
                </h2>

                <p className="text-gray-300 text-lg">
                    Sua intenção foi enviada com sucesso.
                </p>

                <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mt-6">
                    <p className="text-blue-300 text-sm">
                        📧 Aguarde a aprovação do administrador
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        Assim que aprovado, você receberá um link por email para completar seu cadastro.
                    </p>
                </div>

                <div className="pt-6">
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                        <span>Você pode fechar esta página</span>
                        <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
