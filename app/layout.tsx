import type { Metadata } from "next";
import "./globals.css";
import InstallBanner from "@/components/InstallBanner";

export const metadata: Metadata = {
  title: "Álbum Copa 2026 🏆",
  description: "Crie seu álbum digital de figurinhas da Copa do Mundo 2026 e compartilhe com amigos e família!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Copa 2026",
  },
  openGraph: {
    title: "Álbum Copa 2026 🏆",
    description: "Acompanhe sua coleção de figurinhas da Copa 2026",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Copa 2026" />
        <meta name="theme-color" content="#facc15" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function(){});
              });
            }
          `
        }} />
      </head>
      <body className="min-h-screen bg-dark antialiased">{children}<InstallBanner /></body>
    </html>
  );
}
