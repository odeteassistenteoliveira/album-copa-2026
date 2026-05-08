"use client";

interface StickerCardProps {
  number: number;
  teamCode: string;
  teamName: string;
  teamFlag: string;
  quantity: number;
  onClick?: () => void;
  onQuantityChange?: (delta: number) => void;
  readOnly?: boolean;
}

export default function StickerCard({
  number,
  teamFlag,
  quantity,
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
          relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-150
          ${collected
            ? "border-yellow-400 bg-gradient-to-b from-yellow-800/40 to-yellow-900/30"
            : "border-gray-700 bg-dark-card hover:border-gray-500"
          }
          ${!readOnly ? "cursor-pointer hover:scale-105 active:scale-95" : collected ? "cursor-default" : "cursor-default opacity-50"}
        `}
      >
        {collected ? (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <span className="text-base">{teamFlag}</span>
              <span className="text-yellow-400 font-bebas text-xs leading-none">{number}</span>
            </div>
            {/* Brilho dourado */}
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-yellow-400" />
            {/* Badge repetida */}
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

      {/* Botões +/- para marcar repetidas — só em stickers coletados */}
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
