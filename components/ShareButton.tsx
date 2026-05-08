"use client";

import { useState } from "react";

interface ShareButtonProps {
  slug: string;
  compact?: boolean;
}

export default function ShareButton({ slug, compact = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/album/${slug}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/album/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Meu Álbum Copa 2026",
        text: "Veja meu álbum de figurinhas da Copa do Mundo 2026! 🏆",
        url,
      });
    } else {
      handleCopy();
    }
  };

  // Versão compacta para o header — apenas ícone
  if (compact) {
    return (
      <button
        onClick={handleShare}
        title={copied ? "Link copiado!" : "Compartilhar álbum"}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-95
          ${copied
            ? "text-green-400 bg-green-900/30"
            : "text-gray-400 hover:text-yellow-400 hover:bg-white/5"
          }`}
      >
        {copied ? "✓" : "🔗"}
      </button>
    );
  }

  // Versão completa para uso em página
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-black font-bebas text-lg px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-all active:scale-95 shadow-gold"
      >
        <span>🔗</span>
        Compartilhar Álbum
      </button>
      <button
        onClick={handleCopy}
        className={`
          flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-nunito text-sm border-2 transition-all active:scale-95
          ${copied
            ? "border-green-500 text-green-400 bg-green-900/20"
            : "border-dark-border text-gray-400 hover:border-gray-600"
          }
        `}
      >
        {copied ? "✓ Copiado!" : "📋 Copiar link"}
      </button>
    </div>
  );
}
