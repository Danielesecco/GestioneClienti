-- ============================================================
-- Migrazione: una nota per ogni riga della sezione Armocromia
-- (sottotono, intensità, contrasto, valore, sovratono)
-- Da eseguire in Supabase: SQL Editor > New query
-- ============================================================

alter table consulenze
  add column if not exists arm_sottotono_nota text,
  add column if not exists arm_intensita_nota text,
  add column if not exists arm_contrasto_nota text,
  add column if not exists arm_valore_nota text,
  add column if not exists arm_sovratono_nota text;
