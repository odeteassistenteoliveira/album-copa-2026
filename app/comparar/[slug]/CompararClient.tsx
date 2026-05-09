"use client";

import Link from "next/link";
import { PLAYER_NAMES } from "@/lib/data";

interface Team { code: string; name: string; flag: string; }
interface Album { id: string; name: string; slug: string; }

interface Props {
  ownerAlbum: Album;
  myAlbum: Album | null;
  iCanGive: string[];
  ownerCanGive: string[];
  isLoggedIn: boolean;
  allTeams: Team[];
}

function groupByTeam(keys: string[], allTeams: Team[]) {
  const map = new Map<string, { team: Team; numbers: number[] }>();
  for (const key of keys) {
    const [code, numStr] = key.split("_");
    const team = allTeams.find(t => t.code === code);
    if (!team) continue;
    if (!map.has(code)) map.set(code, { team, numbers: [] });
    map.get(code)!.numbers.push(parseInt(numStr));
  }
  return Array.from(map.values()).sort((a, b) => a.team.code.localeCompare(b.team.code));
}

export default function CompararClient({ ownerAlbum, myAlbum, iCanGive, ownerCanGive, isLoggedIn, allTeams }: Props) {
  const iGive = groupByTeam(iCanGive, allTeams);
  const theyGive = groupByTeam(ownerCanGive, allTeams);
  const totalMatch = Math.min(iCanGive.length, ownerCanGive.length);

  return (
    <div className="min-h-screen bg-dark pb-16">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bebas text-lg px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-yellow-900/30">
            ← Voltar
          </Link>
          <span className="text-xl">📷</span>
          <h1 className="font-bebas text-xl text-yellow-400 tracking-wide">Comparar Álbuns</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Cabeçalho de quem está comparando */}
        <div className="flex items-center justify-between gap-4 mb-6 bg-dark-card border border-dark-border rounded-2xl px-5 py-4">
          <div className="text-center flex-1">
            <p className="text-gray-500 text-xs font-nunito mb-1">Você</p>
            <p className="font-bebas text-lg text-white">{myAlbum?.name ?? "Visitante"}</p>
          </div>
          <div className="font-bebas text-3xl text-yellow-400">⇄</div>
          <div className="text-center flex-1">
            <p className="text-gray-500 text-xs font-nunito mb-1">Colecionador</p>
            <p className="font-bebas text-lg text-white">{ownerAlbum.name}</p>
          </div>
        </div>

        {/* Sem login */}
        {!isLoggedIn && (
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-5 py-4 mb-6 text-center">
            <p className="text-yellow-400 font-bebas text-lg mb-1">Entre para ver o match completo!</p>
            <p className="text-gray-400 text-sm font-nunito mb-3">Faça login para comparar seus álbuns e ver exatamente o que cada um pode trocar.</p>
            <Link href="/login" className="inline-block bg-yellow-400 text-black font-bebas text-base px-6 py-2 rounded-xl hover:bg-yellow-300 transition-colors">
              Criar conta / Entrar
            </Link>
          </div>
        )}

        {/* Resumo do match */}
        {isLoggedIn && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-dark-card border border-dark-border rounded-xl px-3 py-3 text-center">
              <p className="font-bebas text-2xl text-green-400">{iCanGive.length}</p>
              <p className="text-gray-400 text-xs font-nunito leading-tight">você pode dar</p>
            </div>
            <div className="bg-dark-card border border-purple-500/40 border-2 rounded-xl px-3 py-3 text-center">
              <p className="font-bebas text-3xl text-purple-400">{totalMatch}</p>
              <p className="text-gray-400 text-xs font-nunito leading-tight">trocas possíveis</p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl px-3 py-3 text-center">
              <p className="font-bebas text-2xl text-blue-400">{ownerCanGive.length}</p>
              <p className="text-gray-400 text-xs font-nunito leading-tight">você pode receber</p>
            </div>
          </div>
        )}

        {isLoggedIn && totalMatch === 0 && (
          <div className="text-center py-10">
            <span className="text-5xl block mb-3">🤝</span>
            <p className="font-bebas text-xl text-white mb-1">Nenhuma troca possível no momento</p>
            <p className="text-gray-400 text-sm font-nunito">Vocês não têm repetidas que o outro precise. Continuem coletando!</p>
          </div>
        )}

        {/* O que eu posso dar */}
        {isLoggedIn && iGive.length > 0 && (
          <section className="mb-8">
            <h2 className="font-bebas text-lg text-green-400 tracking-wide mb-3 flex items-center gap-2">
              ✅ Você dá para {ownerAlbum.name.split(" ")[0]}
              <span className="bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-nunito px-2 py-0.5 rounded-full ml-auto">{iCanGive.length} figurinhas</span>
            </h2>
            <div className="space-y-2">
              {iGive.map(({ team, numbers }) => (
                <div key={team.code} className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-xl px-4 py-2.5">
                  <span className="text-xl shrink-0">{team.flag}</span>
                  <span className="font-bebas text-white shrink-0">{team.name}</span>
                  <div className="flex flex-wrap gap-1 ml-auto">
                    {numbers.sort((a,b)=>a-b).map(n => (
                      <span key={n} className="bg-green-900/40 border border-green-700/40 text-green-400 font-bebas text-xs px-1.5 py-0.5 rounded" title={PLAYER_NAMES[team.code]?.[n]}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* O que eu recebo */}
        {isLoggedIn && theyGive.length > 0 && (
          <section className="mb-8">
            <h2 className="font-bebas text-lg text-blue-400 tracking-wide mb-3 flex items-center gap-2">
              📥 Você recebe de {ownerAlbum.name.split(" ")[0]}
              <span className="bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-nunito px-2 py-0.5 rounded-full ml-auto">{ownerCanGive.length} figurinhas</span>
            </h2>
            <div className="space-y-2">
              {theyGive.map(({ team, numbers }) => (
                <div key={team.code} className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-xl px-4 py-2.5">
                  <span className="text-xl shrink-0">{team.flag}</span>
                  <span className="font-bebas text-white shrink-0">{team.name}</span>
                  <div className="flex flex-wrap gap-1 ml-auto">
                    {numbers.sort((a,b)=>a-b).map(n => (
                      <span key={n} className="bg-blue-900/40 border border-blue-700/40 text-blue-400 font-bebas text-xs px-1.5 py-0.5 rounded" title={PLAYER_NAMES[team.code]?.[n]}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
