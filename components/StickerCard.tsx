"use client";

import Image from "next/image";

interface StickerCardProps {
  number: number;
  teamCode: string;
  teamName: string;
  teamFlag: string;
  quantity: number;
  imageUrl?: string | null;
  onClick?: () => void;
  onQuantityChange?: (delta: number) => void;
  readOnly?: boolean;
}

export default function StickerCard({
  number,
  teamFlag,
  quantity,
  imageUrl,
  onClick,
  onQuantityChange,
  readOnly = false,
}: StickerCardProps) {
  const collected = quantity >= 1;
  const hasDupe = quantity >= 2;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={onClick}
        disabled={readOnly && !collected}
        className={`
          relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-200
          ${collected
            ? "border-yellow-400 shadow-gold bg-gradient-to-b from-yellow-900/40 to-yellow-800/20"
            : "border-gray-700 bg-dark-card hover:border-gray-500"
          }
          ${!readOnly ? "cursor-pointer hover:scale-105 active:scale-95" : collected ? "cursor-default" : "cursor-default opacity-60"}
        `}
        title={`#${number}`}
      >
        {collected && imageUrl ? (
          <>
            <Image src={imageUrl} alt={`#${number}`} fill className="object-cover object-top" sizes="12vw" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-yellow-400/10" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-yellow-400 text-center font-bebas text-xs py-0.5">{number}</div>
            <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-yellow-400 shadow-gold-sm" />
          </>
        ) : collected ? (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-700/30 to-yellow-900/20">
              <span className="text-lg">{teamFlag}</span>
              <span className="text-yellow-400 font-bebas text-sm">{number}</span>
            </div>
            <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-yellow-400" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-base opacity-30">{teamFlag}</span>
            <span className="text-gray-500 font-bebas text-sm">{number}</span>
          </div>
        )}

        {/* Badge de repetidas */}
        {hasDupe && (
          <div className="absolute top-0.5 left-0.5 bg-blue-500 text-white font-bebas text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {quantity}
          </div>
        )}
      </button>

      {/* Controle de quantidade — só para stickers coletados e não readOnly */}
      {collected && !readOnly && onQuantityChange && (
        <div className="flex items-center gap-0.5 w-full">
          {hasDupe && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuantityChange(-1); }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bebas rounded py-0.5 transition-colors leading-none"
              title="Remover repetida"
            >−</button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onQuantityChange(1); }}
            className="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bebas rounded py-0.5 transition-colors leading-none"
            title="Marcar repetida"
          >+</button>
        </div>
      )}
    </div>
  );
}
