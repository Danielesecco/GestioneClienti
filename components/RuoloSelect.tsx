"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Ruolo = "admin" | "operatore";

export default function RuoloSelect({
  profiloId,
  ruoloIniziale,
}: {
  profiloId: string;
  ruoloIniziale: Ruolo;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [ruolo, setRuolo] = useState<Ruolo>(ruoloIniziale);
  const [salvataggio, setSalvataggio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  async function handleChange(nuovoRuolo: Ruolo) {
    setSalvataggio(true);
    setErrore(null);

    const { error } = await supabase
      .from("profiles")
      .update({ ruolo: nuovoRuolo })
      .eq("id", profiloId);

    if (error) {
      setErrore("Impossibile aggiornare il ruolo.");
      setSalvataggio(false);
      return;
    }

    setRuolo(nuovoRuolo);
    setSalvataggio(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={ruolo}
        disabled={salvataggio}
        onChange={(e) => handleChange(e.target.value as Ruolo)}
        className={`text-xs px-2 py-1 rounded border-0 cursor-pointer disabled:opacity-60 ${
          ruolo === "admin" ? "bg-moss text-paper" : "bg-line text-ink"
        }`}
      >
        <option value="operatore">Operatore</option>
        <option value="admin">Admin</option>
      </select>
      {errore && <span className="text-xs text-clay">{errore}</span>}
    </div>
  );
}
