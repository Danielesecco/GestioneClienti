import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUtenteCorrente } from "@/lib/auth";
import NuovoOperatoreForm from "@/components/NuovoOperatoreForm";

export const dynamic = "force-dynamic";

export default async function OperatoriPage() {
  const { profilo } = await getUtenteCorrente();

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
              <p className="text-ink font-medium">{p.nome || p.email}</p>
              <p className="text-sm text-slate">{p.email}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                p.ruolo === "admin"
                  ? "bg-moss text-paper"
                  : "bg-line text-ink"
              }`}
            >
              {p.ruolo === "admin" ? "Admin" : "Operatore"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
