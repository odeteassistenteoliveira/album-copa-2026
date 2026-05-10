"use client";

import { useState, useEffect, useCallback } from "react";
import { GROUPS, SPECIAL } from "@/lib/data";

const ALL_TEAMS = [
  ...GROUPS.flatMap(g => g.teams),
  ...SPECIAL.map(s => ({ code: s.code, name: s.name, flag: s.flag }))
];

const teamName = (code: string) => ALL_TEAMS.find(t => t.code === code)?.name ?? code;
const teamFlag = (code: string) => ALL_TEAMS.find(t => t.code === code)?.flag ?? "🏳️";

interface TradeMatch {
  user_id: string;
  display_name?: string;
  city?: string;
  state?: string;
  whatsapp?: string;
  they_give_me: number;
  i_give_them: number;
  total_score: number;
  proximity_score: number;
  their_collection_size: number;
  they_give_by_team: Record<string, number[]>;
  i_give_by_team: Record<string, number[]>;
}

export default function TrocasPage() {
  const [matches, setMatches] = useState<TradeMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao buscar trocas");
      setMatches(data.matches ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const openWhatsApp = (number: string, name: string, theyGive: number, iGive: number) => {
    const clean = number.replace(/\D/g, "");
    const phone = clean.startsWith("55") ? clean : `55${clean}`;
    const msg = encodeURIComponent(
      `Olá ${name}! Vi no Álbum Copa 2026 que você tem ${theyGive} figurinha${theyGive > 1 ? "s" : ""} que preciso, e eu tenho ${iGive} que você precisa. Vamos trocar? 🏆`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-dark pb-16">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bebas text-lg px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-yellow-900/30"
          >
            ← Voltar
          </a>
          <span className="text-xl">🔄</span>
          <h1 className="font-bebas text-xl text-yellow-400 tracking-wide">Buscar Trocas</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-gray-400 text-sm font-nunito mb-6 leading-relaxed">
          Mostrando os <span className="text-white font-bold">5 melhores colecionadores</span> para te ajudar a completar o álbum — priorizando quem tem mais das suas figurinhas faltantes.
        </p>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-nunito text-sm">Cruzando a base de colecionadores…</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 mb-6">
            <p className="text-red-400 font-nunito text-sm">{error}</p>
            <button onClick={fetchMatches} className="text-yellow-400 text-sm mt-2 hover:underline font-nunito">
              Tentar novamente
            </button>
          </div>
        )}

        {/* Nenhum match */}
        {!loading && !error && matches.length === 0 && (
          <div className="text-center py-16 bg-dark-card rounded-2xl border border-dark-border">
            <span className="text-5xl block mb-4">😕</span>
            <p className="text-white font-bebas text-2xl mb-2">Nenhum match encontrado</p>
            <p className="text-gray-400 font-nunito text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Marque suas figurinhas no álbum para que possamos encontrar colecionadores com as que você precisa. Ou convide amigos!
            </p>
            <a href="/perfil" className="text-yellow-400 text-sm font-nunito hover:underline">
              Verifique seu cadastro de trocas →
            </a>
          </div>
        )}

        {/* Matches */}
        {!loading && matches.length > 0 && (
          <div className="space-y-5">
            {matches.map((match, i) => (
              <div key={match.user_id} className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
                {/* Header do colecionador */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
                  <div className="flex items-center gap-3">
                    <span className="font-bebas text-2xl text-gray-600 w-7">#{i + 1}</span>
                    <div>
                      <p className="text-white font-bebas text-xl leading-tight">
                        {match.display_name ?? "Colecionador"}
                      </p>
                      {(match.city || match.state) && (
                        <p className="text-gray-500 text-xs font-nunito">
                          📍 {[match.city, match.state].filter(Boolean).join(", ")}
                          {match.proximity_score === 2 && <span className="ml-1 text-green-400 font-bold">· mesma cidade!</span>}
                          {match.proximity_score === 1 && <span className="ml-1 text-blue-400">· mesmo estado</span>}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Score principal: figurinhas que eles têm que eu preciso */}
                  <div className="text-right">
                    <p className="font-bebas text-3xl text-green-400 leading-none">{match.they_give_me}</p>
                    <p className="text-gray-500 text-xs font-nunito">que você precisa</p>
                  </div>
                </div>

                {/* O que eles podem me dar */}
                <div className="px-5 py-3 border-b border-dark-border/50">
                  <p className="text-green-400 text-xs font-nunito font-bold mb-2 uppercase tracking-wide">
                    ✅ Eles têm e você precisa ({match.they_give_me} figurinhas)
                  </p>
                  <div className="space-y-2">
                    {Object.entries(match.they_give_by_team).map(([code, nums]) => (
                      <div key={code} className="flex items-start gap-2 flex-wrap">
                        <span className="shrink-0 bg-green-900/30 border border-green-700/40 rounded-lg px-2 py-0.5 text-xs font-nunito text-green-300">
                          {teamFlag(code)} {teamName(code)}
                        </span>
                        {nums.map(n => (
                          <span key={n} className="bg-green-800/40 border border-green-600/40 rounded-md px-1.5 py-0.5 text-xs font-bebas text-green-200">
                            #{n}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* O que eu posso dar a eles */}
                {match.i_give_them > 0 && (
                  <div className="px-5 py-3 border-b border-dark-border/50">
                    <p className="text-blue-400 text-xs font-nunito font-bold mb-2 uppercase tracking-wide">
                      🔵 Você tem e eles precisam ({match.i_give_them} figurinhas)
                    </p>
                    <div className="space-y-2">
                      {Object.entries(match.i_give_by_team).map(([code, nums]) => (
                        <div key={code} className="flex items-start gap-2 flex-wrap">
                          <span className="shrink-0 bg-blue-900/30 border border-blue-700/40 rounded-lg px-2 py-0.5 text-xs font-nunito text-blue-300">
                            {teamFlag(code)} {teamName(code)}
                          </span>
                          {nums.map(n => (
                            <span key={n} className="bg-blue-800/40 border border-blue-600/40 rounded-md px-1.5 py-0.5 text-xs font-bebas text-blue-200">
                              #{n}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botão WhatsApp */}
                <div className="px-5 py-4">
                  {match.whatsapp ? (
                    <button
                      onClick={() => openWhatsApp(match.whatsapp!, match.display_name ?? "colecionador", match.they_give_me, match.i_give_them)}
                      className="w-full bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bebas text-lg py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Chamar no WhatsApp
                    </button>
                  ) : (
                    <p className="text-gray-600 text-xs font-nunito text-center">
                      Este colecionador não cadastrou WhatsApp
                    </p>
                  )}
                </div>
              </div>
            ))}

            <p className="text-center text-gray-600 text-xs font-nunito py-2">
              Top 5 colecionadores com mais figurinhas que você precisa
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
