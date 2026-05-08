"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase";
import { generateSlug } from "@/lib/data";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        // Cadastro
        const name = albumName || `Álbum de ${email.split("@")[0]}`;
        const slug = generateSlug(name) + "-" + Math.random().toString(36).slice(2, 6);

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name },
          },
        });

        if (signUpError) throw signUpError;

        // Criar álbum via API
        if (data.user) {
          const res = await fetch("/api/album", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, slug }),
          });
          if (!res.ok) {
            const d = await res.json();
            console.error("Erro ao criar álbum:", d);
          }
        }

        setMessage("Conta criada com sucesso! Redirecionando...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-3xl">🏆</span>
        <span className="font-bebas text-3xl text-yellow-400 tracking-wide">
          Álbum Copa 2026
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-dark-card border border-dark-border rounded-2xl p-8">
        {/* Tabs */}
        <div className="flex bg-dark rounded-xl p-1 mb-6">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); setMessage(null); }}
              className={`
                flex-1 py-2 rounded-lg font-bebas text-lg transition-all
                ${mode === m ? "bg-yellow-400 text-black shadow-gold-sm" : "text-gray-400 hover:text-white"}
              `}
            >
              {m === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

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
                Nome do seu álbum
              </label>
              <input
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                placeholder="Ex: Álbum do Benício"
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors font-nunito"
              />
              {albumName && (
                <p className="text-gray-500 text-xs mt-1 font-nunito">
                  Link: /album/{generateSlug(albumName)}-xxxx
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-400 text-sm font-nunito">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-900/30 border border-green-700 rounded-xl p-3 text-green-400 text-sm font-nunito">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bebas text-xl py-3 rounded-xl hover:bg-yellow-300 transition-all active:scale-95 shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : mode === "login" ? "Entrar" : "Criar minha conta"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-dark-border" />
          <span className="text-gray-600 text-sm font-nunito">ou</span>
          <div className="flex-1 h-px bg-dark-border" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-dark border border-dark-border rounded-xl py-3 text-white hover:border-gray-500 transition-all active:scale-95 font-nunito disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.