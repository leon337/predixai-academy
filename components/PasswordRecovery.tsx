"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasSession, setHasSession] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setHasSession(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    const redirectTo = `${window.location.origin}/recuperar-senha`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setBusy(false);
    setMessage(error ? error.message : "Link de recuperação enviado. Verifique seu e-mail.");
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    setMessage("Senha atualizada. Você já pode continuar para o painel.");
  }

  return hasSession ? (
    <form className="auth-card form-stack" onSubmit={updatePassword}>
      <label>Nova senha<input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button className="button primary" disabled={busy}>{busy ? "Atualizando…" : "Atualizar senha"}</button>
      {message && <div className="notice">{message}</div>}
    </form>
  ) : (
    <form className="auth-card form-stack" onSubmit={requestReset}>
      <label>E-mail da conta<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <button className="button primary" disabled={busy}>{busy ? "Enviando…" : "Enviar link de recuperação"}</button>
      {message && <div className="notice">{message}</div>}
    </form>
  );
}
