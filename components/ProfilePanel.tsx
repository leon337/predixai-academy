"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function ProfilePanel() {
  const [email, setEmail] = useState<string | null>(null);
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      if (data.user) {
        const { count } = await supabase
          .from("lesson_progress")
          .select("lesson_id", { count: "exact", head: true })
          .eq("user_id", data.user.id)
          .eq("status", "completed");
        setCompleted(count ?? 0);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="notice">Carregando perfil…</div>;
  if (!email) {
    return (
      <div className="profile-card">
        <h2>Você ainda não entrou</h2>
        <p>Entre para registrar aulas concluídas e acompanhar seu progresso.</p>
        <Link className="button primary" href="/login">Entrar ou criar conta</Link>
      </div>
    );
  }

  return (
    <div className="profile-grid">
      <article className="profile-card">
        <span className="eyebrow">Conta ativa</span>
        <h2>{email}</h2>
        <p>Seu progresso é armazenado de forma individual no Supabase.</p>
      </article>
      <article className="profile-card metric-card">
        <strong>{completed}</strong>
        <span>Aulas concluídas</span>
      </article>
    </div>
  );
}
