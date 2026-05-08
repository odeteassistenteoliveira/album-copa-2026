"use client";

import { useRef } from "react";

interface StickerCardProps {
  number: number;
  teamCode: string;
  teamName: string;
  teamFlag: string;
  quantity: number;
  onClick?: () => void;       // duplo toque → marca/desmarca
  onLongPress?: () => void;   // segurar → abre card de detalhes
  onQuantityChange?: (delta: number) => void;
  readOnly?: boolean;
}

const DOUBLE_TAP_MS   = 300;  // intervalo máximo entre dois toques para contar como duplo
const LONG_PRESS_MS   = 500;  // tempo segurando para abrir card
const SCROLL_THRESHOLD = 15;

export default function StickerCard({
  number, teamFlag, quantity, onClick, onLongPress, onQuantityChange, readOnly = false,
}: StickerCardProps) {
  const collected = quantity >= 1;
  const hasDupe   = quantity >= 2;

  // ── refs ─────────────────────────────────────────────────────────────────
  const lastTap      = useRef<number>(0);
  const singleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos     = useRef<{ x: number; y: number } | null>(null);
  const isScrolling  = useRef(false);
  const didLongPress = useRef(false);
  const touchDone    = useRef(false); // bloqueia o click sintético do browser

  const clearTimers = () => {
    if (singleTimer.current) clearTimeout(singleTimer.current);
    if (pressTimer.current)  clearTimeout(pressTimer.current);
  };

  // ── Touch ────────────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startPos.current    = { x: t.clientX, y: t.clientY };
    isScrolling.current  = false;
    didLongPress.current = false;
    touchDone.current    = false;

    // Long press
    pressTimer.current = setTimeout(() => {
      if (!isScrolling.current) {
        didLongPress.current = true;
        touchDone.current    = true;
        onLongPress?.();
      }
    }, LONG_PRESS_MS);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!startPos.current) return;
    const t  = e.touches[0];
    const dx = Math.abs(t.clientX - startPos.current.x);
    const dy = Math.abs(t.clientY - startPos.current.y);
    if (dx > SCROLL_THRESHOLD || dy > SCROLL_THRESHOLD) {
      isScrolling.current = true;
      clearTimers();
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // evita click sintético do browser
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (isScrolling.current || didLongPress.current) return;

    touchDone.current = true;
    const now = Date.now();

    if (now - lastTap.current < DOUBLE_TAP_MS) {
      // Duplo toque — marca/desmarca
      if (singleTimer.current) clearTimeout(singleTimer.current);
      lastTap.current = 0;
      onClick?.();
    } else {
      // Primeiro toque — espera para ver se vem um segundo
      lastTap.current = now;
    }
  };

  // ── Mouse (desktop) ──────────────────────────────────────────────────────
  const handleClick = () => {
    if (touchDone.current) { touchDone.current = false; return; }
    if (didLongPress.current) return;

    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      if (singleTimer.current) clearTimeout(singleTimer.current);
      lastTap.current = 0;
      onClick?.();
    } else {
      lastTap.current = now;
    }
  };

  const onMouseDown = () => {
    didLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress?.();
    }, LONG_PRESS_MS);
  };

  const onMouseUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={handleClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        disabled={readOnly && !collected}
        className={`
          relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-100 select-none
          ${collected
            ? "border-yellow-400 bg-gradient-to-b from-yellow-800/40 to-yellow-900/30 active:scale-90"
            : "border-gray-700 bg-dark-card active:scale-90 active:bg-yellow-900/10"
          }
          ${!readOnly ? "cursor-pointer" : collected ? "cursor-default" : "cursor-default opacity-50"}
        `}
      >
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
