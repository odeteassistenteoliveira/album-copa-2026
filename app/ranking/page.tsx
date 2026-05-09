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

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [myRank, setMyRank] = useState<RankEntry | null>(null);
  const [total, setTotal] = useState(985);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ranking").then(r => r.json()).then(data => {
      setRanking(data.ranking ?? []);
      setMyRank(data.myRank ?? null);
      setTotal(data.total ?? 985);
      setLoading(false);
    });
  }, []);

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
            {/* Minha posição (se não estiver no top 10) */}
            {myRank && myRank.rank > 10 && (
              <div className="mb-6 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-5 py-4 flex items-center gap-4">
                <span className="font-bebas text-3xl text-yellow-400 w-10 text-center">#{myRank.rank}</span>
                <div className="flex-1">
                  <p className="font-bebas text-lg text-white">{myRank.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${myRank.pct}%` }} />
                    </div>
                    <span className="text-yellow-400 font-bebas text-sm">{myRank.pct}%</span>
                  </div>
                  <p className="text-gray-500 text-xs font-nunito">{myRank.collected}/{total} figurinhas · sua posição</p>
                </div>
              </div>
            )}

            {/* Top 10 */}
            <div className="space-y-3">
              {ranking.map((entry) => {
                const isMe = myRank?.user_id === entry.user_id;
                return (
                  <Link
                    key={entry.slug}
                    href={`/album/${entry.slug}`}
                    className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-all hover:scale-[1.01] active:scale-[0.99] border ${
                      isMe
                        ? "bg-yellow-400/10 border-yellow-400/40"
                        : "bg-dark-card border-dark-border hover:border-white/10"
                    }`}
                  >
                    <span className="font-bebas text-2xl w-10 text-center shrink-0">
                      {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-bebas text-lg truncate ${isMe ? "text-yellow-400" : "text-white"}`}>
                          {entry.name}{isMe ? " (você)" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${entry.rank === 1 ? "bg-yellow-400" : entry.rank === 2 ? "bg-gray-300" : entry.rank === 3 ? "bg-amber-600" : isMe ? "bg-yellow-400" : "bg-blue-500"}`}
                            style={{ width: `${entry.pct}%` }}
                          />
                        </div>
                        <span className={`font-bebas text-sm shrink-0 ${isMe ? "text-yellow-400" : "text-gray-400"}`}>{entry.pct}%</span>
                      </div>
                      <p className="text-gray-500 text-xs font-nunito">{entry.collected}/{total} figurinhas</p>
                    </div>
                  </Link>
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
    </div>
  );
}
