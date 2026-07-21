"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Status = "draft" | "review" | "published" | "archived";
type Course = { id: string; title: string; slug: string; status: Status };
type Module = { id: string; course_id: string; title: string; position: number; status: Status };
type Lesson = { id: string; module_id: string; title: string; slug: string; position: number; estimated_minutes: number; status: Status };
type Quiz = { id: string; lesson_id: string; prompt: string };
type Asset = { id: string; course_id: string | null; title: string; kind: string; url: string; status: Status };
type Audit = { id: number; entity_type: string; entity_id: string; action: string; created_at: string };

type Tab = "courses" | "modules" | "lessons" | "quizzes" | "assets" | "audit";
const STATUS_OPTIONS: Status[] = ["draft", "review", "published", "archived"];
const labels: Record<Status, string> = { draft: "Rascunho", review: "Revisão", published: "Publicado", archived: "Arquivado" };

export function AdminPanel() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);

  const allowedAdmins = useMemo(() => new Set([
    "leonpcsn@gmail.com",
    ...(process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean),
  ]), []);
  const authorized = role === "admin" || Boolean(email && allowedAdmins.has(email.toLowerCase()));

  async function load() {
    setLoading(true);
    setError(null);
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    setEmail(user?.email ?? null);
    if (!user) { setLoading(false); return; }

    const profile = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    const nextRole = profile.data?.role ?? null;
    setRole(nextRole);
    const canManage = nextRole === "admin" || Boolean(user.email && allowedAdmins.has(user.email.toLowerCase()));
    if (!canManage) { setLoading(false); return; }

    const [courseResult, moduleResult, lessonResult, quizResult, assetResult, auditResult] = await Promise.all([
      supabase.from("courses").select("id,title,slug,status").order("created_at"),
      supabase.from("modules").select("id,course_id,title,position,status").order("position"),
      supabase.from("lessons").select("id,module_id,title,slug,position,estimated_minutes,status").order("position"),
      supabase.from("quiz_questions").select("id,lesson_id,prompt").order("position"),
      supabase.from("content_assets").select("id,course_id,title,kind,url,status").order("created_at"),
      supabase.from("content_audit_logs").select("id,entity_type,entity_id,action,created_at").order("created_at", { ascending: false }).limit(30),
    ]);
    const firstError = courseResult.error ?? moduleResult.error ?? lessonResult.error ?? quizResult.error ?? assetResult.error ?? auditResult.error;
    if (firstError) setError(firstError.message);
    setCourses((courseResult.data ?? []) as Course[]);
    setModules((moduleResult.data ?? []) as Module[]);
    setLessons((lessonResult.data ?? []) as Lesson[]);
    setQuizzes((quizResult.data ?? []) as Quiz[]);
    setAssets((assetResult.data ?? []) as Asset[]);
    setAudit((auditResult.data ?? []) as Audit[]);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function execute(operation: () => Promise<{ error: { message: string } | null }>, success: string) {
    setBusy(true); setError(null); setMessage(null);
    const { error: operationError } = await operation();
    if (operationError) setError(operationError.message);
    else { setMessage(success); await load(); }
    setBusy(false);
  }

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") ?? "").trim(),
      slug: String(form.get("slug") ?? "").trim(),
      description: String(form.get("description") ?? ""),
      level: String(form.get("level") ?? "beginner"),
      estimated_minutes: Number(form.get("estimated_minutes") ?? 0),
      status: "draft" as Status,
    };
    await execute(async () => { const { error } = await supabase.from("courses").insert(payload); return { error }; }, "Curso criado.");
    event.currentTarget.reset();
  }

  async function createModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await execute(async () => {
      const { error } = await supabase.from("modules").insert({ course_id: String(form.get("course_id")), title: String(form.get("title")), description: String(form.get("description") ?? ""), position: Number(form.get("position") ?? 1), status: "draft" });
      return { error };
    }, "Módulo criado.");
    event.currentTarget.reset();
  }

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await execute(async () => {
      const { error } = await supabase.from("lessons").insert({ module_id: String(form.get("module_id")), title: String(form.get("title")), slug: String(form.get("slug")), summary: String(form.get("summary") ?? ""), content: String(form.get("content") ?? ""), position: Number(form.get("position") ?? 1), estimated_minutes: Number(form.get("estimated_minutes") ?? 0), status: "draft", is_published: false });
      return { error };
    }, "Aula criada.");
    event.currentTarget.reset();
  }

  async function createQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const options = ["option_a", "option_b", "option_c", "option_d"].map(key => String(form.get(key) ?? ""));
    await execute(async () => {
      const { error } = await supabase.from("quiz_questions").insert({ lesson_id: String(form.get("lesson_id")), prompt: String(form.get("prompt")), options, correct_option: Number(form.get("correct_option") ?? 0), explanation: String(form.get("explanation") ?? ""), position: 1 });
      return { error };
    }, "Quiz criado.");
    event.currentTarget.reset();
  }

  async function createAsset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await execute(async () => {
      const { error } = await supabase.from("content_assets").insert({ course_id: String(form.get("course_id")) || null, title: String(form.get("title")), kind: String(form.get("kind")), url: String(form.get("url")), status: "draft" });
      return { error };
    }, "Asset criado.");
    event.currentTarget.reset();
  }

  async function changeStatus(table: "courses" | "modules" | "lessons" | "content_assets", id: string, status: Status) {
    await execute(async () => { const { error } = await supabase.from(table).update({ status }).eq("id", id); return { error }; }, `${labels[status]} aplicado.`);
  }

  async function rename(table: "courses" | "modules" | "lessons", id: string, current: string) {
    const title = window.prompt("Novo título", current)?.trim();
    if (!title) return;
    await execute(async () => { const { error } = await supabase.from(table).update({ title }).eq("id", id); return { error }; }, "Título atualizado.");
  }

  async function deleteQuiz(id: string) {
    if (!window.confirm("Excluir esta pergunta?")) return;
    await execute(async () => { const { error } = await supabase.from("quiz_questions").delete().eq("id", id); return { error }; }, "Quiz excluído.");
  }

  if (loading) return <div className="notice">Carregando administração…</div>;
  if (!email) return <section className="admin-access-card"><h2>Entre com a conta administrativa</h2><Link className="button primary" href="/login">Entrar</Link></section>;
  if (!authorized) return <section className="admin-access-card"><h2>Acesso restrito</h2><p>A conta {email} não possui papel administrativo.</p></section>;

  const publishedLessons = lessons.filter(item => item.status === "published").length;
  const readiness = lessons.length ? Math.round(((publishedLessons + Math.min(new Set(quizzes.map(item => item.lesson_id)).size, lessons.length)) / (lessons.length * 2)) * 100) : 0;
  const tabLabels: Record<Tab, string> = { courses: "Cursos", modules: "Módulos", lessons: "Aulas", quizzes: "Quizzes", assets: "Assets", audit: "Histórico" };

  return <div className="admin-dashboard">
    <section className="admin-summary-grid">
      <article className="admin-metric"><span>Cursos</span><strong>{courses.length}</strong></article>
      <article className="admin-metric"><span>Módulos</span><strong>{modules.length}</strong></article>
      <article className="admin-metric"><span>Aulas</span><strong>{lessons.length}</strong></article>
      <article className="admin-metric"><span>Quizzes</span><strong>{quizzes.length}</strong></article>
      <article className="admin-metric"><span>Prontidão</span><strong>{readiness}%</strong></article>
    </section>
    {message && <div className="notice success">{message}</div>}
    {error && <div className="notice error">{error}</div>}
    <nav className="admin-tabs" aria-label="Seções do CMS">{(Object.keys(tabLabels) as Tab[]).map(item => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{tabLabels[item]}</button>)}</nav>

    {tab === "courses" && <section className="admin-section"><h2>Cursos</h2><form className="cms-form" onSubmit={createCourse}><input name="title" placeholder="Título" required/><input name="slug" placeholder="slug" required/><input name="description" placeholder="Descrição"/><select name="level"><option value="beginner">Iniciante</option><option value="intermediate">Intermediário</option><option value="advanced">Avançado</option></select><input name="estimated_minutes" type="number" placeholder="Minutos"/><button className="button primary" disabled={busy}>Criar</button></form><div className="cms-list">{courses.map(item => <article className="cms-item" key={item.id}><div><span className={`status-chip ${item.status}`}>{labels[item.status]}</span><h3>{item.title}</h3><p>{item.slug}</p></div><div className="cms-actions"><select value={item.status} onChange={event => void changeStatus("courses", item.id, event.target.value as Status)}>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{labels[status]}</option>)}</select><button onClick={() => void rename("courses", item.id, item.title)}>Editar</button><Link href={`/cursos/${item.slug}`}>Abrir</Link></div></article>)}</div></section>}

    {tab === "modules" && <section className="admin-section"><h2>Módulos</h2><form className="cms-form" onSubmit={createModule}><select name="course_id" required><option value="">Curso</option>{courses.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><input name="title" placeholder="Título" required/><input name="description" placeholder="Descrição"/><input name="position" type="number" defaultValue="1"/><button className="button primary" disabled={busy}>Criar</button></form><div className="cms-list">{modules.map(item => <article className="cms-item" key={item.id}><div><span className={`status-chip ${item.status}`}>{labels[item.status]}</span><h3>{item.position}. {item.title}</h3></div><div className="cms-actions"><select value={item.status} onChange={event => void changeStatus("modules", item.id, event.target.value as Status)}>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{labels[status]}</option>)}</select><button onClick={() => void rename("modules", item.id, item.title)}>Editar</button></div></article>)}</div></section>}

    {tab === "lessons" && <section className="admin-section"><h2>Aulas</h2><form className="cms-form cms-form-wide" onSubmit={createLesson}><select name="module_id" required><option value="">Módulo</option>{modules.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><input name="title" placeholder="Título" required/><input name="slug" placeholder="slug" required/><input name="summary" placeholder="Resumo"/><textarea name="content" placeholder="Conteúdo"/><input name="position" type="number" defaultValue="1"/><input name="estimated_minutes" type="number" placeholder="Minutos"/><button className="button primary" disabled={busy}>Criar</button></form><div className="cms-list">{lessons.map(item => <article className="cms-item" key={item.id}><div><span className={`status-chip ${item.status}`}>{labels[item.status]}</span><h3>{item.position}. {item.title}</h3><p>{item.estimated_minutes} min</p></div><div className="cms-actions"><select value={item.status} onChange={event => void changeStatus("lessons", item.id, event.target.value as Status)}>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{labels[status]}</option>)}</select><button onClick={() => void rename("lessons", item.id, item.title)}>Editar</button></div></article>)}</div></section>}

    {tab === "quizzes" && <section className="admin-section"><h2>Quizzes</h2><form className="cms-form cms-form-wide" onSubmit={createQuiz}><select name="lesson_id" required><option value="">Aula</option>{lessons.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><input name="prompt" placeholder="Pergunta" required/><input name="option_a" placeholder="A" required/><input name="option_b" placeholder="B" required/><input name="option_c" placeholder="C" required/><input name="option_d" placeholder="D" required/><select name="correct_option"><option value="0">Correta A</option><option value="1">Correta B</option><option value="2">Correta C</option><option value="3">Correta D</option></select><input name="explanation" placeholder="Explicação"/><button className="button primary" disabled={busy}>Criar</button></form><div className="cms-list">{quizzes.map(item => <article className="cms-item" key={item.id}><div><h3>{item.prompt}</h3></div><div className="cms-actions"><button className="danger" onClick={() => void deleteQuiz(item.id)}>Excluir</button></div></article>)}</div></section>}

    {tab === "assets" && <section className="admin-section"><h2>Assets</h2><form className="cms-form" onSubmit={createAsset}><select name="course_id"><option value="">Sem curso</option>{courses.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><input name="title" placeholder="Título" required/><select name="kind"><option value="pdf">PDF</option><option value="slides">Slides</option><option value="guide">Guia</option><option value="checklist">Checklist</option><option value="other">Outro</option></select><input name="url" placeholder="URL" required/><button className="button primary" disabled={busy}>Criar</button></form><div className="cms-list">{assets.map(item => <article className="cms-item" key={item.id}><div><span className={`status-chip ${item.status}`}>{labels[item.status]}</span><h3>{item.title}</h3><p>{item.kind} · {item.url}</p></div><div className="cms-actions"><select value={item.status} onChange={event => void changeStatus("content_assets", item.id, event.target.value as Status)}>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{labels[status]}</option>)}</select><a href={item.url}>Abrir</a></div></article>)}</div></section>}

    {tab === "audit" && <section className="admin-section"><h2>Histórico</h2><div className="audit-list">{audit.map(item => <article key={item.id}><strong>{item.action.toUpperCase()} · {item.entity_type}</strong><span>{new Date(item.created_at).toLocaleString("pt-BR")}</span><code>{item.entity_id}</code></article>)}</div></section>}
  </div>;
}
