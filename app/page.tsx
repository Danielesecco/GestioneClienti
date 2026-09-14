import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createClient();
  const query = searchParams.q?.trim() ?? "";

  let request = supabase
    .from("clienti")
    .select("id, nome, cognome, azienda, email, telefono, foto_url")
    .order("creato_il", { ascending: false })
    .limit(50);

  if (query) {
    request = request.or(
      `nome.ilike.%${query}%,cognome.ilike.%${query}%,azienda.ilike.%${query}%,email.ilike.%${query}%`
    );
  }

  const { data: clienti, error } = await request;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Clienti</h1>
      </div>

      <form className="mb-6">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Cerca per nome, azienda o email…"
          className="w-full border border-line rounded px-4 py-2.5 bg-white text-ink"
        />
      </form>

      {error && (
        <p className="text-clay text-sm mb-4">
          Errore nel caricamento: {error.message}
        </p>
      )}

      {clienti && clienti.length === 0 && (
        <div className="border border-dashed border-line rounded p-10 text-center">
          <p className="text-slate mb-4">
            {query
              ? "Nessun cliente corrisponde alla ricerca."
              : "Non hai ancora inserito nessun cliente."}
          </p>
          <Link
            href="/nuovo"
            className="inline-block text-sm px-4 py-2 rounded bg-moss text-paper hover:bg-ink transition-colors"
          >
            Aggiungi il primo cliente
          </Link>
        </div>
      )}

      <ul className="divide-y divide-line border border-line rounded overflow-hidden">
        {clienti?.map((cliente) => (
          <li key={cliente.id}>
            <Link
              href={`/clienti/${cliente.id}`}
              className="flex items-center gap-4 px-4 py-3 bg-white hover:bg-paper transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-line overflow-hidden flex-shrink-0 relative">
                {cliente.foto_url ? (
                  <Image
                    src={cliente.foto_url}
                    alt={`${cliente.nome} ${cliente.cognome}`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate text-sm">
                    {cliente.nome?.[0]}
                    {cliente.cognome?.[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-ink font-medium truncate">
                  {cliente.nome} {cliente.cognome}
                </p>
                <p className="text-sm text-slate truncate">
                  {[cliente.azienda, cliente.email, cliente.telefono]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
