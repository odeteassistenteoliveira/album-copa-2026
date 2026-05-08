"use client";

import { useState, useCallback } from "react";
import { GROUPS, SPECIAL, getTotalStickers } from "@/lib/data";
import AlbumStats from "@/components/AlbumStats";
import GroupSection from "@/components/GroupSection";
import ShareButton from "@/components/ShareButton";
import InstallPWA from "@/components/InstallPWA";
import { Album } from "@/lib/types";

interface DashboardClientProps {
  album: Album;
  initialQuantityMap: Record<string, number>;
  userId: string;
}

export default function DashboardClient({ album, initialQuantityMap }: DashboardClientProps) {
  const [quantityMap, setQuantityMap] = useState(initialQuantityMap);

  const total = getTotalStickers();
  const collected = Object.values(quantityMap).filter(q => q >= 1).length;
  const totalDupes = Object.values(quantityMap).filter(q => q >= 2).reduce((acc, q) => acc + (q - 1), 0);

  const handleToggle = useCallback(async (teamCode: string, number: number) => {
    const key = `${teamCode}_${number}`;
    const current = quantityMap[key] ?? 0;
    const newQty = current >= 1 ? 0 : 1;

    setQuantityMap(prev => ({ ...prev, [key]: newQty }));
    const res = await fetch("/api/sticker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ album_id: album.id, team_code: teamCode, number, collected: newQty >= 1, quantity: newQty }),
    });
    if (!res.ok) setQuantityMap(prev => ({ ...prev, [key]: current }));
  }, [quantityMap, album.id]);

  const handleQuantityChange = useCallback(async (teamCode: string, number: number, delta: number) => {
    const key = `${teamCode}_${number}`;
    const current = quantityMap[key] ?? 0;
    const newQty = Math.max(0, current + delta);

    setQuantityMap(prev => ({ ...prev, [key]: newQty }));
    const res = await fetch("/api/sticker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ album_id: album.id, team_code: teamCode, number, quantity: newQty }),
    });
    if (!res.ok) setQuantityMap(prev => ({ ...prev, [key]: current }));
  }, [quantityMap, album.id]);

  return (
    <div className="min-h-screen bg-dark">
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🏆</span>
            <span className="font-bebas text-xl text-yellow-400 hidden sm:block">Copa 2026</span>
          </div>

          <AlbumStats collected={collected} total={total} albumName={album.name} compact />

          <div className="flex items-center gap-1.5 shrink-0">
            {totalDupes > 0 && (
              <a
                href="/trocas"
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white font-bebas text-sm px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm"
              >
                <span>🔄</span>
                <span className="hidden sm:inline">Trocar</span>
                <span className="bg-white/25 rounded-full px-1.5 text-xs font-bold">{totalDupes}</span>
              </a>
            )}
            <InstallPWA />
            <ShareButton slug={album.slug} compact />
            <a href="/perfil" className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-white text-sm transition-colors rounded-lg hover:bg-white/5" title="Perfil">👤</a>
            <a href="/api/auth/signout" className="text-gray-500 hover:text-white text-xs font-nunito transition-colors px-1 hidden sm:block">Sair</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <AlbumStats collected={collected} total={total} albumName={album.name} />
        </div>

        {totalDupes > 0 && (
          <a
            href="/trocas"
            className="block mb-8 rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)" }}
          >
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔄</span>
                <div>
                  <p className="text-white font-bebas text-xl leading-tight">
                    Você tem {totalDupes} figurinha{totalDupes > 1 ? "s" : ""} repetida{totalDupes > 1 ? "s" : ""}!
                  </p>
                  <p className="text-orange-100 text-sm font-nunito">
                    Encontre colecionadores perto de você e complete o álbum
                  </p>
                </div>
              </div>
              <div className="shrink-0 bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-4 py-2 text-white font-bebas text-base whitespace-nowrap">
                Buscar trocas →
              </div>
            </div>
          </a>
        )}

        {totalDupes === 0 && collected > 0 && (
          <div className="mb-6 bg-dark-card border border-dark-border rounded-xl p-4">
            <p className="text-gray-400 text-sm font-nunito">
              💡 <span className="text-gray-300">Tem figurinhas repetidas?</span> Use o botão <span className="text-blue-400 font-bold">+</span> abaixo de cada figurinha para marcá-las e encontrar pessoas para trocar.
            </p>
          </div>
        )}

        {GROUPS.map((group) => (
          <GroupSection
            key={group.name}
            groupName={group.name}
            teams={group.teams}
            quantityMap={quantityMap}
            onToggle={handleToggle}
            onQuantityChange={handleQuantityChange}
            readOnly={false}
          />
        ))}

        {SPECIAL.map((special) => (
          <GroupSection
            key={special.code}
            groupName={`${special.flag} ${special.name}`}
            teams={[{ code: special.code, name: special.name, flag: special.flag }]}
            quantityMap={quantityMap}
            onToggle={handleToggle}
            onQuantityChange={handleQuantityChange}
            readOnly={false}
            nums={special.nums}
          />
        ))}
      </main>
    </div>
  );
}
