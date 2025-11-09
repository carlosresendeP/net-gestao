"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "../components/input";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro(null); // Limpar erro ao digitar
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const response = await fetch("/api/membros/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Erro ao fazer login");
        return;
      }

      if (data.success) {
        // Armazenar informações do membro e token no localStorage
        localStorage.setItem("member", JSON.stringify(data.member));
        localStorage.setItem("authToken", data.token);

        console.log("✅ Login bem-sucedido:", data.member);
        console.log("🔑 Token armazenado:", data.token);

        // Redirecionar para a página de membros
        router.push("/membros");
      }
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
      setErro("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-semibold text-center mb-4 text-white">
          Bem-vindo👋
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Entre com suas credenciais
        </p>

        {erro && (
          <div className="bg-red-900/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center">
          Esqueceu sua senha?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Recuperar
          </a>
        </p>
      </motion.div>
    </div>
  );
}
