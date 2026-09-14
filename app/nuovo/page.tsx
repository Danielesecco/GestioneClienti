import ClienteForm from "@/components/ClienteForm";

export default function NuovoClientePage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-ink mb-6">Nuovo cliente</h1>
      <ClienteForm />
    </div>
  );
}
