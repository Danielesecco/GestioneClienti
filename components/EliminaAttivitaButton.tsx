"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function EliminaAttivitaButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [conferma, setConferma] = useState(false);
  const [eliminazione, setEliminazione] = useState(false);

  async function handleDelete() {
    setEliminazione(true);
    const { error } = await supabase.from("attivita").delete().eq("id", id);
    if (!error) {
      router.refresh();
    } else {
      setEliminazione(false);
    }
  }

  if (!conferma) {
    return (
      <button
        onClick={() => setConferma(true)}
        title="Elimina attività"
        className="text-slate hover:text-clay transition-colors flex-shrink-0"
      >
        <Trash2 size={15} strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <button
        onClick={handleDelete}
        disabled={eliminazione}
        className="text-xs px-2 py-1 rounded bg-clay text-white hover:bg-ink transition-colors disabled:opacity-60"
      >
        {eliminazione ? "…" : "Sì"}
      </button>
      <button
        onClick={() => setConferma(false)}
        className="text-xs px-2 py-1 rounded border border-line hover:bg-paper"
      >
        Annulla
      </button>
    </div>
  );
}
