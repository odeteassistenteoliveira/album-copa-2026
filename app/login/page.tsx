"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            setError("Email ainda não confirmado. Verifique sua caixa de entrada.");
          } else if (error.message.includes("Invalid login credentials")) {
            setError("Email ou senha incorretos. Verifique seus dados e tente novamente.");
          } else {
            setError(error.message);
          }
          return;
        }
        router.push("/dashboard");
        router.refresh();
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, albumName }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erro ao criar conta.");
          return;
        }

        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          setError("Conta criada! Agora faça login com seus dados.");
          setMode("login");
          return;
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-3xl">🏆</span>
        <span className="font-bebas text-3xl text-yellow-400 tracking-wide">
          Álbum Copa 2026
        </span>
      </Link>

      <div className="w-full max-w-sm bg-dark-card border border-dark-border rounded-2xl p-8">
        <div className="flex bg-dark rounded-xl p-1 mb-6">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              className={`flex-1 py-2 rounded-lg font-bebas text-lg transition-all ${
                mode === m ? "bg-yellow-400 text-black shadow-gold-sm" : "text-gray-400 hover:text-white"
              }`}
            >
              {m === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1 font-nunito">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors font-nunito"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-gray-400 text-sm font-nunito">Senha</label>
              {mode === "login" && (
                <Link
                  href="/forgot-password"
                  className="text-yellow-400 hover:text-yellow-300 text-xs font-nunito transition-colors"
                >
                  Esqueci minha senha
                </Link>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors font-nunito"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-gray-400 text-sm mb-1 font-nunito">
                Nome do álbum <span className="text-gray-600">(opcional)</span>
              </label>
              <input
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                placeholder="Ex: Álbum do Renan"
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors font-nunito"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-400 text-sm font-nunito">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bebas text-xl py-3 rounded-xl hover:bg-yellow-300 transition-all active:scale-95 shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? (mode === "register" ? "Criando conta..." : "Entrando...")
              : (mode === "login" ? "Entrar" : "Criar minha conta")}
          </button>
        </form>
      </div>
    </main>
  );
}
