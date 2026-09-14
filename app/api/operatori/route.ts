import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Questa route gira solo sul server: qui, e solo qui, è sicuro
// usare la Service Role Key (non deve mai avere il prefisso
// NEXT_PUBLIC_ e non deve mai finire nel codice del browser).
export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  const { data: profiloRichiedente } = await supabase
    .from("profiles")
    .select("ruolo")
    .eq("id", user.id)
    .single();

  if (profiloRichiedente?.ruolo !== "admin") {
    return NextResponse.json(
      { error: "Solo l'admin può creare nuovi operatori." },
      { status: 403 }
    );
  }

  const { email, password, nome } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e password sono obbligatorie." },
      { status: 400 }
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        error:
          "Manca la variabile SUPABASE_SERVICE_ROLE_KEY sul server. Aggiungila nelle impostazioni del progetto.",
      },
      { status: 500 }
    );
  }

  const adminClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: nuovoUtente, error: creazioneError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (creazioneError || !nuovoUtente.user) {
    return NextResponse.json(
      { error: creazioneError?.message ?? "Errore durante la creazione." },
      { status: 400 }
    );
  }

  if (nome) {
    await adminClient
      .from("profiles")
      .update({ nome })
      .eq("id", nuovoUtente.user.id);
  }

  return NextResponse.json({ ok: true });
}
