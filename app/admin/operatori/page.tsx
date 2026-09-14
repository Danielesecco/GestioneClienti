import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUtenteCorrente } from "@/lib/auth";
import NuovoOperatoreForm from "@/components/NuovoOperatoreForm";
import RuoloSelect from "@/components/RuoloSelect";
import EliminaOperatoreButton from "@/components/EliminaOperatoreButton";

export const dynamic = "force-dynamic";

export default async function OperatoriPage() {
  const { user, profilo } = await getUtenteCorrente();

  if (profilo?.ruolo !== "admin") {
    redirect("/");
  }

  const supabase = createClient();
  const { data: profili } = await supabase
    .from("profiles")
    .select("id, nome, email, ruolo, creato_il")
    .order("creato_il", { ascending: true });

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-ink mb-6">Operatori</h1>

      <NuovoOperatoreForm />

      <ul className="divide-y divide-line border border-line rounded overflow-hidden">
        {profili?.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between px-4 py-3 bg-white"
          >
            <div>
              <p className="text-ink font-medium">
                {p.nome || p.email}
                {p.id === user?.id && (
                  <span className="text-xs text-slate ml-2">(tu)</span>
                )}
              </p>
              <p className="text-sm text-slate">{p.email}</p>
            </div>

            {p.id === user?.id ? (
              <span className="text-xs px-2 py-1 rounded bg-moss text-white">
                Admin
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <RuoloSelect profiloId={p.id} ruoloIniziale={p.ruolo} />
                <EliminaOperatoreButton
                  profiloId={p.id}
                  nome={p.nome || p.email}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate mt-4">
        Non puoi cambiare il tuo stesso ruolo o eliminare il tuo account da
        qui, per evitare di restare fuori per errore.
      </p>
    </div>
  );
}
