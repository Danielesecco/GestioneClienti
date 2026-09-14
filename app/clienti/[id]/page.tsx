import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClienteForm from "@/components/ClienteForm";
import EliminaClienteButton from "@/components/EliminaClienteButton";
import AttivitaForm from "@/components/AttivitaForm";
import EliminaAttivitaButton from "@/components/EliminaAttivitaButton";
import { createClient } from "@/lib/supabase/server";
import { getUtenteCorrente } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ClientePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { profilo } = await getUtenteCorrente();

  const { data: cliente } = await supabase
    .from("clienti")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!cliente) notFound();

  const { data: attivitaGrezze } = await supabase
    .from("attivita")
    .select("id, data_evento, descrizione, foto_url, operatore_id")
    .eq("cliente_id", params.id)
    .order("data_evento", { ascending: false })
    .order("creato_il", { ascending: false });

  const idOperatori = Array.from(
    new Set((attivitaGrezze ?? []).map((a) => a.operatore_id).filter(Boolean))
  );

  let mappaOperatori: Record<string, { nome: string | null; email: string | null }> = {};

  if (idOperatori.length > 0) {
    const { data: operatori } = await supabase
      .from("profiles")
      .select("id, nome, email")
      .in("id", idOperatori as string[]);

    mappaOperatori = Object.fromEntries(
      (operatori ?? []).map((o) => [o.id, { nome: o.nome, email: o.email }])
    );
  }

  const attivita = (attivitaGrezze ?? []).map((a) => ({
    ...a,
    autore: a.operatore_id ? mappaOperatori[a.operatore_id] : null,
  }));

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">
          {cliente.nome} {cliente.cognome}
        </h1>
        {profilo?.ruolo === "admin" && (
          <EliminaClienteButton id={cliente.id} />
        )}
      </div>

      <ClienteForm clienteIniziale={cliente} />

      <div className="mt-6">
        <Link
          href={`/clienti/${cliente.id}/consulenza`}
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded border border-line hover:border-moss hover:text-moss transition-colors"
        >
          Scheda di consulenza
        </Link>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-ink">Attività</h2>
          <AttivitaForm clienteId={cliente.id} />
        </div>

        {attivita.length === 0 && (
          <p className="text-sm text-slate">
            Nessuna attività registrata per questo cliente.
          </p>
        )}

        <ul className="space-y-3">
          {attivita.map((evento) => {
            return (
              <li
                key={evento.id}
                className="border border-line rounded p-4 bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-ink font-medium">
                    {new Date(evento.data_evento).toLocaleDateString("it-IT")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate">
                      {evento.autore?.nome || evento.autore?.email || "Utente"}
                    </span>
                    {profilo?.ruolo === "admin" && (
                      <EliminaAttivitaButton id={evento.id} />
                    )}
                  </div>
                </div>
                {evento.descrizione && (
                  <p className="text-sm text-ink mb-2">{evento.descrizione}</p>
                )}
                {evento.foto_url && (
                  <div className="relative w-full max-w-xs h-40 rounded overflow-hidden">
                    <Image
                      src={evento.foto_url}
                      alt="Foto attività"
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
