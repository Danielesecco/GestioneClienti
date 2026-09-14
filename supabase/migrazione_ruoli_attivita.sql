-- ============================================================
-- Migrazione: ruoli (admin/operatore) + storico attività clienti
-- Da eseguire in Supabase: Dashboard > SQL Editor > New query
-- (da lanciare DOPO schema.sql, una tantum)
-- ============================================================

-- ============================================================
-- 1. Profili utente con ruolo
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nome text,
  ruolo text not null default 'operatore' check (ruolo in ('admin', 'operatore')),
  creato_il timestamptz not null default now()
);

-- Crea automaticamente un profilo (ruolo "operatore" di default)
-- ogni volta che viene creato un nuovo utente
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Funzione di appoggio per capire se l'utente loggato è admin,
-- usata dentro le policy di sicurezza (evita ricorsione infinita)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and ruolo = 'admin'
  );
$$ language sql security definer stable set search_path = public;

alter table profiles enable row level security;

create policy "Ognuno legge il proprio profilo"
  on profiles for select
  to authenticated
  using (auth.uid() = id or public.is_admin());

create policy "L'utente aggiorna solo il proprio profilo"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- IMPORTANTE: dopo aver eseguito questo script, promuovi te
-- stesso ad admin (sostituisci con la tua email):
--
-- update profiles set ruolo = 'admin'
-- where email = 'tuo@email.it';
-- ============================================================

-- ============================================================
-- 2. Solo l'admin può eliminare clienti
-- ============================================================
drop policy if exists "Utenti autenticati eliminano clienti" on clienti;

create policy "Solo admin elimina clienti"
  on clienti for delete
  to authenticated
  using (public.is_admin());

-- ============================================================
-- 3. Storico attività per ogni cliente
-- ============================================================
create table if not exists attivita (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clienti(id) on delete cascade,
  data_evento date not null default current_date,
  descrizione text,
  foto_url text,
  dati jsonb,
  operatore_id uuid references auth.users(id),
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now()
);

create index if not exists idx_attivita_cliente
  on attivita (cliente_id, data_evento desc);

drop trigger if exists trg_attivita_aggiornato_il on attivita;
create trigger trg_attivita_aggiornato_il
  before update on attivita
  for each row execute function set_aggiornato_il();

alter table attivita enable row level security;

create policy "Utenti autenticati leggono le attività"
  on attivita for select
  to authenticated
  using (true);

create policy "Utenti autenticati aggiungono attività"
  on attivita for insert
  to authenticated
  with check (true);

create policy "Utenti autenticati modificano le attività"
  on attivita for update
  to authenticated
  using (true);

create policy "Solo admin elimina attività"
  on attivita for delete
  to authenticated
  using (public.is_admin());
