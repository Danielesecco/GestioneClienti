-- ============================================================
-- Schema per l'app Gestione Clienti
-- Da eseguire in Supabase: Dashboard > SQL Editor > New query
-- ============================================================

-- Tabella principale clienti
create table if not exists clienti (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cognome text not null,
  azienda text,
  email text,
  telefono text,
  indirizzo text,
  note text,
  foto_url text,
  creato_da uuid references auth.users(id),
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now()
);

-- Indice per la ricerca veloce su migliaia di record
create index if not exists idx_clienti_nome_cognome
  on clienti using gin (to_tsvector('italian', coalesce(nome,'') || ' ' || coalesce(cognome,'') || ' ' || coalesce(azienda,'')));

create index if not exists idx_clienti_creato_il on clienti (creato_il desc);

-- Aggiorna automaticamente "aggiornato_il" ad ogni modifica
create or replace function set_aggiornato_il()
returns trigger as $$
begin
  new.aggiornato_il = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_clienti_aggiornato_il on clienti;
create trigger trg_clienti_aggiornato_il
  before update on clienti
  for each row execute function set_aggiornato_il();

-- ============================================================
-- Sicurezza: solo utenti autenticati (tu + colleghi) possono
-- leggere e modificare i dati. Nessun accesso pubblico.
-- ============================================================
alter table clienti enable row level security;

create policy "Utenti autenticati leggono i clienti"
  on clienti for select
  to authenticated
  using (true);

create policy "Utenti autenticati inseriscono clienti"
  on clienti for insert
  to authenticated
  with check (true);

create policy "Utenti autenticati modificano clienti"
  on clienti for update
  to authenticated
  using (true);

create policy "Utenti autenticati eliminano clienti"
  on clienti for delete
  to authenticated
  using (true);

-- ============================================================
-- Storage: bucket per le foto dei clienti
-- ============================================================
insert into storage.buckets (id, name, public)
values ('foto-clienti', 'foto-clienti', true)
on conflict (id) do nothing;

create policy "Lettura pubblica foto clienti"
  on storage.objects for select
  using (bucket_id = 'foto-clienti');

create policy "Utenti autenticati caricano foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'foto-clienti');

create policy "Utenti autenticati eliminano foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'foto-clienti');
