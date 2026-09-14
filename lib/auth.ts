import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Profilo = {
  id: string;
  email: string | null;
  nome: string | null;
  ruolo: "admin" | "operatore";
};

/**
 * Ritorna l'utente loggato e il suo profilo (con ruolo).
 * Da chiamare solo in Server Component o Route Handler.
 *
 * Avvolta in `cache()`: se più componenti la chiamano nella stessa
 * richiesta (es. layout + pagina), Supabase viene interrogato una
 * sola volta invece di una per ogni chiamata.
 */
export const getUtenteCorrente = cache(async (): Promise<{
  user: { id: string; email?: string } | null;
  profilo: Profilo | null;
}> => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profilo: null };
  }

  const { data: profilo } = await supabase
    .from("profiles")
    .select("id, email, nome, ruolo")
    .eq("id", user.id)
    .single();

  return { user, profilo: profilo as Profilo | null };
});
