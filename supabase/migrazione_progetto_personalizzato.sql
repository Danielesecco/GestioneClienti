-- ============================================================
-- Migrazione: aggiunge alla scheda di consulenza la pagina
-- finale "Progetto Personalizzato FitFor" (servizi concordati
-- e totale del percorso).
-- Da eseguire in Supabase: SQL Editor > New query
-- ============================================================

alter table consulenze
  add column if not exists sintesi_consulenza text,
  add column if not exists obiettivo_concordato text,
  add column if not exists servizi jsonb,
  add column if not exists totale_percorso numeric;
