"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuovoOperatoreForm() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [salvataggio, setSalvataggio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [successo, setSuccesso] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvataggio(true);
    setErrore(null);
    setSuccesso(false);

    try {
      const res = await fetch("/api/operatori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Errore durante la creazione.");
      }

      setNome("");
      setEmail("");
      setPassword("");
      setSuccesso(true);
      router.refresh();
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Errore imprevisto.");
    } finally {
      setSalvataggio(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-line rounded p-4 bg-white space-y-4 mb-8"
    >
      <h2 className="font-display text-lg text-ink">Nuovo operatore</h2>

      <div>
        <label className="block text-sm text-slate mb-1">Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-line rounded px-3 py-2 bg-white text-ink"
        />
      </div>

      <div>
        <label className="block text-sm text-slate mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line rounded px-3 py-2 bg-white text-ink"
        />
      </div>

      <div>
        <label className="block text-sm text-slate mb-1">
          Password iniziale
        </label>
        <input
          type="text"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Comunicala tu stesso all'operatore"
          className="w-full border border-line rounded px-3 py-2 bg-white text-ink"
        />
      </div>

      {errore && <p className="text-sm text-clay">{errore}</p>}
      {successo && (
        <p className="text-sm text-moss">Operatore creato correttamente.</p>
      )}

      <button
        type="submit"
        disabled={salvataggio}
        className="px-4 py-2 rounded bg-moss text-paper hover:bg-ink transition-colors disabled:opacity-60"
      >
        {salvataggio ? "Creazione…" : "Crea operatore"}
      </button>
    </form>
  );
}
