"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function EliminaOperatoreButton({
  profiloId,
  nome,
}: {
  profiloId: string;
  nome: string;
}) {
  const router = useRouter();
  const [conferma, setConferma] = useState(false);
  const [eliminazione, setEliminazione] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  async function handleDelete() {
    setEliminazione(true);
    setErrore(null);

    try {
      const res = await fetch(`/api/operatori/${profiloId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Errore durante l'eliminazione.");
      }

      router.refresh();
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Errore imprevisto.");
      setEliminazione(false);
      setConferma(false);
    }
  }

  if (!conferma) {
    return (
      <button
        onClick={() => setConferma(true)}
        title={`Elimina ${nome}`}
        className="text-slate hover:text-clay transition-colors"
      >
        <Trash2 size={16} strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {errore && <span className="text-xs text-clay">{errore}</span>}
      <span className="text-xs text-slate">Eliminare?</span>
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
