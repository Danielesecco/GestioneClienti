import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="font-display text-2xl text-ink mb-1">Accedi</h1>
      <p className="text-sm text-slate mb-6">
        Entra con l&apos;account che ti è stato creato per gestire i clienti.
      </p>
      <LoginForm />
    </div>
  );
}
