"use client";

import { useState, useEffect, useCallback } from "react";
import { TradeMatch } from "@/lib/types";
import { GROUPS, SPECIAL } from "@/lib/data";

const ALL_TEAMS = [
  ...GROUPS.flatMap(g => g.teams),
  ...SPECIAL.map(s => ({ code: s.code, name: s.name, flag: s.flag }))
];

const teamName = (code: string) => ALL_TEAMS.find(t => t.code === code)?.name ?? code;
const teamFlag = (code: string) => ALL_TEAMS.find(t => t.code === code)?.flag ?? "🏳️";

export default function TrocasPage() {
  const [matches, setMatches] = useState<TradeMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasDupes, setHasDupes] = useState(false);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao buscar trocas");
      setMatches(data.matches);
      setHasDupes(data.matches.length > 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const openWhatsApp = (number: string, name: string) => {
    const clean = number.replace(/\D/g, "");
    const phone = clean.startsWith("55") ? clean : `55${clean}`;
    const msg = encodeURIComponent(
      `Olá ${name}! Vi seu perfil no Álbum Copa 2026 e acho que podemos trocar figurinhas. Vamos combinar? 🏆`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-dark px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm font-nunito mb-6 inline-block">
          ← Voltar ao álbum
        </a>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔄</span>
          <h1 className="font-bebas text-3xl text-yellow-400">Encontrar Trocas</h1>
        </div>
        <p className="text-gray-400 text-sm font-nunito mb-8">
          Usuários com melhor match para trocar figurinhas com você, priorizando os mais próximos.
        </p>

        {loading && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 animate-spin inline-block">⚙️</div>
            <p className="text-gray-400 font-nunito">Cruzando a base de colecionadores...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-xl p-4 mb-6">
            <p className="text-red-400 font-nunito text-sm">{error}</p>
            <button onClick={fetchMatches} className="text-yellow-400 text-sm mt-2 hover:underline">Tentar novamente</button>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="text-center py-16 bg-dark-card rounded-xl border border-dark-border">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-white font-bebas text-2xl mb-2">Nenhum match encontrado</p>
            <p className="text-gray-400 font-nunito text-sm mb-6">
              {!hasDupes
                ? "Marque suas figurinhas repetidas usando o botão + no álbum, depois volte aqui."
                : "Ainda não há outros usuários cadastrados para trocas. Convide amigos!"}
            </p>
            <a href="/perfil" className="text-yellow-400 text-sm font-nunito hover:underline">
              Verifique seu cadastro de trocas →
            </a>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="space-y-4">
            {matches.map((match, i) => (
              <div key={match.user_id} className="bg-dark-card rounded-xl border border-dark-border p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-bebas text-sm">#{i + 1}</span>
                      <span className="text-white font-bebas text-xl">
                        {match.display_name ?? "Colecionador"}
                      </span>
                    </div>
                    {(match.city || match.state) && (
                      <p className="text-gray-400 text-sm font-nunito">
                        📍 {[match.city, match.state].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-3 py-1">
                      <span className="text-yellow-400 font-bebas text-lg">{match.total_score}</span>
                      <span className="text-gray-400 text-xs font-nunito ml-1">matches</span>
                    </div>
                  </div>
                </div>

                {/* O que ele pode me dar */}
                {match.they_give_me > 0 && (
                  <div className="mb-3">
                    <p className="text-green-400 text-xs font-nunito font-bold mb-2 uppercase tracking-wide">
                      ✅ Pode te dar ({match.they_give_me} figurinhas)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(match.they_give_by_team).map(([code, qty]) => (
                        <span key={code} className="bg-green-900/30 border border-green-700/40 rounded-full px-3 py-1 text-xs font-nunito text-green-300">
                          {teamFlag(code)} {teamName(code)}: {qty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* O que eu posso dar */}
                {match.i_give_them > 0 && (
                  <div className="mb-4">
                    <p className="text-blue-400 text-xs font-nunito font-bold mb-2 uppercase tracking-wide">
                      🔵 Precisa das suas ({match.i_give_them} figurinhas)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(match.i_give_by_team).map(([code, qty]) => (
                        <span key={code} className="bg-blue-900/30 border border-blue-700/40 rounded-full px-3 py-1 text-xs font-nunito text-blue-300">
                          {teamFlag(code)} {teamName(code)}: {qty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botão WhatsApp */}
                {match.whatsapp && (
                  <button
                    onClick={() => openWhatsApp(match.whatsapp!, match.display_name ?? "colecionador")}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bebas text-lg py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Chamar no WhatsApp
                  </button>
                )}
              </div>
            ))}

            <p className="text-center text-gray-500 text-xs font-nunito py-4">
              Mostrando os {matches.length} melhores matches • Priorizando sua região
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
