import { notFound } from "next/navigation";
import ClienteForm from "@/components/ClienteForm";
import EliminaClienteButton from "@/components/EliminaClienteButton";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ClientePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: cliente } = await supabase
    .from("clienti")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!cliente) notFound();

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">
          {cliente.nome} {cliente.cognome}
        </h1>
        <EliminaClienteButton id={cliente.id} />
      </div>
      <ClienteForm clienteIniziale={cliente} />
    </div>
  );
}
