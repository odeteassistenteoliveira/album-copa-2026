"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true;

    if (standalone) { setIsInstalled(true); return; }
    if (ios) { setIsIOS(true); return; }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    // Se após 3s o prompt não aparecer, mostra botão de fallback manual
    const t = setTimeout(() => setShowFallback(true), 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(t);
    };
  }, []);

  const handleInstall = async () => {
    if (prompt) {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setPrompt(null);
    }
  };

  if (isInstalled) return null;

  // iOS — botão que abre modal com instrução
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-all text-xs font-nunito"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 16V4m0 12l-4-4m4 4l4-4"/><path d="M3 20h18"/>
          </svg>
          Instalar
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowIOSModal(false)}>
            <div className="bg-dark-card border border-yellow-400/40 rounded-2xl p-5 w-full max-w-sm shadow-gold mb-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bebas text-xl">Salvar na tela inicial</p>
                <button onClick={() => setShowIOSModal(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
              </div>
              <div className="space-y-3 font-nunito text-sm text-gray-300">
                <div className="flex items-center gap-3 bg-dark rounded-xl p-3">
                  <span className="text-2xl">1️⃣</span>
                  <p>Toque no botão <span className="text-yellow-400 font-bold">Compartilhar</span> na barra do Safari <span className="text-lg">⎙</span></p>
                </div>
                <div className="flex items-center gap-3 bg-dark rounded-xl p-3">
                  <span className="text-2xl">2️⃣</span>
                  <p>Role para baixo e toque em <span className="text-yellow-400 font-bold">&quot;Adicionar à Tela de Início&quot;</span></p>
                </div>
                <div className="flex items-center gap-3 bg-dark rounded-xl p-3">
                  <span className="text-2xl">3️⃣</span>
                  <p>Toque em <span className="text-yellow-400 font-bold">Adicionar</span> no canto superior direito</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Android/Desktop com prompt nativo disponível
  if (prompt) {
    return (
      <button
        onClick={handleInstall}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-all text-xs font-nunito"
        title="Instalar app na tela inicial"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 16V4m0 12l-4-4m4 4l4-4"/><path d="M3 20h18"/>
        </svg>
        Instalar
      </button>
    );
  }

  // Fallback: navegador não suporta ou bloqueou o prompt
  if (showFallback) {
    return (
      <button
        onClick={() => alert('Para instalar:\n\nChrome/Android: toque nos 3 pontinhos (⋮) → "Adicionar à tela inicial"\n\nSafari/iOS: toque em Compartilhar ⎙ → "Adicionar à Tela de Início"')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-600 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-400 transition-all text-xs font-nunito"
        title="Como instalar o app"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 16V4m0 12l-4-4m4 4l4-4"/><path d="M3 20h18"/>
        </svg>
        Instalar
      </button>
    );
  }

  return null;
}
