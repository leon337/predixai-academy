"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Course = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
};

type Module = {
  id: string;
  course_id: string;
  title: string;
  is_published: boolean;
};

type Lesson = {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  is_published: boolean;
};

type QuizQuestion = { id: string; lesson_id: string };

const FALLBACK_ADMIN = "leonpcsn@gmail.com";

export function AdminPanel() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const allowedAdmins = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean) ?? [];
    return new Set([FALLBACK_ADMIN, ...configured]);
  }, []);

  const authorized = Boolean(email && allowedAdmins.has(email.toLowerCase()));

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const currentEmail = userData.user?.email ?? null;
      setEmail(currentEmail);

      if (!currentEmail || !allowedAdmins.has(currentEmail.toLowerCase())) {
        setLoading(false);
        return;
      }

      const [courseResult, moduleResult, lessonResult, quizResult] = await Promise.all([
        supabase.from("courses").select("id, title, slug, is_published").order("created_at"),
        supabase.from("modules").select("id, course_id, title, is_published").order("position"),
        supabase.from("lessons").select("id, module_id, title, slug, is_published").order("position"),
        supabase.from("quiz_questions").select("id, lesson_id"),
      ]);

      const firstError = courseResult.error ?? moduleResult.error ?? lessonResult.error ?? quizResult.error;
      if (firstError) setError("Não foi possível carregar todo o inventário de conteúdo.");

      setCourses((courseResult.data ?? []) as Course[]);
      setModules((moduleResult.data ?? []) as Module[]);
      setLessons((lessonResult.data ?? []) as Lesson[]);
      setQuestions((quizResult.data ?? []) as QuizQuestion[]);
      setLoading(false);
    }

    load();
  }, [allowedAdmins]);

  if (loading) return <div className="notice">Carregando administração…</div>;

  if (!email) {
    return (
      <section className="admin-access-card">
        <span className="eyebrow">Acesso protegido</span>
        <h2>Entre com a conta administrativa</h2>
        <p>O painel de gestão não fica disponível para visitantes.</p>
        <Link className="button primary" href="/login">Entrar</Link>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="admin-access-card">
        <span className="eyebrow">Acesso restrito</span>
        <h2>Conta sem permissão administrativa</h2>
        <p>A conta <strong>{email}</strong> pode utilizar a área do aluno, mas não pode acessar a gestão de conteúdo.</p>
        <Link className="button secondary" href="/perfil">Voltar ao painel do aluno</Link>
      </section>
    );
  }

  const publishedCourses = courses.filter((item) => item.is_published).length;
  const publishedLessons = lessons.filter((item) => item.is_published).length;
  const lessonsWithQuiz = new Set(questions.map((item) => item.lesson_id)).size;
  const contentReadiness = lessons.length === 0
    ? 0
    : Math.round(((publishedLessons + Math.min(lessonsWithQuiz, lessons.length)) / (lessons.length * 2)) * 100);

  return (
    <div className="admin-dashboard">
      <section className="admin-summary-grid">
        <article className="admin-metric"><span>Cursos</span><strong>{courses.length}</strong><small>{publishedCourses} publicados</small></article>
        <article className="admin-metric"><span>Módulos</span><strong>{modules.length}</strong><small>{modules.filter((item) => item.is_published).length} publicados</small></article>
        <article className="admin-metric"><span>Aulas</span><strong>{lessons.length}</strong><small>{publishedLessons} publicadas</small></article>
        <article className="admin-metric"><span>Prontidão</span><strong>{contentReadiness}%</strong><small>publicação + quiz</small></article>
      </section>

      {error && <div className="notice error">{error}</div>}

      <section className="admin-section">
        <div className="admin-section-heading">
          <div><span className="eyebrow">Inventário</span><h2>Conteúdo cadastrado</h2></div>
          <Link className="button secondary" href="/mvp">Checklist do MVP</Link>
        </div>

        <div className="admin-course-list">
          {courses.map((course) => {
            const courseModules = modules.filter((item) => item.course_id === course.id);
            const moduleIds = new Set(courseModules.map((item) => item.id));
            const courseLessons = lessons.filter((item) => moduleIds.has(item.module_id));
            const courseQuizCount = courseLessons.filter((item) => questions.some((question) => question.lesson_id === item.id)).length;

            return (
              <article className="admin-course-card" key={course.id}>
                <div>
                  <span className={`status-chip ${course.is_published ? "published" : "draft"}`}>{course.is_published ? "Publicado" : "Rascunho"}</span>
                  <h3>{course.title}</h3>
                  <p>{courseModules.length} módulo(s), {courseLessons.length} aula(s) e {courseQuizCount} quiz(zes).</p>
                </div>
                <div className="admin-card-actions">
                  <Link className="button secondary" href={`/cursos/${course.slug}`}>Revisar curso</Link>
                  <Link className="button secondary" href={`/cursos/${course.slug}/aulas/${courseLessons[0]?.slug ?? ""}`}>Abrir primeira aula</Link>
                </div>
              </article>
            );
          })}
          {courses.length === 0 && <div className="notice">Nenhum curso encontrado no banco de dados.</div>}
        </div>
      </section>

      <section className="admin-section admin-release-grid">
        <article className="admin-release-card">
          <span className="eyebrow">Operação</span>
          <h2>Fluxo editorial do MVP</h2>
          <ol>
            <li>Revisar título, descrição e posicionamento do curso.</li>
            <li>Confirmar que todas as aulas estão publicadas.</li>
            <li>Validar um quiz por aula e o fluxo de conclusão.</li>
            <li>Testar login, painel do aluno e biblioteca.</li>
            <li>Validar a versão em produção antes da divulgação.</li>
          </ol>
        </article>
        <article className="admin-release-card">
          <span className="eyebrow">Saúde da plataforma</span>
          <h2>MVP 0.5.0</h2>
          <p>Administração, conteúdo, progresso, quizzes e biblioteca integrados.</p>
          <div className="admin-card-actions">
            <a className="button secondary" href="/api/health">Ver endpoint de saúde</a>
            <Link className="button primary" href="/mvp">Preparar publicação</Link>
          </div>
        </article>
      </section>
    </div>
  );
}
