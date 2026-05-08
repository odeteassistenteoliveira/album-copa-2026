"use client";

import { useRef } from "react";

interface StickerCardProps {
  number: number;
  teamCode: string;
  teamName: string;
  teamFlag: string;
  quantity: number;
  onClick?: () => void;
  onLongPress?: () => void;
  onQuantityChange?: (delta: number) => void;
  readOnly?: boolean;
}

const SCROLL_THRESHOLD = 20; // px — movimento acima disso = rolagem, ignora
const LONG_PRESS_MS = 500;

export default function StickerCard({
  number, teamFlag, quantity, onClick, onLongPress, onQuantityChange, readOnly = false,
}: StickerCardProps) {
  const collected = quantity >= 1;
  const hasDupe = quantity >= 2;

  const pressTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos    = useRef<{ x: number; y: number } | null>(null);
  const didLongPress = useRef(false);
  const isScrolling  = useRef(false);

  // ── touch handlers ────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startPos.current   = { x: t.clientX, y: t.clientY };
    isScrolling.current = false;
    didLongPress.current = false;

    if (onLongPress) {
      pressTimer.current = setTimeout(() => {
        if (!isScrolling.current) {
          didLongPress.current = true;
          onLongPress();
        }
      }, LONG_PRESS_MS);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!startPos.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startPos.current.x);
    const dy = Math.abs(t.clientY - startPos.current.y);
    if (dx > SCROLL_THRESHOLD || dy > SCROLL_THRESHOLD) {
      isScrolling.current = true;
      if (pressTimer.current) clearTimeout(pressTimer.current);
    }
  };

  const onTouchEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (isScrolling.current || didLongPress.current) return;
    onClick?.();
  };

  // ── mouse handlers (desktop) ──────────────────────────────────────────────
  const onMouseDown = () => {
    didLongPress.current = false;
    if (onLongPress) {
      pressTimer.current = setTimeout(() => {
        didLongPress.current = true;
        onLongPress();
      }, LONG_PRESS_MS);
    }
  };

  const onMouseUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleClick = () => {
    if (didLongPress.current) return;
    onClick?.();
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        // desktop
        onClick={handleClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        // mobile — usa touch diretamente (evita scroll)
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        disabled={readOnly && !collected}
        className={`
          relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-100 select-none
          ${collected
            ? "border-yellow-400 bg-gradient-to-b from-yellow-800/40 to-yellow-900/30 active:scale-90 active:brightness-125"
            : "border-gray-700 bg-dark-card hover:border-yellow-400/40 active:scale-90 active:bg-yellow-900/20"
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

      {/* Botões +/- para repetidas */}
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
