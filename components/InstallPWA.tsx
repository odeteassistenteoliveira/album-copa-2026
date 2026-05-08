"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as { standalone?: boolean }).standalone === true;

    if (isInStandalone) { setInstalled(true); return; }
    if (isIOS) { setShowIOS(true); return; }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  if (installed) return null;

  if (showIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-dark-card border border-yellow-400/50 rounded-2xl p-4 z-50 shadow-gold">
        <button
          onClick={() => setShowIOS(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-white text-lg"
        >✕</button>
        <div className="flex items-start gap-3">
          <span className="text-2xl">📱</span>
          <div>
            <p className="text-white font-bebas text-lg">Salvar na tela inicial</p>
            <p className="text-gray-400 text-sm font-nunito mt-1">
              Toque em <span className="text-yellow-400">Compartilhar</span> <span className="text-lg">⎙</span> e depois em{" "}
              <span className="text-yellow-400">&quot;Adicionar à tela inicial&quot;</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 transition-all text-sm font-nunito"
      title="Instalar app"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 16V4m0 12l-4-4m4 4l4-4"/>
        <path d="M3 20h18"/>
      </svg>
      <span className="hidden sm:inline">Instalar app</span>
    </button>
  );
}
