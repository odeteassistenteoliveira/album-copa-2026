"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RankEntry {
  rank: number;
  name: string;
  slug: string;
  collected: number;
  pct: number;
  user_id: string;
}

interface MatchResult {
  other_name: string;
  other_city?: string;
  other_state?: string;
  other_whatsapp?: string;
  they_give_me: number;
  i_give_them: number;
  they_give_me_by_team: Record<string, number[]>;
  i_give_them_by_team: Record<string, number[]>;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [myRank, setMyRank] = useState<RankEntry | null>(null);
  const [total, setTotal] = useState(985);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ranking").then(r => r.json()).then(data => {
      setRanking(data.ranking ?? []);
      setMyRank(data.myRank ?? null);
      setTotal(data.total ?? 985);
      setLoading(false);
    });
  }, []);

  const handleMatch = async (slug: string) => {
    setMatchLoading(true);
    setMatchResult(null);
    setMatchError(null);
    try {
      const res = await fetch(`/api/match/${slug}`);
      const data = await res.json();
      if (data.error) setMatchError(data.error);
      else setMatchResult(data);
    } catch {
      setMatchError("Erro ao calcular match.");
    } finally {
      setMatchLoading(false);
    }
  };

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen bg-dark pb-16">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bebas text-lg px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-yellow-900/30">
            ← Voltar
          </Link>
          <span className="text-xl">🏆</span>
          <h1 className="font-bebas text-xl text-yellow-400 tracking-wide">Ranking Global</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Minha posição (se não estiver no top 3) */}
            {myRank && myRank.rank > 3 && (
              <div className="mb-6 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-5 py-4 flex items-center gap-4">
                <span className="font-bebas text-3xl text-yellow-400 w-10 text-center">#{myRank.rank}</span>
                <div className="flex-1">
                  <p className="font-bebas text-lg text-white">{myRank.name} <span className="text-yellow-400">(você)</span></p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${myRank.pct}%` }} />
                    </div>
                    <span className="text-yellow-400 font-bebas text-sm">{myRank.pct}%</span>
                  </div>
                  <p className="text-gray-500 text-xs font-nunito">{myRank.collected}/{total} figurinhas</p>
                </div>
              </div>
            )}

            {/* Lista completa */}
            <div className="space-y-3">
              {ranking.map((entry) => {
                const isMe = myRank?.user_id === entry.user_id;
                return (
                  <div
                    key={entry.slug}
                    className={`rounded-2xl px-5 py-4 border ${
                      isMe
                        ? "bg-yellow-400/10 border-yellow-400/40"
                        : "bg-dark-card border-dark-border"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bebas text-2xl w-10 text-center shrink-0">
                        {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bebas text-lg truncate ${isMe ? "text-yellow-400" : "text-white"}`}>
                          {entry.name}{isMe ? " (você)" : ""}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${entry.rank === 1 ? "bg-yellow-400" : entry.rank === 2 ? "bg-gray-300" : entry.rank === 3 ? "bg-amber-600" : isMe ? "bg-yellow-400" : "bg-blue-500"}`}
                              style={{ width: `${entry.pct}%` }}
                            />
                          </div>
                          <span className={`font-bebas text-sm shrink-0 ${isMe ? "text-yellow-400" : "text-gray-400"}`}>{entry.pct}%</span>
                        </div>
                        <p className="text-gray-500 text-xs font-nunito">{entry.collected}/{total} figurinhas</p>
                      </div>
                      {/* Botões */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <Link
                          href={`/album/${entry.slug}`}
                          className="text-xs font-bebas px-3 py-1.5 rounded-xl bg-dark-border text-gray-300 hover:bg-white/10 transition-all text-center"
                        >
                          👁 Ver
                        </Link>
                        {!isMe && myRank && (
                          <button
                            onClick={() => handleMatch(entry.slug)}
                            className="text-xs font-bebas px-3 py-1.5 rounded-xl bg-green-900/40 border border-green-700/50 text-green-400 hover:bg-green-900/60 transition-all"
                          >
                            🔄 Match
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {ranking.length === 0 && (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">🏆</span>
                <p className="font-bebas text-xl text-white">Nenhum colecionador ainda</p>
                <p className="text-gray-400 text-sm font-nunito">Seja o primeiro a marcar figurinhas!</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de Match */}
      {(matchLoading || matchResult || matchError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => { setMatchResult(null); setMatchError(null); }}
        >
          <div
            className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-green-900/40 border-b border-green-700/30 px-5 py-4 flex items-center justify-between">
              <h2 className="font-bebas text-xl text-green-400">🔄 Match de Trocas</h2>
              <button
                onClick={() => { setMatchResult(null); setMatchError(null); }}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center"
              >✕</button>
            </div>

            <div className="p-5">
              {matchLoading && (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {matchError && (
                <p className="text-red-400 font-nunito text-center py-6">{matchError}</p>
              )}

              {matchResult && (
                <>
                  <p className="font-bebas text-2xl text-white mb-1">{matchResult.other_name}</p>
                  {matchResult.other_city && (
                    <p className="text-gray-400 text-sm font-nunito mb-4">📍 {matchResult.other_city}{matchResult.other_state ? `, ${matchResult.other_state}` : ""}</p>
                  )}

                  {/* Resumo */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-xl p-3 text-center">
                      <p className="font-bebas text-3xl text-blue-400">{matchResult.they_give_me}</p>
                      <p className="text-xs text-gray-400 font-nunito">ele(a) pode me dar</p>
                    </div>
                    <div className="bg-orange-900/30 border border-orange-700/30 rounded-xl p-3 text-center">
                      <p className="font-bebas text-3xl text-orange-400">{matchResult.i_give_them}</p>
                      <p className="text-xs text-gray-400 font-nunito">eu posso dar</p>
                    </div>
                  </div>

                  {/* Detalhe: eles me dão */}
                  {matchResult.they_give_me > 0 && (
                    <div className="mb-4">
                      <p className="font-bebas text-sm text-blue-400 mb-2">📥 Figurinhas que ele(a) tem repetidas e eu preciso:</p>
                      <div className="space-y-1">
                        {Object.entries(matchResult.they_give_me_by_team).map(([team, nums]) => (
                          <div key={team} className="flex items-center gap-2 text-xs font-nunito">
                            <span className="font-bebas text-white uppercase w-10 shrink-0">{team}</span>
                            <span className="text-gray-300">{nums.join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detalhe: eu dou */}
                  {matchResult.i_give_them > 0 && (
                    <div className="mb-4">
                      <p className="font-bebas text-sm text-orange-400 mb-2">📤 Minhas repetidas que ele(a) precisa:</p>
                      <div className="space-y-1">
                        {Object.entries(matchResult.i_give_them_by_team).map(([team, nums]) => (
                          <div key={team} className="flex items-center gap-2 text-xs font-nunito">
                            <span className="font-bebas text-white uppercase w-10 shrink-0">{team}</span>
                            <span className="text-gray-300">{nums.join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchResult.they_give_me === 0 && matchResult.i_give_them === 0 && (
                    <p className="text-center text-gray-400 font-nunito py-4">Nenhuma troca possível no momento.</p>
                  )}

                  {/* WhatsApp */}
                  {matchResult.other_whatsapp && matchResult.they_give_me > 0 && (
                    <a
                      href={`https://wa.me/${matchResult.other_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${matchResult.other_name}! Vi no álbum Copa 2026 que podemos trocar figurinhas. Você tem ${matchResult.they_give_me} repetidas que preciso! 🤝`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bebas text-lg transition-all mt-2"
                    >
                      📱 Contatar no WhatsApp
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
