"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Mode = "hidden" | "prompt" | "ios" | "manual";

export default function InstallPWA({ variant = "header" }: { variant?: "header" | "banner" }) {
  const [mode, setMode] = useState<Mode>("hidden");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true;

    if (standalone) return; // já instalado

    if (ios) { setMode("ios"); return; }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setMode("prompt");
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setMode("hidden"));

    // Fallback: mostra botão manual após 2s se o prompt não aparecer
    const t = setTimeout(() => {
      setMode(prev => prev === "hidden" ? "manual" : prev);
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(t);
    };
  }, []);

  const handleInstall = async () => {
    if (mode === "ios") { setShowIOSModal(true); return; }
    if (mode === "manual") {
      const isAndroid = /android/i.test(navigator.userAgent);
      if (isAndroid) {
        alert("No Chrome: toque nos 3 pontinhos (⋮) no canto superior direito → \"Adicionar à tela inicial\"");
      } else {
        alert("No Chrome: clique no ícone de instalar (⊕) na barra de endereço\n\nOu: Menu (⋮) → \"Instalar Álbum Copa 2026\"");
      }
      return;
    }
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setMode("hidden");
    setDeferredPrompt(null);
    setInstalling(false);
  };

  if (mode === "hidden") return null;

  // ── VARIANTE BANNER (landing page / destaque) ──────────────────────────
  if (variant === "banner") {
    return (
      <>
        <button
          onClick={handleInstall}
          className="inline-flex items-center gap-3 bg-dark-card border-2 border-yellow-400/60 text-white font-bebas text-xl px-8 py-4 rounded-2xl hover:border-yellow-400 hover:bg-yellow-400/5 transition-all active:scale-95"
        >
          <span className="text-3xl">📲</span>
          {installing ? "Instalando…" : "Baixar App — Tela Inicial"}
        </button>
        <p className="text-gray-600 text-xs font-nunito mt-2">
          {mode === "ios" ? "iPhone: Compartilhar ⎙ → Adicionar à Tela de Início" : "Funciona sem internet após instalar"}
        </p>
        {showIOSModal && <IOSModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  // ── VARIANTE HEADER (compacta) ─────────────────────────────────────────
  return (
    <>
      <button
        onClick={handleInstall}
        title="Baixar app na tela inicial"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-all text-xs font-nunito whitespace-nowrap"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 16V4m0 12l-4-4m4 4l4-4"/><path d="M3 20h18"/>
        </svg>
        {installing ? "…" : "Instalar"}
      </button>
      {showIOSModal && <IOSModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
}

function IOSModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-dark-card border border-yellow-400/40 rounded-2xl p-5 w-full max-w-sm shadow-gold mb-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-bebas text-xl">📲 Adicionar à tela inicial</p>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
        </div>
        <div className="space-y-3 font-nunito text-sm text-gray-300">
          {[
            { n: "1️⃣", text: <>Toque no botão <span className="text-yellow-400 font-bold">Compartilhar</span> <span className="text-base">⎙</span> na barra do Safari</> },
            { n: "2️⃣", text: <>Role para baixo e toque em <span className="text-yellow-400 font-bold">"Adicionar à Tela de Início"</span></> },
            { n: "3️⃣", text: <>Toque em <span className="text-yellow-400 font-bold">Adicionar</span> no canto superior direito</> },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-center gap-3 bg-dark rounded-xl p-3">
              <span className="text-2xl shrink-0">{n}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-yellow-400 text-black font-bebas text-lg py-2.5 rounded-xl hover:bg-yellow-300 transition-all"
        >
          Entendi!
        </button>
      </div>
    </div>
  );
}
