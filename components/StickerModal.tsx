"use client";

import { useEffect, useState } from "react";
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

export default function StickerModal({
  isOpen, onClose, teamCode, teamName, teamFlag, number, collected, onToggle, readOnly = false,
}: StickerModalProps) {
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const playerName = STAR_PLAYERS[teamCode];

  const handleToggle = async () => {
    if (!onToggle) return;
    setToggling(true);
    try { await onToggle(); } finally { setToggling(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`relative w-full max-w-sm rounded-2xl overflow-hidden border-2 shadow-2xl bg-dark-card
          ${collected ? "border-yellow-400 shadow-gold" : "border-gray-700"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Área da figurinha — sem foto */}
        <div className="relative h-48 bg-gradient-to-b from-gray-900 to-dark-card flex items-center justify-center">
          <span className="text-8xl">{teamFlag}</span>

          {collected && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
              ✓ COLETADA
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >✕</button>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-dark-card to-transparent h-12" />
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h3 className="font-bebas text-2xl text-white leading-none">{teamName}</h3>
              {playerName && <p className="text-yellow-400 text-sm font-nunito">{playerName}</p>}
            </div>
            <div className="ml-auto">
              <div className="font-bebas text-3xl text-yellow-400 leading-none">#{number}</div>
            </div>
          </div>

          <div className="h-px bg-dark-border my-4" />

          {!readOnly ? (
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`w-full py-3 rounded-xl font-bebas text-xl tracking-wide transition-all duration-200 active:scale-95
                ${collected
                  ? "bg-red-900/40 border-2 border-red-700 text-red-400 hover:bg-red-900/60"
                  : "bg-yellow-400 text-black hover:bg-yellow-300 shadow-gold"
                } ${toggling ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {toggling ? "..." : collected ? "❌ Remover Figurinha" : "✅ Tenho esta figurinha!"}
            </button>
          ) : (
            <p className="text-center text-gray-500 text-sm font-nunito">
              {collected ? "✓ Esta figurinha foi coletada" : "Figurinha ainda não coletada"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
