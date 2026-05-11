"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { STAR_PLAYERS } from "@/lib/data";

interface StickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamCode: string;
  teamName: string;
  teamFlag: string;
  number: number;
  collected: boolean;
  onToggle?: () => Promise<void>;
  readOnly?: boolean;
}

function getStickerImagePath(teamCode: string, number: number): string {
  const team = teamCode.toLowerCase();
  const num = String(number).padStart(2, "0");
  return `/stickers/${team}/${team}_${num}.jpg`;
}

export default function StickerModal({
  isOpen,
  onClose,
  teamCode,
  teamName,
  teamFlag,
  number,
  collected,
  onToggle,
  readOnly = false,
}: StickerModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setImageUrl(null);
    setLoading(true);
    // Imagens Panini desativadas temporariamente (mapeamento em revisão)
    // Usando apenas imagem da Wikipedia do jogador estrela
    fetch(`/api/image/${teamCode}`)
      .then((r) => r.json())
      .then((d) => setImageUrl(d.image_url || null))
      .catch(() => setImageUrl(null))
      .finally(() => setLoading(false));
  }, [isOpen, teamCode, number]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const playerName = STAR_PLAYERS[teamCode];

  const handleToggle = async () => {
    if (!onToggle) return;
    setToggling(true);
    try {
      await onToggle();
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`
          relative w-full max-w-sm rounded-2xl overflow-hidden border-2 shadow-2xl
          ${collected ? "border-yellow-400 shadow-gold" : "border-gray-700"}
          bg-dark-card
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem do jogador */}
        <div className="relative h-64 bg-gradient-to-b from-gray-900 to-dark-card">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
            </div>
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={playerName || teamName}
              fill
              className="object-cover object-top"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">{teamFlag}</span>
            </div>
          )}

          {/* Gradiente inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />

          {/* Badge coletada */}
          {collected && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
              ✓ COLETADA
            </div>
          )}

          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{teamFlag}</span>
            <div>
              <h3 className="font-bebas text-2xl text-white leading-none">
                {teamName}
              </h3>
              {playerName && (
                <p className="text-yellow-400 text-sm font-nunito">
                  {playerName}
                </p>
              )}
            </div>
            <div className="ml-auto text-right">
              <div className="font-bebas text-3xl text-yellow-400 leading-none">
                #{number}
              </div>
            </div>
          </div>

          <div className="h-px bg-dark-border my-4" />

          {!readOnly && (
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`
                w-full py-3 rounded-xl font-bebas text-xl tracking-wide transition-all duration-200
                ${
                  collected
                    ? "bg-red-900/40 border-2 border-red-700 text-red-400 hover:bg-red-900/60"
                    : "bg-yellow-400 text-black hover:bg-yellow-300 shadow-gold"
                }
                ${toggling ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
              `}
            >
              {toggling ? (
                "..."
              ) : collected ? (
                "❌ Remover Figurinha"
              ) : (
                "✅ Tenho esta figurinha!"
              )}
            </button>
          )}

          {readOnly && (
            <p className="text-center text-gray-500 text-sm font-nunito">
              {collected ? "✓ Esta figurinha foi coletada" : "Figurinha ainda não coletada"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
