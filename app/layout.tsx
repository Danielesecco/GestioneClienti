import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Users, UserPlus, ShieldCheck } from "lucide-react";
import { getUtenteCorrente } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitFor — Gestione Clienti",
  description: "Anagrafica clienti con dati, foto e storico attività",
  icons: {
    icon: "https://cdn.shopify.com/s/files/1/0885/9310/5237/files/logo_fitfor.png?v=1731591585",
  },
};

const LOGO_URL =
  "https://cdn.shopify.com/s/files/1/0885/9310/5237/files/logo_fitfor.png?v=1731591585";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profilo } = await getUtenteCorrente();

  return (
    <html lang="it">
      <body className="font-sans min-h-screen">
        <header className="bg-paper">
          <div className="mx-auto max-w-5xl px-6 pt-6 pb-4 flex items-end justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src={LOGO_URL}
                alt="FitFor"
                width={38}
                height={38}
                className="object-contain"
                priority
              />
              <span>
                <span className="block text-[11px] text-slate tracking-[0.08em] mt-0.5">
                  gestione clienti
                </span>
              </span>
            </Link>

            {user ? (
              <nav className="flex items-center gap-4">
                <Link
                  href="/clienti"
                  className="flex items-center gap-1.5 text-sm text-ink hover:text-moss transition-colors"
                >
                  <Users size={16} strokeWidth={1.75} />
                  Clienti
                </Link>
                {profilo?.ruolo === "admin" && (
                  <Link
                    href="/admin/operatori"
                    className="flex items-center gap-1.5 text-sm text-ink hover:text-moss transition-colors"
                  >
                    <ShieldCheck size={16} strokeWidth={1.75} />
                    Operatori
                  </Link>
                )}
                <Link
                  href="/nuovo"
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded bg-moss text-paper hover:bg-ink transition-colors"
                >
                  <UserPlus size={16} strokeWidth={1.75} />
                  Nuovo cliente
                </Link>
                <span className="w-px h-5 bg-line" />
                <LogoutButton />
              </nav>
            ) : (
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded bg-moss text-paper hover:bg-ink transition-colors"
              >
                Accedi
              </Link>
            )}
          </div>
          <div className="h-px bg-gradient-to-r from-moss/0 via-moss/40 to-moss/0" />
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
