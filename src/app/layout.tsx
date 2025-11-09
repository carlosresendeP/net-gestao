import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "NetGestão - grupo de Negócios Inteligente",
    template: "%s | NetGestão",
  },
  description:
    "Plataforma completa para gestão de grupos de negócios profissionais. Conecte-se, gere indicações e acompanhe oportunidades comerciais em tempo real.",
  keywords: [
    "rede de negócios",
    "networking",
    "indicações comerciais",
    "BNI",
    "gestão de membros",
    "oportunidades de negócio",
    "networking profissional",
    "CRM",
    "comunidade empresarial",
  ],
  authors: [{ name: "NetGestão Team" }],
  creator: "Carlos Paula",
  publisher: "NetGestão",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "NetGestão",
    title: "NetGestão - Grupo de Negócios Inteligente",
    description:
      "Conecte-se com profissionais, gere indicações qualificadas e acompanhe oportunidades comerciais. Sistema completo para gestão de redes de negócios.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NetGestão - Rede de Negócios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NetGestão - Rede de Negócios Inteligente",
    description:
      "Plataforma completa para gestão de redes profissionais e indicações comerciais.",
    images: ["/og-image.png"],
    creator: "@netgestao",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "Business",
  classification: "Business Networking Platform",
  applicationName: "NetGestão",
  referrer: "origin-when-cross-origin",
  appleWebApp: {
    capable: true,
    title: "NetGestão",
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#0f172a",
    "theme-color": "#0f172a",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
