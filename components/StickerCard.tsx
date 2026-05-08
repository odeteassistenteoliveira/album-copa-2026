"use client";

import Image from "next/image";

interface StickerCardProps {
  number: number;
  teamCode: string;
  teamName: string;
  teamFlag: string;
  collected: boolean;
  imageUrl?: string | null;
  onClick?: () => void;
  readOnly?: boolean;
}

export default function StickerCard({
  number,
  teamCode,
  teamFlag,
  collected,
  imageUrl,
  onClick,
  readOnly = false,
}: StickerCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={readOnly && !collected}
      className={`
        relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-200
        ${
          collected
            ? "border-yellow-400 shadow-gold bg-gradient-to-b from-yellow-900/40 to-yellow-800/20 animate-pop-in"
            : "border-gray-700 bg-dark-card hover:border-gray-500"
        }
        ${!readOnly ? "cursor-pointer hover:scale-105 active:scale-95" : collected ? "cursor-default" : "cursor-default opacity-60"}
      `}
      title={`${teamFlag} #${number}`}
    >
      {collected && imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={`Figurinha ${teamCode} #${number}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 12vw, 8vw"
            unoptimized
          />
          {/* Overlay dourado sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-yellow-400/10" />
          {/* Número */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-yellow-400 text-center font-bebas text-xs leading-tight py-0.5">
            {number}
          </div>
          {/* Brilho dourado no canto */}
          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-yellow-400 shadow-gold-sm" />
        </>
      ) : collected ? (
        <>
          {/* Coletada mas sem imagem */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-700/30 to-yellow-900/20">
            <span className="text-lg">{teamFlag}</span>
            <span className="text-yellow-400 font-bebas text-sm">{number}</span>
          </div>
          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-yellow-400" />
        </>
      ) : (
        <>
          {/* Não coletada */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-base opacity-30">{teamFlag}</span>
            <span className="text-gray-500 font-bebas text-sm">{number}</span>
          </div>
          {/* Padrão de fundo */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_white,_transparent_70%)]" />
        </>
      )}
    </button>
  );
}
