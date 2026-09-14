"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Cliente = {
  id?: string;
  nome: string;
  cognome: string;
  azienda?: string | null;
  email?: string | null;
  telefono?: string | null;
  indirizzo?: string | null;
  note?: string | null;
  foto_url?: string | null;
};

export default function ClienteForm({
  clienteIniziale,
}: {
  clienteIniziale?: Cliente;
}) {
  const router = useRouter();
  const supabase = createClient();
  const isModifica = Boolean(clienteIniziale?.id);

  const [dati, setDati] = useState<Cliente>(
    clienteIniziale ?? {
      nome: "",
      cognome: "",
      azienda: "",
      email: "",
      telefono: "",
      indirizzo: "",
      note: "",
      foto_url: "",
    }
  );
  const [file, setFile] = useState<File | null>(null);
  const [anteprima, setAnteprima] = useState<string | null>(
    clienteIniziale?.foto_url ?? null
  );
  const [salvataggio, setSalvataggio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setAnteprima(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvataggio(true);
    setErrore(null);

    try {
      let foto_url = dati.foto_url ?? null;

      if (file) {
        const estensione = file.name.split(".").pop();
        const percorso = `${crypto.randomUUID()}.${estensione}`;

        const { error: uploadError } = await supabase.storage
          .from("foto-clienti")
          .upload(percorso, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: pubblico } = supabase.storage
          .from("foto-clienti")
          .getPublicUrl(percorso);

        foto_url = pubblico.publicUrl;
      }

      const payload = { ...dati, foto_url };

      if (isModifica && clienteIniziale?.id) {
        const { error } = await supabase
          .from("clienti")
          .update(payload)
          .eq("id", clienteIniziale.id);
        if (error) throw error;
        router.push(`/clienti/${clienteIniziale.id}`);
      } else {
        const { data: nuovo, error } = await supabase
          .from("clienti")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        router.push(`/clienti/${nuovo.id}`);
      }
      router.refresh();
    } catch (err) {
      setErrore(
        err instanceof Error ? err.message : "Errore durante il salvataggio."
      );
      setSalvataggio(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-line overflow-hidden flex-shrink-0 relative">
          {anteprima ? (
            <Image
              src={anteprima}
              alt="Anteprima foto cliente"
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate text-xs text-center px-1">
              Nessuna foto
            </div>
          )}
        </div>
        <label className="text-sm px-3 py-2 rounded border border-line bg-white cursor-pointer hover:bg-paper">
          Carica foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Campo
          label="Nome"
          value={dati.nome}
          onChange={(v) => setDati({ ...dati, nome: v })}
          required
        />
        <Campo
          label="Cognome"
          value={dati.cognome}
          onChange={(v) => setDati({ ...dati, cognome: v })}
          required
        />
      </div>

      <Campo
        label="Azienda"
        value={dati.azienda ?? ""}
        onChange={(v) => setDati({ ...dati, azienda: v })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Campo
          label="Email"
          type="email"
          value={dati.email ?? ""}
          onChange={(v) => setDati({ ...dati, email: v })}
        />
        <Campo
          label="Telefono"
          value={dati.telefono ?? ""}
          onChange={(v) => setDati({ ...dati, telefono: v })}
        />
      </div>

      <Campo
        label="Indirizzo"
        value={dati.indirizzo ?? ""}
        onChange={(v) => setDati({ ...dati, indirizzo: v })}
      />

      <div>
        <label className="block text-sm text-slate mb-1">Note</label>
        <textarea
          value={dati.note ?? ""}
          onChange={(e) => setDati({ ...dati, note: e.target.value })}
          rows={4}
          className="w-full border border-line rounded px-3 py-2 bg-white text-ink"
        />
      </div>

      {errore && <p className="text-sm text-clay">{errore}</p>}

      <button
        type="submit"
        disabled={salvataggio}
        className="px-5 py-2.5 rounded bg-moss text-paper hover:bg-ink transition-colors disabled:opacity-60"
      >
        {salvataggio ? "Salvataggio…" : "Salva cliente"}
      </button>
    </form>
  );
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-slate mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line rounded px-3 py-2 bg-white text-ink"
      />
    </div>
  );
}
