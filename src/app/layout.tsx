"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ContactCard } from "./components/ContactCard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const pathname = usePathname();

  // Páginas onde o Header e Footer não devem aparecer
  const hideHeaderFooter = pathname === "/membros";

  return (
    <html lang="pt-br">
      <body className="antialiased">
        {!hideHeaderFooter && (
          <Header onContactClick={() => setIsContactOpen(true)} />
        )}

        {children}

        {!hideHeaderFooter && (
          <>
            <ContactCard
              isOpen={isContactOpen}
              onClose={() => setIsContactOpen(false)}
            />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
