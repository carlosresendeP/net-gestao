"use client";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";

type Intencao = {
    id: string;
    nome: string;
    email: string;
    empresa?: string;
    motivo: string;
    status: string;
    createdAt: string;
};

export default function AdminPage() {
    const [auth, setAuth] = useState("");
    const [intencoes, setIntencoes] = useState<Intencao[]>([]);
    const [loading, setLoading] = useState(false);
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState(false);


    //carregar as intenções
    const carregarIntencoes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/intencoes?auth=${auth}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setIntencoes(data);
        } catch {
            alert("Erro ao carregar intenções. Verifique sua chave de admin.");
        } finally {
            setLoading(false);
        }
    }, [auth]);


    //atualizar o status da intenção
    async function atualizarStatus(id: string, status: string) {
        try {

            const res = await fetch(`/api/intencoes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, auth }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("❌ Erro na resposta:", errorData);
                throw new Error(errorData.error || "Erro ao atualizar");
            }

            const data = await res.json();
            console.log("✅ Status atualizado:", data);

            // Simular envio de email após aprovação
            if (status === "aprovado") {
                console.log("📧 ========== ENVIO DE EMAIL ==========");
                console.log(`📧 Para: ${data.email}`);
                console.log(`📧 Assunto: Sua intenção foi aprovada!`);
                console.log(`📧 Mensagem:`);
                console.log(`   Olá ${data.nome},`);
                console.log(`   `);
                console.log(`   Sua intenção de participação foi aprovada!`);
                console.log(`   Em breve você receberá um link para completar seu cadastro.`);
                console.log(`   `);
                console.log(`   Obrigado!`);
                console.log("📧 ====================================");
            }

            // Recarregar a lista de intenções
            await carregarIntencoes();
        } catch (error) {
            console.error("❌ Erro ao atualizar status:", error);
            alert("Erro ao atualizar status.");
        }
    }

    //verificar a senha
    async function verificarSenha() {
        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ senha }),
            });

            const data = await response.json();

            if (data.valid) {
                setAuth(senha);
                setErro(false);

            } else {
                setErro(true);

            }
        } catch (error) {
            console.error("❌ Erro ao validar senha:", error);
            setErro(true);
        }
    }


    //carregar as intenções ao autenticar
    useEffect(() => {
        if (auth) {
            carregarIntencoes();
        }
    }, [auth, carregarIntencoes]);


    //verificar autenticação com a senha do admin
    if (!auth) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6">
                <div className="flex flex-col items-center justify-center w-sm">
                    <h1 className="text-2xl mb-4 font-bold">Área do Administrador</h1>
                    <input
                        type="password"
                        placeholder="Insira sua chave"
                        value={senha}
                        onChange={(e) => {
                            setSenha(e.target.value);
                            setErro(false);
                        }}
                        className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-center"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                verificarSenha();
                            }
                        }}
                    />
                    {erro && (
                        <p className="text-red-500 text-sm mt-2">Chave incomparivel, tente novamente</p>
                    )}
                    <Button
                        onClick={verificarSenha}
                        className={`mt-4 w-full ${erro ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                            } text-white px-4 py-2 rounded hover:cursor-pointer hover:shadow-lg transition-all duration-200`}
                    >
                        Entrar
                    </Button>
                </div>
            </div>
        );
    }

    async function gerarConvite(id: string) {
        try {
            const res = await fetch("/api/convite/gerar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ intencaoId: id, auth }),
            });

            if (!res.ok) {
                throw new Error("Erro ao gerar convite");
            }

            const data = await res.json();

            // Copiar URL para clipboard
            await navigator.clipboard.writeText(data.url);

            alert(`✅ Convite gerado!\n\nURL copiada para clipboard:\n${data.url}`);

        } catch (error) {
            console.error("Erro:", error);
            alert("❌ Erro ao gerar convite");
        }
    }

    //renderizar as intenções após autenticação
    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold mb-6">Intenções Submetidas</h1>

                <button
                    onClick={carregarIntencoes}
                    disabled={loading}
                    className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    {loading ? "Carregando..." : "Recarregar Lista"}
                </button>

                <div className="space-y-4">
                    {intencoes.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-start"
                        >
                            <div>
                                <p className="font-semibold">{item.nome}</p>
                                <p className="text-sm text-gray-400">{item.email}</p>
                                {item.empresa && <p className="text-sm text-gray-400">{item.empresa}</p>}
                                <p className="mt-2 text-gray-300">{item.motivo}</p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Enviado em {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${item.status === "pendente"
                                        ? "bg-yellow-700 text-yellow-200"
                                        : item.status === "aprovado"
                                            ? "bg-green-700 text-green-200"
                                            : "bg-red-700 text-red-200"
                                        }`}
                                >
                                    {item.status.toUpperCase()}
                                </span>

                                {item.status === "pendente" && (
                                    <>
                                        <button
                                            onClick={() => atualizarStatus(item.id, "aprovado")}
                                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                                        >
                                            Aprovar
                                        </button>
                                        <button
                                            onClick={() => atualizarStatus(item.id, "recusado")}
                                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                        >
                                            Recusar
                                        </button>
                                    </>
                                )}

                                {item.status === "aprovado" && (
                                    <Button
                                        onClick={() => gerarConvite(item.id)}
                                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                                    >
                                        🔗 Gerar Convite
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    {intencoes.length === 0 && (
                        <p className="text-gray-400 text-center mt-10">Nenhuma intenção encontrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
