import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestione Clienti",
  description: "Anagrafica clienti con dati e foto",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="font-sans min-h-screen">
        <header className="border-b border-line bg-paper">
          <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-display text-xl tracking-tight text-ink">
              Gestione Clienti
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/clienti"
                className="text-sm text-ink hover:text-moss transition-colors"
              >
                Clienti
              </Link>
              <Link
                href="/nuovo"
                className="text-sm px-4 py-2 rounded bg-moss text-paper hover:bg-ink transition-colors"
              >
                Nuovo cliente
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
