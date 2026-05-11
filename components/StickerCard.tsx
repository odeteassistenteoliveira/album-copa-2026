"use client";

import { useRef, useState } from "react";
import Image from "next/image";

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

const DOUBLE_TAP_MS    = 300;
const LONG_PRESS_MS    = 500;
const SCROLL_THRESHOLD = 15;

// Retorna caminho local da figurinha Panini para qualquer seleção
function getStickerImage(teamCode: string, number: number): string {
  const team = teamCode.toLowerCase();
  const num = String(number).padStart(2, "0");
  return `/stickers/${team}/${team}_${num}.jpg`;
}

export default function StickerCard({
  number, teamCode, teamFlag, quantity, onClick, onLongPress, onQuantityChange, readOnly = false,
}: StickerCardProps) {
  const collected = quantity >= 1;
  const hasDupe   = quantity >= 2;
  const stickerImg = getStickerImage(teamCode, number);
  const [imgError, setImgError] = useState(false);
  const showImg = !imgError;

  const lastTap      = useRef<number>(0);
  const singleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos     = useRef<{ x: number; y: number } | null>(null);
  const isScrolling  = useRef(false);
  const didLongPress = useRef(false);
  const touchDone    = useRef(false);

  const clearTimers = () => {
    if (singleTimer.current) clearTimeout(singleTimer.current);
    if (pressTimer.current)  clearTimeout(pressTimer.current);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startPos.current     = { x: t.clientX, y: t.clientY };
    isScrolling.current  = false;
    didLongPress.current = false;
    touchDone.current    = false;
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
    e.preventDefault();
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (isScrolling.current || didLongPress.current) return;
    touchDone.current = true;
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      if (singleTimer.current) clearTimeout(singleTimer.current);
      lastTap.current = 0;
      onClick?.();
    } else {
      lastTap.current = now;
    }
  };

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

  const onMouseUp = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  return (
    <div className="flex flex-col items-center gap-1">
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
          relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-100 select-none
          ${collected
            ? "border-yellow-400 bg-gradient-to-b from-yellow-800/40 to-yellow-900/30 active:scale-90 shadow-md shadow-yellow-900/30"
            : "border-gray-700/60 bg-dark-card active:scale-90 active:border-yellow-700/50"
          }
          ${!readOnly ? "cursor-pointer" : collected ? "cursor-default" : "cursor-default opacity-40"}
        `}
      >
        {/* ── FIGURINHA COM IMAGEM REAL ── */}
        {collected && showImg ? (
          <>
            <Image
              src={stickerImg}
              alt={`${teamCode}-${number}`}
              fill
              sizes="120px"
              className="object-cover"
              priority={false}
              onError={() => setImgError(true)}
            />
            {/* overlay sutil no topo para badges */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
            {/* Número no canto inferior */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-1">
              <span className="font-bebas text-white text-xs drop-shadow-lg bg-black/40 px-1.5 rounded">
                {number}
              </span>
            </div>
            {/* dot coletado */}
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400 shadow-sm" />
            {/* badge repetida */}
            {hasDupe && (
              <div className="absolute top-1 left-1 bg-blue-500 text-white font-bebas text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none shadow">
                {quantity}
              </div>
            )}
          </>
        ) : collected ? (
          /* ── FIGURINHA COMUM COLETADA ── */
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-1">
              <span className="text-3xl sm:text-2xl leading-none">{teamFlag}</span>
              <span className="text-yellow-300 font-bebas text-sm sm:text-xs leading-none">{number}</span>
            </div>
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400 shadow-sm" />
            {hasDupe && (
              <div className="absolute top-1 left-1 bg-blue-500 text-white font-bebas text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none shadow">
                {quantity}
              </div>
            )}
          </>
        ) : (
          /* ── FIGURINHA NÃO COLETADA ── */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-1">
              <>
                <span className="text-2xl sm:text-xl leading-none opacity-15">{teamFlag}</span>
                <span className="text-gray-600 font-bebas text-sm sm:text-xs leading-none">{number}</span>
              </>
          </div>
        )}
      </button>

      {/* Botões +/- abaixo do card */}
      {collected && !readOnly && onQuantityChange && (
        <div className="flex items-center gap-0.5 w-full">
          {hasDupe && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuantityChange(-1); }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bebas rounded-md py-0.5 transition-colors"
            >−</button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onQuantityChange(1); }}
            className="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bebas rounded-md py-0.5 transition-colors"
          >+</button>
        </div>
      )}
    </div>
  );
}
