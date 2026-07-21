"use client";

import Link from "next/link";
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
    const emailRedirectTo = typeof window === "undefined" ? "https://predixai-academy.vercel.app/perfil" : `${window.location.origin}/perfil`;
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo } });
    setBusy(false);
    if (result.error) { setMessage(result.error.message); return; }
    if (mode === "login") { window.location.href = "/perfil"; return; }
    setMessage("Cadastro criado. Abra o e-mail de confirmação para ativar sua conta.");
  }

  return (
    <div className="auth-card">
      <div className="auth-tabs" role="tablist" aria-label="Tipo de acesso">
        <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>Entrar</button>
        <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => setMode("signup")}>Criar conta</button>
      </div>
      <form onSubmit={submit} className="form-stack">
        {mode === "signup" && <label>Nome completo<input value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label>}
        <label>E-mail<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Senha<input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button className="button primary" type="submit" disabled={busy}>{busy ? "Processando…" : mode === "login" ? "Entrar" : "Criar conta"}</button>
      </form>
      {mode === "login" && <p><Link href="/recuperar-senha">Esqueci minha senha</Link></p>}
      {message && <div className="notice">{message}</div>}
    </div>
  );
}
