import Link from "next/link";
import { logout } from "@/app/actions";
import { requireSession } from "@/lib/auth";

const NAV = [
  { href: "/", label: "Painel" },
  { href: "/risco", label: "Contas em risco" },
  { href: "/alertas", label: "Alertas" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/sensibilidade", label: "Sensibilidade" },
  { href: "/configuracao", label: "Configuração" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/" className="text-lg font-bold">Termômetro <span className="text-xs font-medium text-slate-500">Frota Leve</span></Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-700">{session.name} · {session.role === "ADMIN" ? "Admin" : "CSM"}</span>
            <form action={logout}><button className="btn-ghost !px-3 !py-1">Sair</button></form>
          </div>
          <nav aria-label="Principal" className="-mx-1 flex w-full gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-slate-500">
        Dados 100% sintéticos (semente fixa) · o score é uma heurística a calibrar, não uma previsão comprovada de cancelamento.
      </footer>
    </div>
  );
}
