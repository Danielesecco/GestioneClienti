import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ConsulenzaForm from "@/components/ConsulenzaForm";

export const dynamic = "force-dynamic";

export default async function ConsulenzaPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: cliente } = await supabase
    .from("clienti")
    .select("id, nome, cognome")
    .eq("id", params.id)
    .single();

  if (!cliente) notFound();

  const { data: consulenza } = await supabase
    .from("consulenze")
    .select("*")
    .eq("cliente_id", params.id)
    .maybeSingle();

  return (
    <div className="max-w-xl">
      <Link
        href={`/clienti/${cliente.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-moss transition-colors mb-4"
      >
        <ArrowLeft size={15} strokeWidth={1.75} />
        {cliente.nome} {cliente.cognome}
      </Link>

      <p className="font-display italic text-moss text-base mb-0.5">
        Consulenza
      </p>
      <h1 className="font-heading font-extrabold text-3xl text-ink uppercase tracking-tight mb-1">
        Master FitFor
      </h1>
      <p className="text-sm text-slate mb-6">
        Ascolto, analisi e progettazione personalizzata dell&apos;immagine.
      </p>

      <ConsulenzaForm clienteId={cliente.id} consulenzaIniziale={consulenza} />
    </div>
  );
}
