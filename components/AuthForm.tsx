"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });

    setBusy(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(mode === "login" ? "Login realizado com sucesso." : "Cadastro criado. Verifique seu e-mail caso a confirmação esteja ativada.");
  }

  return (
    <div className="auth-card">
      <div className="auth-tabs" role="tablist" aria-label="Tipo de acesso">
        <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>Entrar</button>
        <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => setMode("signup")}>Criar conta</button>
      </div>

      <form onSubmit={submit} className="form-stack">
        {mode === "signup" && (
          <label>
            Nome completo
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          </label>
        )}
        <label>
          E-mail
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Senha
          <input type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <button className="button primary" type="submit" disabled={busy}>
          {busy ? "Processando…" : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      {message && <div className="notice">{message}</div>}
    </div>
  );
}
