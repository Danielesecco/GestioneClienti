-- ============================================================
-- Migrazione: campi Data consulenza, Hair Coach e Contatto
-- nella prima pagina "La tua storia".
-- Da eseguire in Supabase: SQL Editor > New query
-- ============================================================

alter table consulenze
  add column if not exists data_consulenza date,
  add column if not exists hair_coach text,
  add column if not exists contatto text;
