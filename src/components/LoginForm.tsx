"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Senha</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      {state.error && <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn w-full">{pending ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}
