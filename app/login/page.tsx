import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative max-w-sm mx-auto mt-16">
      <img
        src="/motivo-decorativo.svg"
        alt=""
        className="pointer-events-none select-none absolute -top-16 -right-20 w-[380px] opacity-60 hidden md:block"
      />

      <div className="relative flex flex-col items-center mb-10">
        <Image
          src="https://cdn.shopify.com/s/files/1/0885/9310/5237/files/logo_fitfor.png?v=1731591585"
          alt="FitFor"
          width={72}
          height={72}
          className="object-contain"
          priority
        />
        <p className="text-[11px] text-slate tracking-[0.08em] mt-2">
          gestione clienti
        </p>
      </div>

      <div className="relative bg-white border border-line rounded-lg p-6">
        <h1 className="font-display text-xl text-ink mb-1">Accedi</h1>
        <p className="text-sm text-slate mb-6">
          Entra con l&apos;account che ti è stato creato per gestire i
          clienti.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
