"use client";

interface AlbumStatsProps {
  collected: number;
  total: number;
  albumName: string;
  compact?: boolean;
}

export default function AlbumStats({
  collected,
  total,
  albumName,
  compact = false,
}: AlbumStatsProps) {
  const percent = total > 0 ? Math.round((collected / total) * 100) : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-bebas text-yellow-400 text-lg leading-none">
            {collected}/{total}
          </div>
          <div className="text-gray-400 text-xs">{percent}%</div>
        </div>
        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
      <h2 className="font-bebas text-3xl text-yellow-400 mb-4 text-center tracking-wide">
        {albumName}
      </h2>

      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2 font-nunito">
          <span>Progresso do álbum</span>
          <span className="text-yellow-400 font-bold">{percent}%</span>
        </div>
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-dark-border">
          <div
            className="h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-400 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${percent}%` }}
          >
            {percent > 5 && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer bg-[length:200%_100%]" />
            )}
          </div>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-dark rounded-xl p-3 border border-dark-border">
          <div className="font-bebas text-3xl text-yellow-400">{collected}</div>
          <div className="text-gray-400 text-xs font-nunito">Coletadas</div>
        </div>
        <div className="bg-dark rounded-xl p-3 border border-dark-border">
          <div className="font-bebas text-3xl text-gray-400">
            {total - collected}
          </div>
          <div className="text-gray-400 text-xs font-nunito">Faltam</div>
        </div>
        <div className="bg-dark rounded-xl p-3 border border-dark-border">
          <div className="font-bebas text-3xl text-white">{total}</div>
          <div className="text-gray-400 text-xs font-nunito">Total</div>
        </div>
      </div>
    </div>
  );
}
