import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ImageWithFallback } from "./ImageWithFallback";

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        email: email,
        password: password,
      });

      const { token, user } = response.data;

      // Guarda o token no localStorage
      localStorage.setItem("token", token);

      // Devolve o user autenticado para o App
      onLogin(user);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Falha ao iniciar sessão. Verifique as credenciais."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0057D9] to-[#003A8C]">
      <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <ImageWithFallback src="/logo.png" />
          </div>
          <h1 className="text-center text-[#2B2B2B] mb-2">
            Sistema de Gestão de Relatórios Técnicos
          </h1>
          <p className="text-sm text-gray-500">CM Reports</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Utilizador</Label>
            <Input
              id="username"
              type="email"
              placeholder="Insira o seu email de utilizador"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Insira a sua palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0057D9] hover:bg-[#003A8C] text-white transition-colors"
          >
            {loading ? "A entrar..." : "Entrar"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            Carlos Mateus Comércio e Serviços, Lda – 2025
          </p>
        </div>
      </div>
    </div>
  );
}
