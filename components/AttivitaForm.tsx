"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AttivitaForm({ clienteId }: { clienteId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [dataEvento, setDataEvento] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [descrizione, setDescrizione] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [salvataggio, setSalvataggio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [aperto, setAperto] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvataggio(true);
    setErrore(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let foto_url: string | null = null;

      if (file) {
        const estensione = file.name.split(".").pop();
        const percorso = `eventi/${crypto.randomUUID()}.${estensione}`;

        const { error: uploadError } = await supabase.storage
          .from("foto-clienti")
          .upload(percorso, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: pubblico } = supabase.storage
          .from("foto-clienti")
          .getPublicUrl(percorso);

        foto_url = pubblico.publicUrl;
      }

      const { error } = await supabase.from("attivita").insert({
        cliente_id: clienteId,
        data_evento: dataEvento,
        descrizione,
        foto_url,
        operatore_id: user?.id,
      });

      if (error) throw error;

      setDescrizione("");
      setFile(null);
      setAperto(false);
      router.refresh();
    } catch (err) {
      setErrore(
        err instanceof Error ? err.message : "Errore durante il salvataggio."
      );
    } finally {
      setSalvataggio(false);
    }
  }

  if (!aperto) {
    return (
      <button
        onClick={() => setAperto(true)}
        className="text-sm px-4 py-2 rounded bg-moss text-paper hover:bg-ink transition-colors"
      >
        Aggiungi attività
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-line rounded p-4 bg-white space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate mb-1">Data</label>
          <input
            type="date"
            required
            value={dataEvento}
            onChange={(e) => setDataEvento(e.target.value)}
            className="w-full border border-line rounded px-3 py-2 bg-white text-ink"
          />
        </div>
        <div>
          <label className="block text-sm text-slate mb-1">Foto (opzionale)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate mb-1">Descrizione</label>
        <textarea
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          rows={3}
          placeholder="Cosa è stato fatto…"
          className="w-full border border-line rounded px-3 py-2 bg-white text-ink"
        />
      </div>

      {errore && <p className="text-sm text-clay">{errore}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={salvataggio}
          className="px-4 py-2 rounded bg-moss text-paper hover:bg-ink transition-colors disabled:opacity-60"
        >
          {salvataggio ? "Salvataggio…" : "Salva attività"}
        </button>
        <button
          type="button"
          onClick={() => setAperto(false)}
          className="px-4 py-2 rounded border border-line hover:bg-paper"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
