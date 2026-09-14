"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [uscita, setUscita] = useState(false);

  async function handleLogout() {
    setUscita(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={uscita}
      className="flex items-center gap-1.5 text-sm text-slate hover:text-clay transition-colors disabled:opacity-60"
    >
      <LogOut size={16} strokeWidth={1.75} />
      Esci
    </button>
  );
}
