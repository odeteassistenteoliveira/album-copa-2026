"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRShareProps {
  slug: string;
}

export default function QRShare({ slug }: QRShareProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/comparar/${slug}`);
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bebas text-sm px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm"
      >
        <span>🤝</span>
        <span className="hidden sm:inline">Comparar</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          {/* Sheet que sobe de baixo no mobile, modal centralizado no desktop */}
          <div
            className="bg-dark-card border border-dark-border rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-5 pb-8 sm:pb-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar (mobile) */}
            <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bebas text-xl text-yellow-400">🤝 Comparar Álbuns</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-400 text-sm font-nunito mb-4 leading-relaxed">
              Mostre este QR code para outro colecionador escanear. Verão na hora quais figurinhas podem trocar!
            </p>

            {/* QR code — tamanho responsivo */}
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-2xl shadow-lg">
                {url && <QRCodeSVG value={url} size={180} level="M" />}
              </div>
            </div>

            {/* URL */}
            <div className="bg-dark border border-dark-border rounded-xl px-3 py-2 mb-4">
              <p className="text-gray-500 text-xs font-nunito break-all text-center leading-relaxed">{url}</p>
            </div>

            <button
              onClick={handleCopy}
              className={`w-full font-bebas text-base py-3 rounded-xl transition-all active:scale-95 ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-purple-600 hover:bg-purple-500 text-white"
              }`}
            >
              {copied ? "✅ Link copiado!" : "📋 Copiar link"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
