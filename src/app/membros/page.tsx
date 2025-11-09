"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Users,
    CheckCircle,
    Clock,
    XCircle,
    Phone
} from "lucide-react";

// Definições de tipos
interface Member {
    id: string;
    nome: string;
    email: string;
    empresa: string | null;
    cargo: string | null;
    telefone: string | null;
}

interface Indicacao {
    id: string;
    empresaContato: string;
    descricao: string;
    status: string;
    createdAt: string;
    membroIndicador?: { nome: string; email: string; empresa: string | null };
    membroIndicado?: { nome: string; email: string; empresa: string | null };
}

// Página de membros e dashboard
export default function MembersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [membro, setMembro] = useState<Member | null>(null);
    const [membros, setMembros] = useState<Member[]>([]);
    const [indicacoesFeitas, setIndicacoesFeitas] = useState<Indicacao[]>([]);
    const [indicacoesRecebidas, setIndicacoesRecebidas] = useState<Indicacao[]>([]);
    const [showNovaIndicacao, setShowNovaIndicacao] = useState(false);
    const [formData, setFormData] = useState({
        membroIndicadoId: "",
        empresaContato: "",
        descricao: "",
    });



    async function verificarAutenticacao() {
        const membroData = localStorage.getItem("member");
        const token = localStorage.getItem("authToken");

        if (!membroData || !token) {
            router.push("/login");
            return;
        }

        const membroObj = JSON.parse(membroData);
        setMembro(membroObj);

        await carregarDados(membroObj.id);
    }

    useEffect(() => {
        verificarAutenticacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function carregarDados(membroId: string) {
        setLoading(true);
        try {
            // Carregar indicações
            const resIndicacoes = await fetch(`/api/indicacoes?membroId=${membroId}`);
            if (resIndicacoes.ok) {
                const data = await resIndicacoes.json();
                setIndicacoesFeitas(data.feitas);
                setIndicacoesRecebidas(data.recebidas);
            }

            // Carregar lista de membros
            const resMembros = await fetch("/api/membros");
            if (resMembros.ok) {
                const membrosData = await resMembros.json();
                setMembros(membrosData.filter((m: Member) => m.id !== membroId));
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
    }

    async function criarIndicacao(e: React.FormEvent) {
        e.preventDefault();
        if (!membro) return;

        try {
            const res = await fetch("/api/indicacoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    membroIndicadorId: membro.id,
                    ...formData,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                alert(`❌ ${err.error}`);
                return;
            }

            alert("✅ Indicação criada com sucesso!");
            setFormData({ membroIndicadoId: "", empresaContato: "", descricao: "" });
            setShowNovaIndicacao(false);
            carregarDados(membro.id);
        } catch (error) {
            console.error("Erro ao criar indicação:", error);
            alert("❌ Erro ao criar indicação");
        }
    }

    async function atualizarStatus(indicacaoId: string, novoStatus: string) {
        if (!membro) return;

        try {
            const res = await fetch(`/api/indicacoes/${indicacaoId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: novoStatus }),
            });

            if (!res.ok) {
                throw new Error("Erro ao atualizar status");
            }

            alert("✅ Status atualizado!");
            carregarDados(membro.id);
        } catch (error) {
            console.error("Erro:", error);
            alert("❌ Erro ao atualizar status");
        }
    }

    function logout() {
        localStorage.removeItem("member");
        localStorage.removeItem("authToken");
        router.push("/login");
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "nova": return "bg-blue-500/20 text-blue-400";
            case "em_contato": return "bg-yellow-500/20 text-yellow-400";
            case "fechada": return "bg-green-500/20 text-green-400";
            case "recusada": return "bg-red-500/20 text-red-400";
            default: return "bg-gray-500/20 text-gray-400";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "nova": return <Clock className="w-4 h-4" />;
            case "em_contato": return <Phone className="w-4 h-4" />;
            case "fechada": return <CheckCircle className="w-4 h-4" />;
            case "recusada": return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "nova": return "Nova";
            case "em_contato": return "Em Contato";
            case "fechada": return "Fechada";
            case "recusada": return "Recusada";
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!membro) return null;

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-gray-400">Bem-vindo, {membro.nome}!</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                    >
                        Sair
                    </button>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Indicações Feitas</p>
                                <p className="text-2xl font-bold">{indicacoesFeitas.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <Users className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Indicações Recebidas</p>
                                <p className="text-2xl font-bold">{indicacoesRecebidas.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Fechadas</p>
                                <p className="text-2xl font-bold">
                                    {[...indicacoesFeitas, ...indicacoesRecebidas].filter(i => i.status === "fechada").length}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Botão Nova Indicação */}
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowNovaIndicacao(!showNovaIndicacao)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                    >
                        + Nova Indicação
                    </button>
                </div>

                {/* Formulário Nova Indicação */}
                {showNovaIndicacao && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-bold mb-4">Criar Nova Indicação</h2>
                        <form onSubmit={criarIndicacao} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Membro Indicado *
                                </label>
                                <select
                                    required
                                    value={formData.membroIndicadoId}
                                    onChange={(e) => setFormData({ ...formData, membroIndicadoId: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecione um membro</option>
                                    {membros.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nome} - {m.empresa || "Sem empresa"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Empresa/Contato Indicado *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nome da empresa ou contato"
                                    value={formData.empresaContato}
                                    onChange={(e) => setFormData({ ...formData, empresaContato: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Descrição da Oportunidade *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Descreva a oportunidade de negócio..."
                                    value={formData.descricao}
                                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                                >
                                    Criar Indicação
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNovaIndicacao(false);
                                        setFormData({ membroIndicadoId: "", empresaContato: "", descricao: "" });
                                    }}
                                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Indicações Feitas */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Indicações que Fiz</h2>
                    <div className="space-y-4">
                        {indicacoesFeitas.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Nenhuma indicação feita ainda.</p>
                        ) : (
                            indicacoesFeitas.map((ind) => (
                                <motion.div
                                    key={ind.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">{ind.empresaContato}</h3>
                                            <p className="text-gray-400 text-sm">
                                                Para: {ind.membroIndicado?.nome} ({ind.membroIndicado?.empresa || "Sem empresa"})
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(ind.status)}`}>
                                            {getStatusIcon(ind.status)}
                                            {getStatusLabel(ind.status)}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-4">{ind.descricao}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => atualizarStatus(ind.id, "em_contato")}
                                            disabled={ind.status !== "nova"}
                                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition"
                                        >
                                            Marcar Em Contato
                                        </button>
                                        <button
                                            onClick={() => atualizarStatus(ind.id, "fechada")}
                                            disabled={ind.status === "fechada"}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition"
                                        >
                                            Marcar Fechada
                                        </button>
                                        <button
                                            onClick={() => atualizarStatus(ind.id, "recusada")}
                                            disabled={ind.status === "recusada"}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition"
                                        >
                                            Marcar Recusada
                            </button>
                        </div>
                    </motion.div>
                ))
            )}
                    </div>
                </div>

                {/* Indicações Recebidas */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Indicações que Recebi</h2>
                    <div className="space-y-4">
                        {indicacoesRecebidas.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Nenhuma indicação recebida ainda.</p>
                        ) : (
                            indicacoesRecebidas.map((ind) => (
                                <motion.div
                                    key={ind.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">{ind.empresaContato}</h3>
                                            <p className="text-gray-400 text-sm">
                                                De: {ind.membroIndicador?.nome} ({ind.membroIndicador?.empresa || "Sem empresa"})
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(ind.status)}`}>
                                            {getStatusIcon(ind.status)}
                                            {getStatusLabel(ind.status)}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-4">{ind.descricao}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => atualizarStatus(ind.id, "em_contato")}
                                            disabled={ind.status !== "nova"}
                                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition"
                                        >
                                            Marcar Em Contato
                                        </button>
                                        <button
                                            onClick={() => atualizarStatus(ind.id, "fechada")}
                                            disabled={ind.status === "fechada"}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition"
                                        >
                                            Marcar Fechada
                                        </button>
                                        <button
                                            onClick={() => atualizarStatus(ind.id, "recusada")}
                                            disabled={ind.status === "recusada"}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition"
                                        >
                                            Marcar Recusada
                                        </button>
                                    </div>
                    </motion.div>
                ))
            )}
                    </div>
                </div>
            </div>
        </div>
    );
}