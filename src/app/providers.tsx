"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ContactCard } from "./components/ContactCard";

export function Providers({ children }: { children: React.ReactNode }) {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const pathname = usePathname();

    // Páginas onde o Header e Footer não devem aparecer
    const hideHeaderFooter = pathname === "/membros";

    return (
        <>
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
        </>
    );
}
