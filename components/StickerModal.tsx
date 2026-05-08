"use client";

import { useEffect, useState } from "react";
import { PLAYER_NAMES } from "@/lib/data";

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

  const playerName = PLAYER_NAMES[teamCode]?.[number] || null;

  const handleToggle = async () => {
    if (!onToggle) return;
    setToggling(true);
    try { await onToggle(); } finally { setToggling(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-xs rounded-2xl overflow-hidden border-2 shadow-2xl bg-dark-card
          ${collected ? "border-yellow-400 shadow-gold" : "border-gray-700"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Área visual da figurinha */}
        <div className={`relative h-44 flex flex-col items-center justify-center
          ${collected
            ? "bg-gradient-to-b from-yellow-900/40 to-dark-card"
            : "bg-gradient-to-b from-gray-900 to-dark-card"}`}
        >
          <span className="text-7xl mb-1">{teamFlag}</span>
          <span className={`font-bebas text-lg ${collected ? "text-yellow-400" : "text-gray-600"}`}>
            #{number}
          </span>

          {collected && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bebas px-2 py-0.5 rounded-full">
              ✓ COLETADA
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors text-sm"
          >✕</button>
        </div>

        {/* Info da figurinha */}
        <div className="p-5">
          <div className="mb-4">
            <h3 className="font-bebas text-2xl text-white leading-tight">{teamName}</h3>
            {playerName ? (
              <p className="text-yellow-400 font-bebas text-xl leading-tight mt-0.5">{playerName}</p>
            ) : (
              <p className="text-gray-600 text-sm font-nunito mt-0.5">Figurinha #{number}</p>
            )}
          </div>

          <div className="h-px bg-dark-border mb-4" />

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
              {toggling ? "..." : collected ? "❌ Remover" : "✅ Tenho esta figurinha!"}
            </button>
          ) : (
            <p className="text-center text-gray-500 text-sm font-nunito">
              {collected ? "✓ Coletada" : "Ainda não coletada"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
