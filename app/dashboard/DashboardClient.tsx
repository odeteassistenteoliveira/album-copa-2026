"use client";

import { useState, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { GROUPS, SPECIAL, getTotalStickers } from "@/lib/data";
import AlbumStats from "@/components/AlbumStats";
import GroupSection from "@/components/GroupSection";
import ShareButton from "@/components/ShareButton";
import InstallPWA from "@/components/InstallPWA";
import { Album } from "@/lib/types";

interface DashboardClientProps {
  album: Album;
  initialCollected: Record<string, boolean>;
  userId: string;
}

export default function DashboardClient({ album, initialCollected }: DashboardClientProps) {
  const [collectedMap, setCollectedMap] = useState(initialCollected);
  const [imageCache] = useState<Record<string, string | null>>({});
  const [showQR, setShowQR] = useState(false);
  const supabase = createBrowserClient();

  const total = getTotalStickers();
  const collected = Object.values(collectedMap).filter(Boolean).length;

  const handleToggle = useCallback(
    async (teamCode: string, number: number) => {
      const key = `${teamCode}_${number}`;
      const currentlyCollected = !!collectedMap[key];
      const newCollected = !currentlyCollected;

      setCollectedMap((prev) => ({ ...prev, [key]: newCollected }));

      try {
        const res = await fetch("/api/sticker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ album_id: album.id, team_code: teamCode, number, collected: newCollected }),
        });
        if (!res.ok) {
          setCollectedMap((prev) => ({ ...prev, [key]: currentlyCollected }));
        }
      } catch {
        setCollectedMap((prev) => ({ ...prev, [key]: currentlyCollected }));
      }
    },
    [collectedMap, album.id, supabase]
  );

  const tradeUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/trocar/${album.slug}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(tradeUrl)}&bgcolor=0d0d1a&color=facc15&margin=12`;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-dark-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-bebas text-xl text-yellow-400 hidden sm:block">Copa 2026</span>
          </div>

          <AlbumStats collected={collected} total={total} albumName={album.name} compact />

          <div className="flex items-center gap-2">
            {/* QR de trocas */}
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark border border-dark-border text-gray-300 hover:border-yellow-400/50 hover:text-yellow-400 transition-all text-sm font-nunito"
              title="QR Code para trocas"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3m0 4h4m-4-4v4m0 0h-3"/>
              </svg>
              <span className="hidden sm:inline">Trocar</span>
            </button>

            <InstallPWA />
            <ShareButton slug={album.slug} />

            <a href="/api/auth/signout" className="text-gray-500 hover:text-white text-sm font-nunito transition-colors">
              Sair
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <AlbumStats collected={collected} total={total} albumName={album.name} />
        </div>

        {GROUPS.map((group) => (
          <GroupSection
            key={group.name}
            groupName={group.name}
            teams={group.teams}
            collectedMap={collectedMap}
            imageCache={imageCache}
            onToggle={handleToggle}
            readOnly={false}
          />
        ))}

        {SPECIAL.map((special) => (
          <GroupSection
            key={special.code}
            groupName={`${special.flag} ${special.name}`}
            teams={[{ code: special.code, name: special.name, flag: special.flag }]}
            collectedMap={collectedMap}
            imageCache={imageCache}
            onToggle={handleToggle}
            readOnly={false}
            nums={special.nums}
          />
        ))}
      </main>

      {/* Modal QR Code */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bebas text-2xl text-yellow-400 mb-1">Meu QR Code de Trocas</h2>
            <p className="text-gray-400 font-nunito text-sm mb-5">
              Outro usuário escaneia e o sistema cruza automaticamente as figurinhas de cada um
            </p>

            {/* QR Code */}
            <div className="bg-dark rounded-xl p-4 inline-block mb-5 border border-dark-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrSrc} alt="QR Code" className="w-48 h-48 rounded-lg" />
            </div>

            <p className="text-gray-500 font-nunito text-xs mb-4 break-all px-2">{tradeUrl}</p>

            <div className="flex gap-3">
              <button
                onClick={() => { navigator.clipboard.writeText(tradeUrl); }}
                className="flex-1 bg-dark border border-dark-border text-gray-300 hover:text-white font-nunito text-sm py-2.5 rounded-xl transition-all"
              >
                📋 Copiar link
              </button>
              <button
                onClick={async () => {
                  if (navigator.share) {
                    await navigator.share({ title: "Trocar figurinhas — Copa 2026", url: tradeUrl });
                  }
                }}
                className="flex-1 bg-yellow-400 text-black font-bebas text-lg py-2.5 rounded-xl hover:bg-yellow-300 transition-all"
              >
                Compartilhar
              </button>
            </div>

            <button
              onClick={() => setShowQR(false)}
              className="mt-4 text-gray-600 hover:text-gray-400 font-nunito text-sm transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
