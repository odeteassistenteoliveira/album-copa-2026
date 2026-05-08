"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const supabase = createBrowserClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
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
        <h1 className="font-bebas text-2xl text-white mb-2">Recuperar Senha</h1>
        <p className="text-gray-400 text-sm font-nunito mb-6">
          Digite seu email e enviaremos um link para criar uma nova senha.
        </p>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <p className="text-green-400 font-nunito text-sm mb-6">
              Email enviado! Verifique sua caixa de entrada e clique no link para redefinir sua senha.
            </p>
            <Link
              href="/login"
              className="text-yellow-400 hover:text-yellow-300 font-nunito text-sm underline"
            >
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1 font-nunito">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
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
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>

            <Link
              href="/login"
              className="block text-center text-gray-500 hover:text-gray-300 font-nunito text-sm transition-colors"
            >
              ← Voltar para o login
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
