"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import RuotaArmocromia from "@/components/RuotaArmocromia";
import DiagrammaViso from "@/components/DiagrammaViso";
import DiagrammaOcchio from "@/components/DiagrammaOcchio";

type Consulenza = Record<string, any>;

const FORME_VISO = [
  "ovale",
  "oblungo",
  "quadrato",
  "diamante",
  "cuore",
  "tondo",
  "triangolo",
  "triangolo inverso",
];

const PALETTE_IRIDE = [
  { nome: "Nero", colore: "#111111" },
  { nome: "Antracite", colore: "#3B3B3B" },
  { nome: "Grigio", colore: "#9C9C9C" },
  { nome: "Argento", colore: "#C7C7C7" },
  { nome: "Blu notte", colore: "#1B2A4A" },
  { nome: "Blu", colore: "#1F4E8C" },
  { nome: "Azzurro", colore: "#7FB3D5" },
  { nome: "Turchese", colore: "#1ABC9C" },
  { nome: "Verde bosco", colore: "#145A32" },
  { nome: "Verde", colore: "#2E7D32" },
  { nome: "Oliva", colore: "#6B8E23" },
  { nome: "Salvia", colore: "#9CAF88" },
  { nome: "Giallo", colore: "#F1C40F" },
  { nome: "Oro", colore: "#D4AF37" },
  { nome: "Ambra", colore: "#FFBF00" },
  { nome: "Arancio", colore: "#E67E22" },
  { nome: "Rame", colore: "#B56A3C" },
  { nome: "Rosso", colore: "#C0392B" },
  { nome: "Marrone", colore: "#6B4226" },
  { nome: "Nocciola", colore: "#A56B46" },
  { nome: "Beige", colore: "#E8DCC8" },
  { nome: "Rosa", colore: "#E8A0BF" },
  { nome: "Viola", colore: "#8E44AD" },
  { nome: "Bianco", colore: "#FFFFFF" },
];

const PUNTI_IRIDE = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function ConsulenzaForm({
  clienteId,
  consulenzaIniziale,
}: {
  clienteId: string;
  consulenzaIniziale: Consulenza | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [dati, setDati] = useState<Consulenza>(
    consulenzaIniziale ?? {
      iride_punti: {},
      iride_palette: [],
      fs_occhio_cm: ["", "", "", "", ""],
    }
  );
  const [foto, setFoto] = useState<{
    prima: File | null;
    dopo: File | null;
    ispirazione: File | null;
  }>({ prima: null, dopo: null, ispirazione: null });
  const [salvataggio, setSalvataggio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [salvato, setSalvato] = useState(false);

  function set(campo: string, valore: any) {
    setDati((d: Consulenza) => ({ ...d, [campo]: valore }));
    setSalvato(false);
  }

  function setPuntoIride(punto: string, campo: "colore" | "codice", valore: string) {
    setDati((d: Consulenza) => ({
      ...d,
      iride_punti: {
        ...(d.iride_punti ?? {}),
        [punto]: { ...(d.iride_punti?.[punto] ?? {}), [campo]: valore },
      },
    }));
  }

  function toggleColorePalette(nome: string) {
    setDati((d: Consulenza) => {
      const attuale: string[] = d.iride_palette ?? [];
      const nuovo = attuale.includes(nome)
        ? attuale.filter((c) => c !== nome)
        : [...attuale, nome];
      return { ...d, iride_palette: nuovo };
    });
  }

  function setServizio(chiave: string, valore: any) {
    setDati((d: Consulenza) => ({
      ...d,
      servizi: { ...(d.servizi ?? {}), [chiave]: valore },
    }));
    setSalvato(false);
  }

  function setOcchioCm(indice: number, valore: string) {
    setDati((d: Consulenza) => {
      const arr = [...(d.fs_occhio_cm ?? ["", "", "", "", ""])];
      arr[indice] = valore;
      return { ...d, fs_occhio_cm: arr };
    });
  }

  async function caricaFoto(file: File, cartella: string) {
    const estensione = file.name.split(".").pop();
    const percorso = `consulenze/${cartella}/${crypto.randomUUID()}.${estensione}`;
    const { error } = await supabase.storage
      .from("foto-clienti")
      .upload(percorso, file);
    if (error) throw error;
    const { data } = supabase.storage.from("foto-clienti").getPublicUrl(percorso);
    return data.publicUrl;
  }

  async function handleSalva() {
    setSalvataggio(true);
    setErrore(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const aggiornamenti: Consulenza = { ...dati };

      if (foto.prima) aggiornamenti.foto_prima = await caricaFoto(foto.prima, "prima");
      if (foto.dopo) aggiornamenti.foto_dopo = await caricaFoto(foto.dopo, "dopo");
      if (foto.ispirazione)
        aggiornamenti.foto_ispirazione = await caricaFoto(foto.ispirazione, "ispirazione");

      const { error } = await supabase.from("consulenze").upsert(
        {
          ...aggiornamenti,
          cliente_id: clienteId,
          operatore_id: user?.id,
        },
        { onConflict: "cliente_id" }
      );

      if (error) throw error;

      setDati(aggiornamenti);
      setFoto({ prima: null, dopo: null, ispirazione: null });
      setSalvato(true);
      router.refresh();
    } catch (err) {
      setErrore(
        err instanceof Error ? err.message : "Errore durante il salvataggio."
      );
    } finally {
      setSalvataggio(false);
    }
  }

  return (
    <div className="space-y-10 pb-24">
      {/* LA TUA STORIA */}
      <Sezione titolo="La tua storia" sottotitolo="Ascolto e desideri del cliente">
        <CampoFoto
          etichetta="Foto prima"
          fileScelto={foto.prima}
          urlEsistente={dati.foto_prima}
          onChange={(f) => setFoto((s) => ({ ...s, prima: f }))}
        />
        <CampoFoto
          etichetta="Foto dopo"
          fileScelto={foto.dopo}
          urlEsistente={dati.foto_dopo}
          onChange={(f) => setFoto((s) => ({ ...s, dopo: f }))}
        />
        <CampoFoto
          etichetta="Immagine d'ispirazione"
          fileScelto={foto.ispirazione}
          urlEsistente={dati.foto_ispirazione}
          onChange={(f) => setFoto((s) => ({ ...s, ispirazione: f }))}
        />

        <TestoArea
          etichetta="Le sue giornate: lavoro, tempo libero, sport…"
          valore={dati.racconto_giornate}
          onChange={(v) => set("racconto_giornate", v)}
        />
        <TestoArea
          etichetta="Che rapporto ha con i suoi capelli?"
          valore={dati.rapporto_capelli}
          onChange={(v) => set("rapporto_capelli", v)}
        />
        <TestoArea
          etichetta="Quanto tempo vuole dedicare ai capelli al mattino?"
          valore={dati.tempo_mattino}
          onChange={(v) => set("tempo_mattino", v)}
        />
        <TestoArea
          etichetta="Come si prende cura normalmente dei capelli, dal lavaggio all'uscita di casa"
          valore={dati.routine_cura}
          onChange={(v) => set("routine_cura", v)}
        />
        <TestoArea
          etichetta="Come vorrebbe che fossero i suoi capelli?"
          valore={dati.capelli_desiderati}
          onChange={(v) => set("capelli_desiderati", v)}
        />
        <TestoArea
          etichetta="Come sono i capelli oggi? Quando sente che non vanno bene?"
          valore={dati.capelli_oggi}
          onChange={(v) => set("capelli_oggi", v)}
        />
        <TestoArea
          etichetta="Quanto valore dà ai capelli nel complesso della sua immagine?"
          valore={dati.valore_capelli}
          onChange={(v) => set("valore_capelli", v)}
        />
        <TestoArea
          etichetta="Quanto è disposta a occuparsene tra un appuntamento e l'altro? Cosa non farebbe mai?"
          valore={dati.disponibilita_cura}
          onChange={(v) => set("disponibilita_cura", v)}
        />
        <TestoArea
          etichetta="Preferisce risultati naturali o un look che si fa notare?"
          valore={dati.preferenza_look}
          onChange={(v) => set("preferenza_look", v)}
        />
        <TestoArea
          etichetta="In passato, un look che l'ha fatta sentire bene? Cosa le piaceva?"
          valore={dati.esperienza_positiva}
          onChange={(v) => set("esperienza_positiva", v)}
        />
        <TestoArea
          etichetta="Se dovessimo migliorare una sola cosa, quale sarebbe?"
          valore={dati.miglioramento_prioritario}
          onChange={(v) => set("miglioramento_prioritario", v)}
        />
        <TestoArea
          etichetta="Uscendo dal salone, come vorrebbe sentirsi?"
          valore={dati.sensazione_uscita}
          onChange={(v) => set("sensazione_uscita", v)}
        />
      </Sezione>

      {/* ARMOCROMIA */}
      <Sezione titolo="Armocromia" sottotitolo="Stagione colore di riferimento">
        <div>
          <EtichettaCampo testo="Stagione" />
          <RuotaArmocromia
            valore={dati.arm_stagione}
            onChange={(v) => set("arm_stagione", v)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Scelta
            etichetta="Sottotono"
            opzioni={["caldo", "freddo"]}
            valore={dati.arm_sottotono}
            onChange={(v) => set("arm_sottotono", v)}
          />
          <Scelta
            etichetta="Intensità"
            opzioni={["alta", "bassa"]}
            valore={dati.arm_intensita}
            onChange={(v) => set("arm_intensita", v)}
          />
          <Scelta
            etichetta="Contrasto"
            opzioni={["alto", "basso"]}
            valore={dati.arm_contrasto}
            onChange={(v) => set("arm_contrasto", v)}
          />
          <Scelta
            etichetta="Valore"
            opzioni={["chiaro", "scuro"]}
            valore={dati.arm_valore}
            onChange={(v) => set("arm_valore", v)}
          />
          <Scelta
            etichetta="Sovratono"
            opzioni={["miele", "rosato"]}
            valore={dati.arm_sovratono}
            onChange={(v) => set("arm_sovratono", v)}
          />
        </div>

        <TestoArea
          etichetta="Note"
          valore={dati.arm_note}
          onChange={(v) => set("arm_note", v)}
        />
      </Sezione>

      {/* FACE SHAPE */}
      <Sezione titolo="Face shape" sottotitolo="Misure e forma del viso">
        <DiagrammaViso />

        <div className="grid grid-cols-2 gap-4">
          <CampoNumero
            etichetta="Porzione superiore (cm)"
            valore={dati.fs_superiore_cm}
            onChange={(v) => set("fs_superiore_cm", v)}
          />
          <CampoNumero
            etichetta="Porzione media (cm)"
            valore={dati.fs_media_cm}
            onChange={(v) => set("fs_media_cm", v)}
          />
          <CampoNumero
            etichetta="Porzione inferiore (cm)"
            valore={dati.fs_inferiore_cm}
            onChange={(v) => set("fs_inferiore_cm", v)}
          />
          <CampoNumero
            etichetta="Lunghezza viso (cm)"
            valore={dati.fs_lunghezza_cm}
            onChange={(v) => set("fs_lunghezza_cm", v)}
          />
          <CampoNumero
            etichetta="Balance point · I livello (cm)"
            valore={dati.fs_balance_1_cm}
            onChange={(v) => set("fs_balance_1_cm", v)}
          />
          <CampoNumero
            etichetta="Balance point · II livello (cm)"
            valore={dati.fs_balance_2_cm}
            onChange={(v) => set("fs_balance_2_cm", v)}
          />
        </div>

        <div>
          <EtichettaCampo testo="Misure occhio (cm)" />
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <input
                key={i}
                type="number"
                step="0.1"
                value={dati.fs_occhio_cm?.[i] ?? ""}
                onChange={(e) => setOcchioCm(i, e.target.value)}
                className="w-full border border-line rounded px-2 py-2 bg-white text-ink text-sm"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Scelta
            etichetta="Profilo"
            opzioni={["fronte", "mento", "pari"]}
            valore={dati.fs_profilo}
            onChange={(v) => set("fs_profilo", v)}
          />
          <Scelta
            etichetta="Scala"
            opzioni={["piccola", "media", "grande"]}
            valore={dati.fs_scala}
            onChange={(v) => set("fs_scala", v)}
          />
        </div>

        <div>
          <EtichettaCampo testo="Face shape" />
          <div className="flex flex-wrap gap-2">
            {FORME_VISO.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => set("fs_forma", f)}
                className={`text-sm px-3 py-1.5 rounded-full border capitalize transition-colors ${
                  dati.fs_forma === f
                    ? "bg-moss text-paper border-moss"
                    : "border-line text-ink hover:border-moss"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Sezione>

      {/* ANALISI IRIDE */}
      <Sezione titolo="Analisi cromatica dell'iride" sottotitolo="Mappatura colori e contrasti">
        <div>
          <EtichettaCampo testo="Mappa dell'iride" />
          <DiagrammaOcchio />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {PUNTI_IRIDE.map((punto) => (
              <div key={punto} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-paper border border-line flex items-center justify-center text-xs text-ink flex-shrink-0">
                  {punto}
                </span>
                <input
                  placeholder="Colore"
                  value={dati.iride_punti?.[punto]?.colore ?? ""}
                  onChange={(e) => setPuntoIride(punto, "colore", e.target.value)}
                  className="flex-1 min-w-0 border border-line rounded px-2 py-1.5 bg-white text-ink text-sm"
                />
                <input
                  placeholder="Codice"
                  value={dati.iride_punti?.[punto]?.codice ?? ""}
                  onChange={(e) => setPuntoIride(punto, "codice", e.target.value)}
                  className="flex-1 min-w-0 border border-line rounded px-2 py-1.5 bg-white text-ink text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <EtichettaCampo testo="Palette di riferimento" />
          <div className="grid grid-cols-6 gap-2">
            {PALETTE_IRIDE.map((c) => {
              const selezionato = (dati.iride_palette ?? []).includes(c.nome);
              return (
                <button
                  key={c.nome}
                  type="button"
                  title={c.nome}
                  onClick={() => toggleColorePalette(c.nome)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded border transition-colors ${
                    selezionato ? "border-moss bg-paper" : "border-transparent"
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-line"
                    style={{ backgroundColor: c.colore }}
                  />
                  <span className="text-[10px] text-slate leading-tight text-center">
                    {c.nome}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CampoTesto
            etichetta="Colore dominante"
            valore={dati.iride_colore_dominante}
            onChange={(v) => set("iride_colore_dominante", v)}
          />
          <CampoTesto
            etichetta="Colore secondario"
            valore={dati.iride_colore_secondario}
            onChange={(v) => set("iride_colore_secondario", v)}
          />
          <CampoTesto
            etichetta="Macchie / pagliuzze"
            valore={dati.iride_macchie}
            onChange={(v) => set("iride_macchie", v)}
          />
          <CampoTesto
            etichetta="Bordo limbale"
            valore={dati.iride_bordo_limbale}
            onChange={(v) => set("iride_bordo_limbale", v)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Scelta
            etichetta="Temperatura"
            opzioni={["calda", "fredda", "neutra"]}
            valore={dati.iride_temperatura}
            onChange={(v) => set("iride_temperatura", v)}
          />
          <Scelta
            etichetta="Intensità"
            opzioni={["brillante", "tenue", "profonda"]}
            valore={dati.iride_intensita}
            onChange={(v) => set("iride_intensita", v)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CampoTesto
            etichetta="Codice dominante"
            valore={dati.iride_codice_dominante}
            onChange={(v) => set("iride_codice_dominante", v)}
          />
          <CampoTesto
            etichetta="Codice secondario"
            valore={dati.iride_codice_secondario}
            onChange={(v) => set("iride_codice_secondario", v)}
          />
          <CampoTesto
            etichetta="Codice accento 1"
            valore={dati.iride_codice_accento1}
            onChange={(v) => set("iride_codice_accento1", v)}
          />
          <CampoTesto
            etichetta="Codice accento 2"
            valore={dati.iride_codice_accento2}
            onChange={(v) => set("iride_codice_accento2", v)}
          />
        </div>

        <CampoTesto
          etichetta="Contrasto complessivo"
          valore={dati.iride_contrasto_complessivo}
          onChange={(v) => set("iride_contrasto_complessivo", v)}
        />
        <TestoArea
          etichetta="Note professionali"
          valore={dati.iride_note_professionali}
          onChange={(v) => set("iride_note_professionali", v)}
        />
      </Sezione>

      {/* PROGETTO PERSONALIZZATO */}
      <Sezione
        titolo="Progetto personalizzato FitFor"
        sottotitolo="Sintesi conclusiva e servizi concordati"
      >
        <TestoArea
          etichetta="Sintesi della consulenza"
          valore={dati.sintesi_consulenza}
          onChange={(v) => set("sintesi_consulenza", v)}
        />
        <TestoArea
          etichetta="Obiettivo concordato"
          valore={dati.obiettivo_concordato}
          onChange={(v) => set("obiettivo_concordato", v)}
        />

        <div>
          <p className="font-heading font-bold text-sm text-ink mb-3">
            Servizi concordati
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-xs font-semibold text-moss uppercase tracking-wide mb-2">
                Area liscio
              </p>
              <Checkbox
                etichetta="Styling liscio"
                checked={!!dati.servizi?.area_liscio_styling}
                onChange={(v) => setServizio("area_liscio_styling", v)}
              />
              <Checkbox
                etichetta="Taglio liscio"
                checked={!!dati.servizi?.area_liscio_taglio}
                onChange={(v) => setServizio("area_liscio_taglio", v)}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-moss uppercase tracking-wide mb-2">
                Area riccio
              </p>
              <Checkbox
                etichetta="Styling ricci"
                checked={!!dati.servizi?.area_riccio_styling}
                onChange={(v) => setServizio("area_riccio_styling", v)}
              />
              <Checkbox
                etichetta="Taglio ricci"
                checked={!!dati.servizi?.area_riccio_taglio}
                onChange={(v) => setServizio("area_riccio_taglio", v)}
              />
            </div>
          </div>

          <p className="text-xs font-semibold text-moss uppercase tracking-wide mt-5 mb-2">
            Trattamenti
          </p>
          <Checkbox
            etichetta="Trattamento Start"
            checked={!!dati.servizi?.trattamenti_start}
            onChange={(v) => setServizio("trattamenti_start", v)}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              etichetta="Trattamento specifico"
              checked={!!dati.servizi?.trattamenti_specifico}
              onChange={(v) => setServizio("trattamenti_specifico", v)}
            />
            <input
              placeholder="quale…"
              value={dati.servizi?.trattamenti_specifico_testo ?? ""}
              onChange={(e) => setServizio("trattamenti_specifico_testo", e.target.value)}
              className="flex-1 border-b border-line bg-transparent text-sm text-ink px-1 py-0.5 focus:outline-none focus:border-moss"
            />
          </div>

          <p className="text-xs font-semibold text-moss uppercase tracking-wide mt-5 mb-2">
            Colore
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Checkbox
                etichetta="Colore Green"
                checked={!!dati.servizi?.colore_green}
                onChange={(v) => setServizio("colore_green", v)}
              />
              <span className="text-xs text-slate">Cod.</span>
              <input
                value={dati.servizi?.colore_green_cod ?? ""}
                onChange={(e) => setServizio("colore_green_cod", e.target.value)}
                className="w-24 border-b border-line bg-transparent text-sm text-ink px-1 py-0.5 focus:outline-none focus:border-moss"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                etichetta="Color Plus"
                checked={!!dati.servizi?.colore_plus}
                onChange={(v) => setServizio("colore_plus", v)}
              />
              <span className="text-xs text-slate">Cod.</span>
              <input
                value={dati.servizi?.colore_plus_cod ?? ""}
                onChange={(e) => setServizio("colore_plus_cod", e.target.value)}
                className="w-24 border-b border-line bg-transparent text-sm text-ink px-1 py-0.5 focus:outline-none focus:border-moss"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                etichetta="Tono su tono"
                checked={!!dati.servizi?.colore_tono_su_tono}
                onChange={(v) => setServizio("colore_tono_su_tono", v)}
              />
              <span className="text-xs text-slate">Cod.</span>
              <input
                value={dati.servizi?.colore_tono_su_tono_cod ?? ""}
                onChange={(e) => setServizio("colore_tono_su_tono_cod", e.target.value)}
                className="w-24 border-b border-line bg-transparent text-sm text-ink px-1 py-0.5 focus:outline-none focus:border-moss"
              />
            </div>
          </div>

          <p className="text-xs font-semibold text-moss uppercase tracking-wide mt-5 mb-2">
            Servizi tecnici
          </p>
          <div className="grid grid-cols-2 gap-x-6">
            <Checkbox
              etichetta="Schiariture"
              checked={!!dati.servizi?.tecnici_schiariture}
              onChange={(v) => setServizio("tecnici_schiariture", v)}
            />
            <Checkbox
              etichetta="Filler / Refill"
              checked={!!dati.servizi?.tecnici_filler_refill}
              onChange={(v) => setServizio("tecnici_filler_refill", v)}
            />
            <Checkbox
              etichetta="Softing"
              checked={!!dati.servizi?.tecnici_softing}
              onChange={(v) => setServizio("tecnici_softing", v)}
            />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <Checkbox
              etichetta="Altro"
              checked={!!dati.servizi?.tecnici_altro}
              onChange={(v) => setServizio("tecnici_altro", v)}
            />
            <input
              value={dati.servizi?.tecnici_altro_testo ?? ""}
              onChange={(e) => setServizio("tecnici_altro_testo", e.target.value)}
              className="flex-1 border-b border-line bg-transparent text-sm text-ink px-1 py-0.5 focus:outline-none focus:border-moss"
            />
          </div>
        </div>

        <div className="border-2 border-moss rounded-lg px-4 py-3 flex items-center justify-between bg-moss/5">
          <span className="font-heading font-bold text-ink">Totale percorso</span>
          <div className="flex items-center gap-1">
            <span className="text-moss font-semibold">€</span>
            <input
              type="number"
              step="0.01"
              value={dati.totale_percorso ?? ""}
              onChange={(e) => set("totale_percorso", e.target.value)}
              className="w-28 border-b border-line bg-transparent text-right text-ink px-1 py-0.5 focus:outline-none focus:border-moss"
            />
          </div>
        </div>
      </Sezione>

      <div className="fixed bottom-0 left-0 right-0 bg-paper border-t border-line px-6 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            onClick={handleSalva}
            disabled={salvataggio}
            className="px-5 py-2.5 rounded bg-moss text-paper hover:bg-ink transition-colors disabled:opacity-60"
          >
            {salvataggio ? "Salvataggio…" : "Salva scheda"}
          </button>
          {salvato && !salvataggio && (
            <span className="text-sm text-moss">Salvato.</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Sezione({
  titolo,
  sottotitolo,
  children,
}: {
  titolo: string;
  sottotitolo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-line rounded-lg bg-white p-6 space-y-5">
      <div>
        <p className="font-display italic text-moss text-base mb-0.5">
          Consulenza
        </p>
        <h2 className="font-heading font-extrabold text-2xl text-ink uppercase tracking-tight">
          {titolo}
        </h2>
        <p className="text-xs text-slate uppercase tracking-wide mt-1">
          {sottotitolo}
        </p>
      </div>
      {children}
    </section>
  );
}

function EtichettaCampo({ testo }: { testo: string }) {
  return <label className="block text-sm text-slate mb-1.5">{testo}</label>;
}

function TestoArea({
  etichetta,
  valore,
  onChange,
}: {
  etichetta: string;
  valore: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <EtichettaCampo testo={etichetta} />
      <textarea
        value={valore ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full border border-line rounded px-3 py-2 bg-white text-ink text-sm"
      />
    </div>
  );
}

function CampoTesto({
  etichetta,
  valore,
  onChange,
}: {
  etichetta: string;
  valore: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <EtichettaCampo testo={etichetta} />
      <input
        value={valore ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line rounded px-3 py-2 bg-white text-ink text-sm"
      />
    </div>
  );
}

function CampoNumero({
  etichetta,
  valore,
  onChange,
}: {
  etichetta: string;
  valore: number | string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <EtichettaCampo testo={etichetta} />
      <input
        type="number"
        step="0.1"
        value={valore ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line rounded px-3 py-2 bg-white text-ink text-sm"
      />
    </div>
  );
}

function Scelta({
  etichetta,
  opzioni,
  valore,
  onChange,
}: {
  etichetta: string;
  opzioni: string[];
  valore: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <EtichettaCampo testo={etichetta} />
      <div className="flex flex-wrap gap-2">
        {opzioni.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`text-sm px-3 py-1.5 rounded-full border capitalize transition-colors ${
              valore === o
                ? "bg-moss text-paper border-moss"
                : "border-line text-ink hover:border-moss"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Checkbox({
  etichetta,
  checked,
  onChange,
}: {
  etichetta: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink py-0.5 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[#0E93A3]"
      />
      {etichetta}
    </label>
  );
}

function CampoFoto({
  etichetta,
  fileScelto,
  urlEsistente,
  onChange,
}: {
  etichetta: string;
  fileScelto: File | null;
  urlEsistente: string | undefined;
  onChange: (f: File | null) => void;
}) {
  const anteprima = fileScelto ? URL.createObjectURL(fileScelto) : urlEsistente;

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded bg-paper border border-line overflow-hidden relative flex-shrink-0">
        {anteprima && (
          <Image src={anteprima} alt={etichetta} fill className="object-cover" />
        )}
      </div>
      <label className="text-sm px-3 py-2 rounded border border-line bg-white cursor-pointer hover:bg-paper">
        {etichetta}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
