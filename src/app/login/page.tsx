import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Termômetro</h1>
        <p className="mt-1 text-sm text-slate-600">Saúde dos clientes da Frota Leve · estudo de caso com dados sintéticos</p>
      </div>
      <div className="card">
        <LoginForm />
      </div>
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
        Ambiente local de demonstração. Usuários e senha de demonstração estão no README (são fictícios).
      </p>
    </main>
  );
}
