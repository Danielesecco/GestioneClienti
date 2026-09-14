# Gestione Clienti

App per gestire l'anagrafica clienti (dati + foto), pensata per essere usata
da più persone, sia da telefono che da computer.

**Stack**: Next.js (frontend + backend) su Vercel · Supabase (database +
autenticazione + storage foto)

---

## 1. Crea il progetto Supabase (database + foto + login)

1. Vai su [supabase.com](https://supabase.com) e crea un account gratuito
2. Crea un nuovo progetto (scegli una regione vicina, es. Frankfurt)
3. Vai su **SQL Editor** → **New query**, incolla il contenuto del file
   `supabase/schema.sql` e clicca **Run**. Questo crea:
   - la tabella `clienti`
   - la ricerca veloce sui nomi/aziende
   - il bucket di storage per le foto
   - le regole di sicurezza (solo chi ha fatto login può leggere/scrivere)
4. Vai su **Authentication → Users** e crea un utente per te e uno per ogni
   collega (email + password). Non serve la registrazione pubblica: gli
   accessi li create voi da qui.
5. Vai su **Project Settings → API** e copia:
   - `Project URL`
   - `anon public key`

## 2. Configura il progetto in locale (opzionale, solo se vuoi modificarlo)

```bash
npm install
cp .env.example .env.local
# incolla i due valori di Supabase in .env.local
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## 3. Metti online su Vercel

1. Carica questa cartella su GitHub (o collega direttamente la cartella da
   Vercel CLI: `npx vercel`)
2. Vai su [vercel.com](https://vercel.com) → **New Project** → importa la
   repository
3. In **Environment Variables** aggiungi le stesse due variabili di
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clicca **Deploy**

L'app sarà online su un indirizzo tipo `gestione-clienti.vercel.app`.

## 4. Collega il sottodominio del tuo sito (quando sei pronto)

1. Su Vercel: **Project → Settings → Domains** → aggiungi
   `clienti.tuosito.it`
2. Vercel ti mostra un record DNS (di solito un `CNAME`) da aggiungere
3. Vai nel pannello DNS di dove hai registrato il dominio e aggiungi quel
   record
4. Il sito principale su Shopify resta invariato: cambia solo il
   sottodominio dedicato all'app

## Cosa fa l'app, oggi

- Login (nessuna registrazione pubblica: gli account li create voi)
- Elenco clienti con ricerca per nome, azienda o email
- Aggiunta cliente con foto, dati di contatto e note
- Modifica ed eliminazione cliente

## Piano gratuito: attenzione

Il piano Hobby di Vercel è pensato per uso personale non commerciale. Va
benissimo per sviluppare e testare; quando l'app sarà usata davvero con i
colleghi per il lavoro, passate al piano **Pro** (20 $/utente/mese).
Supabase ha un piano gratuito separato, sufficiente per iniziare.

## Prossimi miglioramenti possibili

- Esportazione clienti in Excel/CSV
- Filtri avanzati (per città, data di inserimento, ecc.)
- Cronologia delle modifiche per cliente
- Ruoli diversi (es. chi può solo vedere, chi può modificare)
