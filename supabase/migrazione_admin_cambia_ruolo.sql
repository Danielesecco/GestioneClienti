-- ============================================================
-- Migrazione aggiuntiva: permette all'admin di cambiare il ruolo
-- di qualsiasi utente direttamente dall'app.
-- Da eseguire in Supabase: SQL Editor > New query
-- (in aggiunta a migrazione_ruoli_attivita.sql, già eseguita)
-- ============================================================

create policy "L'admin aggiorna qualsiasi profilo"
  on profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
