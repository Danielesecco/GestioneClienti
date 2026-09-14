import Image from "next/image";
import LoginForm from "@/components/LoginForm";

const LOGO_URL =
  "https://cdn.shopify.com/s/files/1/0885/9310/5237/files/logo_fitfor.png?v=1731591585";

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="flex flex-col items-center mb-10">
        <Image src={LOGO_URL} alt="FitFor" width={72} height={72} priority />
        <p className="text-[11px] text-slate tracking-[0.08em] uppercase mt-2">
          gestione clienti
        </p>
      </div>

      <div className="bg-white border border-line rounded-lg p-6">
        <h1 className="font-display italic text-2xl text-moss mb-1">
          Accedi
        </h1>
        <p className="text-sm text-slate mb-6">
          Entra con l&apos;account che ti è stato creato per gestire i
          clienti.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
