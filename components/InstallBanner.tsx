"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Já está instalado como app — não mostra
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Usuário já dispensou antes — não mostra de novo
    if (localStorage.getItem("install-banner-dismissed") === "1") return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios) {
      // iOS: mostra banner após 1.5s
      setTimeout(() => setShow(true), 1500);
    } else {
      // Android/Desktop: aguarda o evento do browser
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      window.addEventListener("appinstalled", () => setShow(false));
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleInstall = async () => {
    if (isIOS) return; // iOS usa os passos manuais visíveis no banner
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
    setInstalling(false);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("install-banner-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 animate-slide-up">
      <div className="max-w-lg mx-auto bg-dark-card border border-yellow-400/50 rounded-2xl shadow-gold overflow-hidden">
        {/* Barra dourada no topo */}
        <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Ícone do app */}
            <div className="w-14 h-14 rounded-2xl bg-dark border border-yellow-400/30 flex items-center justify-center text-3xl shrink-0">
              🏆
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-white font-bebas text-lg leading-tight">Álbum Copa 2026</p>
                  <p className="text-gray-400 text-xs font-nunito">Adicione à tela inicial e acesse como app</p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-gray-600 hover:text-gray-400 text-xl leading-none shrink-0 mt-0.5"
                >✕</button>
              </div>

              {isIOS ? (
                /* iOS: instrução inline */
                <div className="mt-3 bg-dark rounded-xl p-3 text-xs font-nunito text-gray-300 space-y-1">
                  <p>1. Toque em <span className="text-yellow-400 font-bold">Compartilhar ⎙</span> no Safari</p>
                  <p>2. Role e toque em <span className="text-yellow-400 font-bold">"Adicionar à Tela de Início"</span></p>
                  <p>3. Toque em <span className="text-yellow-400 font-bold">Adicionar</span> → pronto! 🎉</p>
                </div>
              ) : (
                /* Android/Desktop: botão de 1 toque */
                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className="mt-3 w-full bg-yellow-400 text-black font-bebas text-lg py-2.5 rounded-xl hover:bg-yellow-300 transition-all active:scale-95 disabled:opacity-60"
                >
                  {installing ? "Instalando…" : "📲 Adicionar à tela inicial"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
