import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Álbum Copa 2026 🏆",
  description:
    "Crie seu álbum digital de figurinhas da Copa do Mundo 2026 e compartilhe com amigos e família!",
  openGraph: {
    title: "Álbum Copa 2026 🏆",
    description: "Acompanhe sua coleção de figurinhas da Copa 2026",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-dark antialiased">{children}</body>
    </html>
  );
}
