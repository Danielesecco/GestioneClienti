import Link from "next/link";
import { UserPlus, Users, ShieldCheck, ChevronRight } from "lucide-react";
import { getUtenteCorrente } from "@/lib/auth";

export default async function Home() {
  const { profilo } = await getUtenteCorrente();
  const isAdmin = profilo?.ruolo === "admin";

  return (
    <div className="max-w-md mx-auto pt-8">
      <p className="font-display italic text-moss text-lg mb-1">
        Bentornat{profilo?.nome ? "a" : "o"}
      </p>
      <h1 className="font-heading font-bold text-3xl text-ink mb-8">
        {profilo?.nome || "Ciao"}
      </h1>

      <nav className="space-y-3">
        <VoceMenu
          href="/nuovo"
          icona={<UserPlus size={20} strokeWidth={1.6} />}
          titolo="Aggiungi cliente"
          descrizione="Inserisci un nuovo cliente con dati e foto"
        />
        <VoceMenu
          href="/clienti"
          icona={<Users size={20} strokeWidth={1.6} />}
          titolo="Lista clienti"
          descrizione="Cerca, apri e gestisci i clienti esistenti"
        />
        {isAdmin && (
          <VoceMenu
            href="/admin/operatori"
            icona={<ShieldCheck size={20} strokeWidth={1.6} />}
            titolo="Gestisci operatori"
            descrizione="Crea e visualizza gli account del team"
          />
        )}
      </nav>
    </div>
  );
}

function VoceMenu({
  href,
  icona,
  titolo,
  descrizione,
}: {
  href: string;
  icona: React.ReactNode;
  titolo: string;
  descrizione: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border border-line rounded-lg pl-5 pr-4 py-4 bg-white hover:border-moss transition-colors"
    >
      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss">
        {icona}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-heading font-semibold text-ink">{titolo}</span>
        <span className="block text-sm text-slate">{descrizione}</span>
      </span>
      <ChevronRight
        size={18}
        strokeWidth={1.75}
        className="text-moss opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      />
    </Link>
  );
}
