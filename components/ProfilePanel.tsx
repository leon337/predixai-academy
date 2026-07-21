"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type ProgressRow = {
  lesson_id: string;
  status: string;
  progress_percent: number;
  completed_at: string | null;
  lessons: { title: string; slug: string; modules: { courses: { slug: string } } };
};

type Attempt = { score: number; is_correct: boolean };

export function ProfilePanel() {
  const [email, setEmail] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);

      const { count } = await supabase.from("lessons").select("id", { count: "exact", head: true }).eq("is_published", true);
      setTotalLessons(count ?? 0);

      if (data.user) {
        const [{ data: progressData }, { data: attemptData }] = await Promise.all([
          supabase
            .from("lesson_progress")
            .select("lesson_id, status, progress_percent, completed_at, lessons(title, slug, modules(courses(slug)))")
            .eq("user_id", data.user.id)
            .order("completed_at", { ascending: false }),
          supabase.from("quiz_attempts").select("score, is_correct").eq("user_id", data.user.id),
        ]);
        setProgress((progressData ?? []) as unknown as ProgressRow[]);
        setAttempts((attemptData ?? []) as Attempt[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const completed = progress.filter((item) => item.status === "completed");
  const inProgress = progress.filter((item) => item.status !== "completed");
  const coursePercent = totalLessons ? Math.round((completed.length / totalLessons) * 100) : 0;
  const correctAttempts = attempts.filter((item) => item.is_correct).length;
  const accuracy = attempts.length ? Math.round((correctAttempts / attempts.length) * 100) : 0;
  const averageScore = useMemo(() => attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length) : 0, [attempts]);

  if (loading) return <div className="notice">Carregando painel…</div>;
  if (!email) {
    return (
      <div className="profile-card">
        <h2>Você ainda não entrou</h2>
        <p>Entre para registrar aulas concluídas, quizzes e acompanhar seu progresso.</p>
        <Link className="button primary" href="/login">Entrar ou criar conta</Link>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <section className="profile-grid">
        <article className="profile-card account-card">
          <span className="eyebrow">Conta ativa</span>
          <h2>{email}</h2>
          <p>Seu progresso, tentativas e resultados são armazenados individualmente.</p>
        </article>
        <article className="profile-card metric-card"><strong>{coursePercent}%</strong><span>Progresso do curso</span></article>
        <article className="profile-card metric-card"><strong>{completed.length}/{totalLessons}</strong><span>Aulas concluídas</span></article>
        <article className="profile-card metric-card"><strong>{accuracy}%</strong><span>Precisão nos quizzes</span></article>
      </section>

      <section className="profile-card course-progress-card">
        <div className="progress-label"><strong>Integração com WhatsApp Business Platform</strong><span>{coursePercent}%</span></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${coursePercent}%` }} /></div>
        <p className="muted">{completed.length} de {totalLessons} aulas concluídas · {attempts.length} tentativas · média {averageScore} pontos</p>
        <Link className="button primary" href="/cursos/whatsapp-business-platform">Continuar estudando</Link>
      </section>

      <section className="dashboard-columns">
        <article className="profile-card">
          <span className="eyebrow">Histórico</span>
          <h2>Aulas concluídas</h2>
          {completed.length ? <div className="activity-list">{completed.map((item) => (
            <Link key={item.lesson_id} href={`/cursos/${item.lessons.modules.courses.slug}/aulas/${item.lessons.slug}`}>
              <span>✓</span><div><strong>{item.lessons.title}</strong><small>{item.completed_at ? new Date(item.completed_at).toLocaleDateString("pt-BR") : "Concluída"}</small></div>
            </Link>
          ))}</div> : <p className="muted">Nenhuma aula concluída ainda.</p>}
        </article>

        <article className="profile-card">
          <span className="eyebrow">Em andamento</span>
          <h2>Retomar aprendizagem</h2>
          {inProgress.length ? <div className="activity-list">{inProgress.map((item) => (
            <Link key={item.lesson_id} href={`/cursos/${item.lessons.modules.courses.slug}/aulas/${item.lessons.slug}`}>
              <span>{item.progress_percent}%</span><div><strong>{item.lessons.title}</strong><small>Continuar aula</small></div>
            </Link>
          ))}</div> : <p className="muted">Abra uma aula para iniciar seu histórico.</p>}
          <Link className="button secondary" href="/biblioteca">Abrir biblioteca</Link>
        </article>
      </section>
    </div>
  );
}
