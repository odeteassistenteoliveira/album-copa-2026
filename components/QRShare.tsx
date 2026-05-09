"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRShareProps {
  slug: string;
}

export default function QRShare({ slug }: QRShareProps) {
  const [open, setOpen] = useState(false);
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/comparar/${slug}`
    : `https://album-copa-2026.vercel.app/comparar/${slug}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bebas text-sm px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm"
      >
        <span>📷</span>
        <span className="hidden sm:inline">Comparar</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bebas text-xl text-yellow-400">Comparar Álbuns</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-xl transition-colors">✕</button>
            </div>

            <p className="text-gray-400 text-sm font-nunito mb-5 leading-relaxed">
              Mostre este QR code para outra pessoa escanear. Vocês verão exatamente quais figurinhas podem trocar entre si!
            </p>

            <div className="flex justify-center mb-5">
              <div className="bg-white p-4 rounded-2xl">
                <QRCodeSVG value={url} size={200} level="M" />
              </div>
            </div>

            <div className="bg-dark border border-dark-border rounded-xl px-3 py-2 mb-4">
              <p className="text-gray-500 text-xs font-nunito break-all text-center">{url}</p>
            </div>

            <button
              onClick={() => { navigator.clipboard.writeText(url); }}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bebas text-base py-2.5 rounded-xl transition-colors"
            >
              📋 Copiar link
            </button>
          </div>
        </div>
      )}
    </>
  );
}
