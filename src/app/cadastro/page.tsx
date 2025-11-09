"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../components/input";
import { SuccessCard } from "../components/SuccessCard";

export default function IntencaoPage() {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEmail, setErroEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    empresa: "",
    motivo: "",
  });

  // cadastro da intenção no sistema  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErroEmail(null);

    try {
      const response = await fetch("/api/intencoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const errorMessage = err.error || "Erro ao enviar";

        // Se o erro for relacionado ao email, mostrar no campo de email
        if (errorMessage.toLowerCase().includes("email")) {
          setErroEmail(errorMessage);
        } else {
          alert(`❌ ${errorMessage}`);
        }
        throw new Error(errorMessage);
      }

      await response.json();
      setEnviado(true);
      setFormData({ nome: "", email: "", empresa: "", motivo: "" });
    } catch (error) {
      console.error("Erro ao enviar intenção:", error);
      // Erro já tratado acima
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }



  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">

        {/* Mostrar card de sucesso se enviado */}
        {enviado ? (
          <SuccessCard />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
          >
            <h1 className="text-3xl font-semibold text-center mb-4 text-white">
              Cadastre a sua intenção
            </h1>
            <p className="text-gray-400 text-center mb-6">
              Preencha o formulário abaixo
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nome completo"
                name="nome"
                type="text"
                required
                placeholder="Seu nome"
                value={formData.nome}
                onChange={handleChange}
              />

              <div>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {erroEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {erroEmail}
                  </p>
                )}
              </div>

              <Input
                label="Empresa (opcional)"
                name="empresa"
                type="text"
                placeholder="Nome da empresa"
                value={formData.empresa}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Motivo da intenção
                </label>
                <textarea
                  name="motivo"
                  required
                  rows={4}
                  placeholder="Descreva o motivo..."
                  value={formData.motivo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar intenção"}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}