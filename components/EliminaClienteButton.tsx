"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EliminaClienteButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [conferma, setConferma] = useState(false);
  const [eliminazione, setEliminazione] = useState(false);

  async function handleDelete() {
    setEliminazione(true);
    const { error } = await supabase.from("clienti").delete().eq("id", id);
    if (!error) {
      router.push("/");
      router.refresh();
    } else {
      setEliminazione(false);
    }
  }

  if (!conferma) {
    return (
      <button
        onClick={() => setConferma(true)}
        className="text-sm px-4 py-2 rounded border border-line text-clay hover:bg-clay hover:text-paper transition-colors"
      >
        Elimina cliente
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate">Confermi l&apos;eliminazione?</span>
      <button
        onClick={handleDelete}
        disabled={eliminazione}
        className="text-sm px-3 py-1.5 rounded bg-clay text-paper hover:bg-ink transition-colors disabled:opacity-60"
      >
        {eliminazione ? "Eliminazione…" : "Sì, elimina"}
      </button>
      <button
        onClick={() => setConferma(false)}
        className="text-sm px-3 py-1.5 rounded border border-line hover:bg-paper"
      >
        Annulla
      </button>
    </div>
  );
}
