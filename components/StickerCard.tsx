"use client";

import { useRef, useState } from "react";

interface StickerCardProps {
  number: number;
  teamCode: string;
  teamName: string;
  teamFlag: string;
  quantity: number;
  onClick?: () => void;      // marca/desmarca (acionado após 2s segurando)
  onLongPress?: () => void;  // não usado mais, mantido por compatibilidade
  onQuantityChange?: (delta: number) => void;
  readOnly?: boolean;
}

const HOLD_MS         = 2000; // 2s segurando para marcar
const SCROLL_THRESHOLD = 20;

export default function StickerCard({
  number, teamFlag, quantity, onClick, onQuantityChange, readOnly = false,
}: StickerCardProps) {
  const collected = quantity >= 1;
  const hasDupe   = quantity >= 2;

  const [progress, setProgress] = useState(0); // 0–100 para a barra de progresso
  const pressTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef    = useRef<number | null>(null);
  const startTime   = useRef<number>(0);
  const startPos    = useRef<{ x: number; y: number } | null>(null);
  const isScrolling = useRef(false);
  const fired       = useRef(false);

  const startHold = () => {
    fired.current    = false;
    isScrolling.current = false;
    startTime.current = Date.now();
    setProgress(0);

    // Anima a barra de progresso
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const pct     = Math.min((elapsed / HOLD_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);

    // Dispara a ação ao fim dos 2s
    pressTimer.current = setTimeout(() => {
      if (!isScrolling.current) {
        fired.current = true;
        setProgress(0);
        onClick?.();
      }
    }, HOLD_MS);
  };

  const cancelHold = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (frameRef.current)   cancelAnimationFrame(frameRef.current);
    setProgress(0);
  };

  // ── Touch ────────────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startPos.current = { x: t.clientX, y: t.clientY };
    startHold();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!startPos.current) return;
    const t  = e.touches[0];
    const dx = Math.abs(t.clientX - startPos.current.x);
    const dy = Math.abs(t.clientY - startPos.current.y);
    if (dx > SCROLL_THRESHOLD || dy > SCROLL_THRESHOLD) {
      isScrolling.current = true;
      cancelHold();
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // evita click sintético
    cancelHold();
  };

  // ── Mouse (desktop) ──────────────────────────────────────────────────────
  const onMouseDown = () => startHold();
  const onMouseUp   = () => cancelHold();

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        // Sem onClick — ação só ocorre ao completar os 2s
        onClick={(e) => e.preventDefault()}
        disabled={readOnly && !collected}
        className={`
          relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-100 select-none
          ${collected
            ? "border-yellow-400 bg-gradient-to-b from-yellow-800/40 to-yellow-900/30"
            : "border-gray-700 bg-dark-card"
          }
          ${!readOnly ? "cursor-pointer" : collected ? "cursor-default" : "cursor-default opacity-50"}
        `}
      >
        {/* Barra de progresso do hold */}
        {progress > 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-yellow-400 transition-none z-10"
            style={{ width: `${progress}%` }}
          />
        )}

        {collected ? (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <span className="text-base">{teamFlag}</span>
              <span className="text-yellow-400 font-bebas text-xs leading-none">{number}</span>
            </div>
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-yellow-400" />
            {hasDupe && (
              <div className="absolute top-0.5 left-0.5 bg-blue-500 text-white font-bebas text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {quantity}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-sm opacity-20">{teamFlag}</span>
            <span className="text-gray-600 font-bebas text-xs">{number}</span>
          </div>
        )}
      </button>

      {collected && !readOnly && onQuantityChange && (
        <div className="flex items-center gap-0.5 w-full">
          {hasDupe && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuantityChange(-1); }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bebas rounded py-0.5 transition-colors"
            >−</button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onQuantityChange(1); }}
            className="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bebas rounded py-0.5 transition-colors"
          >+</button>
        </div>
      )}
    </div>
  );
}
