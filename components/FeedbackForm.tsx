"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function FeedbackForm() {
  const [userId, setUserId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) { setStatus("Entre na sua conta para enviar feedback."); return; }
    setBusy(true); setStatus(null);
    const { error } = await supabase.from("pilot_feedback").insert({ user_id: userId, page: window.location.pathname, rating, message });
    setBusy(false);
    if (error) { setStatus(error.message); return; }
    setMessage(""); setRating(5); setStatus("Feedback registrado. Obrigado por participar do piloto.");
  }

  return <form className="auth-card form-stack" onSubmit={submit}>
    <label>Avaliação
      <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
        <option value={5}>5 — Excelente</option><option value={4}>4 — Bom</option><option value={3}>3 — Regular</option><option value={2}>2 — Ruim</option><option value={1}>1 — Crítico</option>
      </select>
    </label>
    <label>Relato
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} minLength={10} required placeholder="Descreva o que funcionou, o que falhou ou o que ficou confuso." />
    </label>
    <button className="button primary" disabled={busy}>{busy ? "Enviando…" : "Enviar feedback"}</button>
    {status && <div className="notice">{status}</div>}
  </form>;
}
