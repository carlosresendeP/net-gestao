"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "../components/input";

type ValidarResponse =
    | {
        valid: true;
        convite?: string;
        intencao?:
        { nome?: string; email?: string; empresa?: string; motivo?: string }
    }
    | { valid: false; reason?: string }
    | { error: string };

function CadastroFinalContent() {
    const sp = useSearchParams();
    const router = useRouter();
    const token = sp.get("token");
    const intencaoId = sp.get("id"); // id da intenção vinculada ao convite

    const [validando, setValidando] = useState(false);
    const [valido, setValido] = useState<boolean | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [erroEmail, setErroEmail] = useState<string | null>(null);
    const [erroPassword, setErroPassword] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        empresa: "",
        cargo: "",
        telefone: "",
        password: "",
    });

    // Validação do token + vinculação ao id
    useEffect(() => {
        async function validar() {
            if (!token) {
                setErro("Token não informado.");
                setValido(false);
                return;
            }
            setValidando(true);
            setErro(null);
            try {
                const qs = new URLSearchParams({ token });
                if (intencaoId) qs.set("intencaoId", intencaoId);

                const res = await fetch(`/api/convite/validar?${qs.toString()}`);
                const data: ValidarResponse = await res.json();

                if ("error" in data) {
                    setErro(data.error);
                    setValido(false);
                    return;
                }

                if (data.valid === true) {
                    setValido(true);
                    // Pré-preencher se a API retornar dados da intenção
                    if (data.intencao) {
                        setFormData((prev) => ({
                            ...prev,
                            nome: data.intencao?.nome || "",
                            email: data.intencao?.email || "",
                            empresa: data.intencao?.empresa || "",
                            motivo: data.intencao?.motivo || "",
                        }));
                    }
                } else {
                    const reason = data.reason || "inválido";
                    setErro(
                        reason === "usado"
                            ? "Este token já foi utilizado."
                            : reason === "expirado"
                                ? "Este token expirou."
                                : reason === "inexistente"
                                    ? "Token não encontrado."
                                    : "Token inválido."
                    );
                    setValido(false);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setErro("Falha ao validar o token. Tente novamente.");
                setValido(false);
            } finally {
                setValidando(false);
            }
        }

        validar();
    }, [token, intencaoId]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!token || valido !== true) return;

        setEnviando(true);
        setErro(null);
        setErroEmail(null);
        setErroPassword(null);

        // Validação da senha no frontend
        if (!formData.password || formData.password.trim().length < 6) {
            setErroPassword("A senha deve ter no mínimo 6 caracteres");
            setEnviando(false);
            return;
        }

        try {
            const payload = {
                //trim => remove espaços desnecessários
                token,
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                password: formData.password?.trim(),
                empresa: formData.empresa.trim() || null,
                cargo: formData.cargo.trim() || null,
                telefone: formData.telefone.trim() || null,
            };

            // Fazer a requisição para registrar o membro
            const res = await fetch("/api/convite/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            // Verificar resposta
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const errorMessage = err.error || "Falha ao registrar";

                // Se o erro for relacionado ao email, mostrar no campo de email
                if (errorMessage.toLowerCase().includes("email")) {
                    setErroEmail(errorMessage);
                } else if (errorMessage.toLowerCase().includes("senha")) {
                    setErroPassword(errorMessage);
                } else {
                    setErro(errorMessage);
                }
                throw new Error(errorMessage);
            }

            alert("✅ Registro concluído! Redirecionando para a página de membros...");

            // Redirecionar para a página de membros
            router.push("/membros");

        } catch (e) {
            // Erro já foi tratado acima
            console.error("Erro no cadastro:", e);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
            >
                <h1 className="text-3xl font-semibold text-center text-white">Cadastro Final</h1>
                <p className="text-gray-400 text-center">
                    Confirme seus dados para concluir o cadastro.
                </p>

                {/* Estados de validação do token */}
                {validando && (
                    <div className="text-center text-blue-400 py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        Validando token...
                    </div>
                )}

                {!validando && valido === false && (
                    <div className="text-center py-8">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <p className="text-red-500 font-medium text-lg">
                            {erro || "Token inválido."}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Entre em contato com o administrador para obter um novo convite.
                        </p>
                    </div>
                )}


                {/* Formulário só aparece se token for válido */}
                {!validando && valido === true && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Nome completo"
                            name="nome"
                            type="text"
                            required
                            value={formData.nome}
                            onChange={handleChange}
                        />

                        <div>
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {erroEmail && (
                                <p className="text-red-500 text-sm mt-1">
                                    {erroEmail}
                                </p>
                            )}
                        </div>

                        <div>
                            <Input
                                label="Senha"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {erroPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {erroPassword}
                                </p>
                            )}
                        </div>

                        <Input
                            label="Empresa"
                            name="empresa"
                            type="text"
                            value={formData.empresa}
                            onChange={handleChange}
                        />
                        <Input
                            label="Cargo"
                            name="cargo"
                            type="text"
                            value={formData.cargo}
                            onChange={handleChange}
                        />
                        <Input
                            label="Telefone"
                            name="telefone"
                            type="text"
                            value={formData.telefone}
                            onChange={handleChange}
                        />

                        <button
                            type="submit"
                            disabled={enviando}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition ${enviando ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {enviando ? "Enviando..." : "Concluir cadastro"}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}

export default function CadastroFinalPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white">Carregando...</div>
            </div>
        }>
            <CadastroFinalContent />
        </Suspense>
    );
}