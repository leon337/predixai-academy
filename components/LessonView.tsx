"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  content: string;
  estimated_minutes: number;
};

export function LessonView({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("lessons")
      .select("id, title, summary, content, estimated_minutes, modules!inner(courses!inner(slug))")
      .eq("slug", lessonSlug)
      .eq("modules.courses.slug", courseSlug)
      .single()
      .then(({ data }) => {
        setLesson(data as Lesson | null);
        setLoading(false);
      });
  }, [courseSlug, lessonSlug]);

  async function completeLesson() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user || !lesson) {
      setMessage("Entre na sua conta para registrar o progresso.");
      return;
    }

    const { error } = await supabase.from("lesson_progress").upsert({
      user_id: userData.user.id,
      lesson_id: lesson.id,
      status: "completed",
      progress_percent: 100,
      completed_at: new Date().toISOString(),
    });

    setMessage(error ? "Não foi possível salvar o progresso." : "Aula concluída e progresso salvo.");
  }

  if (loading) return <main className="page shell"><div className="notice">Carregando aula…</div></main>;
  if (!lesson) return <main className="page shell"><div className="notice error">Aula não encontrada.</div></main>;

  return (
    <main className="lesson-layout shell">
      <aside className="lesson-sidebar">
        <Link href={`/cursos/${courseSlug}`}>← Voltar ao curso</Link>
        <div className="progress-block">
          <span>Progresso da aula</span>
          <div className="progress-track"><div className="progress-fill" style={{ width: "35%" }} /></div>
        </div>
      </aside>

      <article className="lesson-content">
        <span className="eyebrow">Aula publicada</span>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.summary}</p>

        <section className="learning-block concept">
          <span className="block-label">Conceito</span>
          <p>{lesson.content}</p>
        </section>

        <section className="learning-block analogy">
          <span className="block-label">Analogia</span>
          <p>Pense na integração como uma central de atendimento: o WhatsApp recebe a mensagem, a API transporta, o backend decide e o banco registra.</p>
        </section>

        <section className="learning-block checklist">
          <span className="block-label">Checklist</span>
          <ul>
            <li>Identificar o componente central da aula.</li>
            <li>Explicar sua responsabilidade no fluxo.</li>
            <li>Relacionar o conceito ao curso completo.</li>
          </ul>
        </section>

        <div className="lesson-actions">
          <button className="button primary" type="button" onClick={completeLesson}>Marcar como concluída</button>
          <span className="muted">Tempo estimado: {lesson.estimated_minutes} min</span>
        </div>
        {message && <div className="notice">{message}</div>}
      </article>
    </main>
  );
}
