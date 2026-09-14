-- ============================================================
-- Migrazione: scheda di consulenza personalizzata per cliente
-- (storia, armocromia, face shape, analisi iride)
-- Da eseguire in Supabase: SQL Editor > New query
-- ============================================================

create table if not exists consulenze (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null unique references clienti(id) on delete cascade,

  -- La tua storia
  racconto_giornate text,
  rapporto_capelli text,
  tempo_mattino text,
  routine_cura text,
  capelli_desiderati text,
  capelli_oggi text,
  valore_capelli text,
  disponibilita_cura text,
  preferenza_look text,
  esperienza_positiva text,
  miglioramento_prioritario text,
  sensazione_uscita text,
  foto_prima text,
  foto_dopo text,
  foto_ispirazione text,

  -- Armocromia
  arm_stagione text,
  arm_sottotono text,
  arm_intensita text,
  arm_contrasto text,
  arm_valore text,
  arm_sovratono text,
  arm_note text,

  -- Face shape
  fs_superiore_cm numeric,
  fs_media_cm numeric,
  fs_inferiore_cm numeric,
  fs_lunghezza_cm numeric,
  fs_occhio_cm jsonb,
  fs_balance_1_cm numeric,
  fs_balance_2_cm numeric,
  fs_profilo text,
  fs_scala text,
  fs_forma text,

  -- Analisi cromatica dell'iride
  iride_punti jsonb,
  iride_palette text[],
  iride_colore_dominante text,
  iride_colore_secondario text,
  iride_macchie text,
  iride_bordo_limbale text,
  iride_temperatura text,
  iride_intensita text,
  iride_codice_dominante text,
  iride_codice_secondario text,
  iride_codice_accento1 text,
  iride_codice_accento2 text,
  iride_contrasto_complessivo text,
  iride_note_professionali text,

  operatore_id uuid references auth.users(id),
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now()
);

drop trigger if exists trg_consulenze_aggiornato_il on consulenze;
create trigger trg_consulenze_aggiornato_il
  before update on consulenze
  for each row execute function set_aggiornato_il();

alter table consulenze enable row level security;

create policy "Utenti autenticati leggono le consulenze"
  on consulenze for select
  to authenticated
  using (true);

create policy "Utenti autenticati inseriscono consulenze"
  on consulenze for insert
  to authenticated
  with check (true);

create policy "Utenti autenticati modificano le consulenze"
  on consulenze for update
  to authenticated
  using (true);

create policy "Solo admin elimina consulenze"
  on consulenze for delete
  to authenticated
  using (public.is_admin());
