"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2500);
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
        <h1 className="font-bebas text-2xl text-white mb-2">Nova Senha</h1>
        <p className="text-gray-400 text-sm font-nunito mb-6">
          Escolha uma nova senha para sua conta.
        </p>

        {done ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-green-400 font-nunito text-sm">
              Senha atualizada com sucesso! Redirecionando...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1 font-nunito">
                Nova senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors font-nunito"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1 font-nunito">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                placeholder="Repita a senha"
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors font-nunito"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-400 text-sm font-nunito">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-bebas text-xl py-3 rounded-xl hover:bg-yellow-300 transition-all active:scale-95 shadow-gold disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
