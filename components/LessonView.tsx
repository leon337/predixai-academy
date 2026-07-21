"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  content: string;
  estimated_minutes: number;
  position: number;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct_option: number;
  explanation: string | null;
};

type LessonLink = { slug: string; title: string; position: number };

export function LessonView({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [lessons, setLessons] = useState<LessonLink[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<"correct" | "incorrect" | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("id, title, summary, content, estimated_minutes, position, module_id, modules!inner(courses!inner(slug))")
        .eq("slug", lessonSlug)
        .eq("modules.courses.slug", courseSlug)
        .single();

      const current = lessonData as (Lesson & { module_id: string }) | null;
      setLesson(current);

      if (current) {
        const [{ data: questionData }, { data: lessonList }, { data: userData }] = await Promise.all([
          supabase.from("quiz_questions").select("id, prompt, options, correct_option, explanation").eq("lesson_id", current.id).order("position").limit(1).maybeSingle(),
          supabase.from("lessons").select("slug, title, position").eq("module_id", current.module_id).eq("is_published", true).order("position"),
          supabase.auth.getUser(),
        ]);

        setQuiz(questionData as QuizQuestion | null);
        setLessons((lessonList ?? []) as LessonLink[]);

        if (userData.user) {
          const { data: progress } = await supabase
            .from("lesson_progress")
            .select("status")
            .eq("user_id", userData.user.id)
            .eq("lesson_id", current.id)
            .maybeSingle();
          setCompleted(progress?.status === "completed");
        }
      }
      setLoading(false);
    }
    load();
  }, [courseSlug, lessonSlug]);

  const currentIndex = lessons.findIndex((item) => item.slug === lessonSlug);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const progressPercent = useMemo(() => completed ? 100 : quizResult === "correct" ? 75 : selected !== null ? 55 : 35, [completed, quizResult, selected]);

  async function submitQuiz() {
    if (!quiz || selected === null || !lesson) return;
    const isCorrect = selected === quiz.correct_option;
    setQuizResult(isCorrect ? "correct" : "incorrect");

    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase.from("quiz_attempts").insert({
        user_id: userData.user.id,
        lesson_id: lesson.id,
        score: isCorrect ? 100 : 0,
        answers: { [quiz.id]: selected },
      });
    }
  }

  async function completeLesson() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user || !lesson) {
      setMessage("Entre na sua conta para registrar o progresso.");
      return;
    }
    if (quiz && quizResult !== "correct") {
      setMessage("Responda corretamente ao quiz antes de concluir a aula.");
      return;
    }

    const { error } = await supabase.from("lesson_progress").upsert({
      user_id: userData.user.id,
      lesson_id: lesson.id,
      status: "completed",
      progress_percent: 100,
      completed_at: new Date().toISOString(),
    });

    if (error) setMessage("Não foi possível salvar o progresso.");
    else {
      setCompleted(true);
      setMessage("Aula concluída e progresso salvo.");
    }
  }

  if (loading) return <main className="page shell"><div className="notice">Carregando aula…</div></main>;
  if (!lesson) return <main className="page shell"><div className="notice error">Aula não encontrada.</div></main>;

  return (
    <main className="lesson-layout shell">
      <aside className="lesson-sidebar">
        <Link href={`/cursos/${courseSlug}`}>← Voltar ao curso</Link>
        <div className="progress-block">
          <div className="progress-label"><span>Progresso da aula</span><strong>{progressPercent}%</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPercent}%` }} /></div>
        </div>
      </aside>

      <article className="lesson-content">
        <span className="eyebrow">Aula publicada</span>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.summary}</p>

        <section className="learning-block concept"><span className="block-label">Conceito</span><p>{lesson.content}</p></section>
        <section className="learning-block analogy"><span className="block-label">Analogia</span><p>Pense na integração como uma central de atendimento: o WhatsApp recebe a mensagem, a API transporta, o backend decide e o banco registra.</p></section>
        <section className="learning-block checklist"><span className="block-label">Checklist</span><ul><li>Identificar o componente central da aula.</li><li>Explicar sua responsabilidade no fluxo.</li><li>Relacionar o conceito ao curso completo.</li></ul></section>

        {quiz && (
          <section className="quiz-card" aria-labelledby="quiz-title">
            <span className="eyebrow">Verificação de aprendizagem</span>
            <h2 id="quiz-title">Quiz da aula</h2>
            <p>{quiz.prompt}</p>
            <div className="quiz-options">
              {quiz.options.map((option, index) => (
                <button key={option} type="button" className={`quiz-option ${selected === index ? "selected" : ""}`} onClick={() => { setSelected(index); setQuizResult(null); }}>
                  <span>{String.fromCharCode(65 + index)}</span>{option}
                </button>
              ))}
            </div>
            <button className="button secondary" type="button" disabled={selected === null} onClick={submitQuiz}>Verificar resposta</button>
            {quizResult && <div className={`quiz-feedback ${quizResult}`}><strong>{quizResult === "correct" ? "Resposta correta." : "Resposta incorreta."}</strong>{quiz.explanation && <p>{quiz.explanation}</p>}</div>}
          </section>
        )}

        <div className="lesson-actions">
          <button className="button primary" type="button" onClick={completeLesson}>{completed ? "Aula concluída" : "Marcar como concluída"}</button>
          <span className="muted">Tempo estimado: {lesson.estimated_minutes} min</span>
        </div>
        {message && <div className="notice">{message}</div>}

        <nav className="lesson-navigation" aria-label="Navegação entre aulas">
          {previousLesson ? <Link className="button secondary" href={`/cursos/${courseSlug}/aulas/${previousLesson.slug}`}>← {previousLesson.title}</Link> : <span />}
          {nextLesson ? <Link className="button secondary" href={`/cursos/${courseSlug}/aulas/${nextLesson.slug}`}>{nextLesson.title} →</Link> : <Link className="button secondary" href={`/cursos/${courseSlug}`}>Voltar ao curso</Link>}
        </nav>
      </article>
    </main>
  );
}
