"use client";

import Link from "next/link";
import { GROUPS, SPECIAL, STICKERS_PER_TEAM, PLAYER_NAMES } from "@/lib/data";

interface Props {
  albumName: string;
  quantityMap: Record<string, number>;
}

export default function ExportarClient({ albumName, quantityMap }: Props) {

  const missingByTeam: Array<{ flag: string; name: string; code: string; groupName: string; missing: number[] }> = [];

  for (const group of GROUPS) {
    for (const team of group.teams) {
      const nums = Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1);
      const missing = nums.filter(n => (quantityMap[`${team.code}_${n}`] ?? 0) === 0);
      if (missing.length > 0) {
        missingByTeam.push({ ...team, groupName: group.name, missing });
      }
    }
  }
  for (const special of SPECIAL) {
    const missing = special.nums.filter(n => (quantityMap[`${special.code}_${n}`] ?? 0) === 0);
    if (missing.length > 0) {
      missingByTeam.push({ flag: special.flag, name: special.name, code: special.code, groupName: "Especiais", missing });
    }
  }

  const totalMissing = missingByTeam.reduce((acc, t) => acc + t.missing.length, 0);

  const handleWhatsApp = () => {
    if (totalMissing === 0) return;

    let msg = `\u{1F3C6} *Copa do Mundo 2026 — Figurinhas FALTANTES*\n`;
    msg += `\u{1F464} ${albumName}\n`;
    msg += `\u{1F4CA} Total: ${totalMissing} figurinha${totalMissing > 1 ? "s" : ""} faltando\n\n`;

    for (const team of missingByTeam) {
      msg += `${team.flag} *${team.name}*: ${team.missing.join(", ")}\n`;
    }

    msg += `\n_album-copa-2026.vercel.app_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const WhatsAppIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-dark pb-16">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bebas text-lg px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-yellow-900/30">
            Voltar
          </Link>
          <span className="text-xl">📋</span>
          <h1 className="font-bebas text-xl text-yellow-400 tracking-wide">Figurinhas Faltantes</h1>
          {totalMissing > 0 && (
            <button
              onClick={handleWhatsApp}
              className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bebas text-base px-4 py-2 rounded-xl transition-all shadow-lg shadow-green-900/30"
            >
              <WhatsAppIcon />
              Compartilhar
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bebas text-2xl text-yellow-400">Copa do Mundo 2026</h2>
            <p className="text-gray-400 font-nunito text-sm">{albumName}</p>
          </div>
          <div className="text-right">
            <p className="font-bebas text-3xl text-white">{totalMissing}</p>
            <p className="text-gray-400 text-xs font-nunito">faltando</p>
          </div>
        </div>

        {totalMissing === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🎉</span>
            <p className="font-bebas text-2xl text-green-400">Álbum completo!</p>
            <p className="text-gray-400 font-nunito">Você tem todas as figurinhas!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {missingByTeam.map(team => (
                <div key={team.code} className="bg-dark-card border border-dark-border rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{team.flag}</span>
                    <span className="font-bebas text-white text-base">{team.name}</span>
                    <span className="ml-auto text-xs font-nunito text-gray-500">{team.missing.length} falt.</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {team.missing.map(n => (
                      <span
                        key={n}
                        title={PLAYER_NAMES[team.code]?.[n]}
                        className="bg-gray-800 border border-gray-700 text-gray-300 font-bebas text-xs px-1.5 py-0.5 rounded"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleWhatsApp}
              className="mt-8 w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bebas text-xl py-4 rounded-2xl transition-all shadow-lg shadow-green-900/40"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Enviar por WhatsApp
            </button>
          </>
        )}
      </main>
    </div>
  );
}
