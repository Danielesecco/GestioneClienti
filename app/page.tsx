import Link from "next/link";
import { getUtenteCorrente } from "@/lib/auth";

export default async function Home() {
  const { profilo } = await getUtenteCorrente();
  const isAdmin = profilo?.ruolo === "admin";

  return (
    <div className="max-w-md mx-auto pt-8">
      <h1 className="font-display text-2xl text-ink mb-1">
        Ciao{profilo?.nome ? `, ${profilo.nome}` : ""}
      </h1>
      <p className="text-sm text-slate mb-8">Cosa vuoi fare?</p>

      <nav className="space-y-3">
        <VoceMenu
          href="/nuovo"
          titolo="Aggiungi cliente"
          descrizione="Inserisci un nuovo cliente con dati e foto"
        />
        <VoceMenu
          href="/clienti"
          titolo="Lista clienti"
          descrizione="Cerca, apri e gestisci i clienti esistenti"
        />
        {isAdmin && (
          <VoceMenu
            href="/admin/operatori"
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
  titolo,
  descrizione,
}: {
  href: string;
  titolo: string;
  descrizione: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-line rounded-lg px-5 py-4 bg-white hover:border-moss hover:bg-paper transition-colors"
    >
      <p className="font-display text-lg text-ink">{titolo}</p>
      <p className="text-sm text-slate">{descrizione}</p>
    </Link>
  );
}
