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

export default function StickerCard({
  number, teamFlag, quantity, onClick, onLongPress, onQuantityChange, readOnly = false,
}: StickerCardProps) {
  const collected = quantity >= 1;
  const hasDupe = quantity >= 2;

  // Long press: 500ms segurando abre o modal de detalhes
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const handlePressStart = () => {
    didLongPress.current = false;
    if (onLongPress) {
      pressTimer.current = setTimeout(() => {
        didLongPress.current = true;
        onLongPress();
      }, 500);
    }
  };

  const handlePressEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleClick = () => {
    if (didLongPress.current) return; // long press já tratado
    onClick?.();
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={handleClick}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        disabled={readOnly && !collected}
        className={`
          relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-100
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
