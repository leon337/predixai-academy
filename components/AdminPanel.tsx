"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Status = "draft" | "review" | "published" | "archived";
type Course = { id: string; title: string; slug: string; description: string; level: string; status: Status; is_published: boolean; estimated_minutes: number };
type Module = { id: string; course_id: string; title: string; description: string; position: number; status: Status; is_published: boolean };
type Lesson = { id: string; module_id: string; title: string; slug: string; summary: string; content: string; position: number; estimated_minutes: number; status: Status; is_published: boolean };
type Quiz = { id: string; lesson_id: string; prompt: string; options: string[]; correct_option: number; explanation: string | null; position: number };
type Asset = { id: string; course_id: string | null; title: string; kind: string; url: string; status: Status };
type Audit = { id: number; entity_type: string; entity_id: string; action: string; created_at: string; snapshot: Record<string, unknown> };

const FALLBACK_ADMIN = "leonpcsn@gmail.com";
const STATUS_OPTIONS: Status[] = ["draft", "review", "published", "archived"];
const statusLabel: Record<Status, string> = { draft: "Rascunho", review: "Revisão", published: "Publicado", archived: "Arquivado" };

export function AdminPanel() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [activeTab, setActiveTab] = useState<"courses" | "modules" | "lessons" | "quizzes" | "assets" | "audit">("courses");

  const allowedAdmins = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean) ?? [];
    return new Set([FALLBACK_ADMIN, ...configured]);
  }, []);

  const authorized = role === "admin" || Boolean(email && allowedAdmins.has(email.toLowerCase()));

  async function loadAll() {
    setLoading(true);
    setError(null);
    const { data: userData } = await supabase.auth.getUser();
    const currentEmail = userData.user?.email ?? null;
    setEmail(currentEmail);
    if (!userData.user) { setLoading(false); return; }

    const profileResult = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
    const currentRole = profileResult.data?.role ?? null;
    setRole(currentRole);
    const canManage = currentRole === "admin" || Boolean(currentEmail && allowedAdmins.has(currentEmail.toLowerCase()));
    if (!canManage) { setLoading(false); return; }

    const [courseResult, moduleResult, lessonResult, quizResult, assetResult, auditResult] = await Promise.all([
      supabase.from("courses").select("id,title,slug,description,level,status,is_published,estimated_minutes").order("created_at"),
      supabase.from("modules").select("id,course_id,title,description,position,status,is_published").order("position"),
      supabase.from("lessons").select("id,module_id,title,slug,summary,content,position,estimated_minutes,status,is_published").order("position"),
      supabase.from("quiz_questions").select("id,lesson_id,prompt,options,correct_option,explanation,position").order("position"),
      supabase.from("content_assets").select("id,course_id,title,kind,url,status").order("created_at"),
      supabase.from("content_audit_logs").select("id,entity_type,entity_id,action,created_at,snapshot").order("created_at", { ascending: false }).limit(30),
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

  useEffect(() => { loadAll(); }, []);

  async function run(action: () => Promise<{ error: { message: string } | null }>, success: string) {
    setBusy(true); setError(null); setNotice(null);
    const result = await action();
    if (result.error) setError(result.error.message);
    else { setNotice(success); await loadAll(); }
    setBusy(false);
  }

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const slug = String(data.get("slug") ?? "").trim();
    if (!title || !slug) return;
    await run(() => supabase.from("courses").insert({ title, slug, description: String(data.get("description") ?? ""), level: String(data.get("level") ?? "beginner"), estimated_minutes: Number(data.get("estimated_minutes") ?? 0), status: "draft" }).then(({ error }) => ({ error })), "Curso criado como rascunho.");
    event.currentTarget.reset();
  }

  async function createModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await run(() => supabase.from("modules").insert({ course_id: String(data.get("course_id")), title: String(data.get("title")), description: String(data.get("description") ?? ""), position: Number(data.get("position") ?? 1), status: "draft" }).then(({ error }) => ({ error })), "Módulo criado.");
    event.currentTarget.reset();
  }

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await run(() => supabase.from("lessons").insert({ module_id: String(data.get("module_id")), title: String(data.get("title")), slug: String(data.get("slug")), summary: String(data.get("summary") ?? ""), content: String(data.get("content") ?? ""), position: Number(data.get("position") ?? 1), estimated_minutes: Number(data.get("estimated_minutes") ?? 0), status: "draft", is_published: false }).then(({ error }) => ({ error })), "Aula criada.");
    event.currentTarget.reset();
  }

  async function createQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const options = ["option_a", "option_b", "option_c", "option_d"].map((key) => String(data.get(key) ?? "").trim());
    await run(() => supabase.from("quiz_questions").insert({ lesson_id: String(data.get("lesson_id")), prompt: String(data.get("prompt")), options, correct_option: Number(data.get("correct_option") ?? 0), explanation: String(data.get("explanation") ?? ""), position: 1 }).then(({ error }) => ({ error })), "Quiz criado.");
    event.currentTarget.reset();
  }

  async function createAsset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await run(() => supabase.from("content_assets").insert({ course_id: String(data.get("course_id")) || null, title: String(data.get("title")), kind: String(data.get("kind")), url: String(data.get("url")), status: "draft" }).then(({ error }) => ({ error })), "Asset criado.");
    event.currentTarget.reset();
  }

  async function changeStatus(table: "courses" | "modules" | "lessons" | "content_assets", id: string, status: Status) {
    await run(() => supabase.from(table).update({ status }).eq("id", id).then(({ error }) => ({ error })), `${statusLabel[status]} aplicado.`);
  }

  async function saveFields(table: "courses" | "modules" | "lessons" | "quiz_questions" | "content_assets", id: string, values: Record<string, unknown>) {
    await run(() => supabase.from(table).update(values).eq("id", id).then(({ error }) => ({ error })), "Alterações salvas.");
  }

  async function removeQuiz(id: string) {
    if (!window.confirm("Excluir esta pergunta de quiz?")) return;
    await run(() => supabase.from("quiz_questions").delete().eq("id", id).then(({ error }) => ({ error })), "Quiz excluído.");
  }

  if (loading) return <div className="notice">Carregando administração…</div>;
  if (!email) return <section className="admin-access-card"><span className="eyebrow">Acesso protegido</span><h2>Entre com a conta administrativa</h2><p>O CMS não fica disponível para visitantes.</p><Link className="button primary" href="/login">Entrar</Link></section>;
  if (!authorized) return <section className="admin-access-card"><span className="eyebrow">Acesso restrito</span><h2>Conta sem permissão administrativa</h2><p>A conta <strong>{email}</strong> pode utilizar a área do aluno, mas não gerenciar conteúdo.</p><Link className="button secondary" href="/perfil">Voltar ao painel</Link></section>;

  const publishedLessons = lessons.filter((item) => item.status === "published").length;
  const readiness = lessons.length ? Math.round(((publishedLessons + Math.min(new Set(quizzes.map((q) => q.lesson_id)).size, lessons.length)) / (lessons.length * 2)) * 100) : 0;

  return <div className="admin-dashboard">
    <section className="admin-summary-grid">
      <article className="admin-metric"><span>Cursos</span><strong>{courses.length}</strong><small>{courses.filter(c => c.status === "published").length} publicados</small></article>
      <article className="admin-metric"><span>Módulos</span><strong>{modules.length}</strong><small>{modules.filter(m => m.status === "published").length} publicados</small></article>
      <article className="admin-metric"><span>Aulas</span><strong>{lessons.length}</strong><small>{publishedLessons} publicadas</small></article>
      <article className="admin-metric"><span>Prontidão</span><strong>{readiness}%</strong><small>publicação + quiz</small></article>
      <article className="admin-metric"><span>Assets</span><strong>{assets.length}</strong><small>{assets.filter(a => a.status === "published").length} publicados</small></article>
    </section>

    {notice && <div className="notice success">{notice}</div>}
    {error && <div className="notice error">{error}</div>}

    <nav className="admin-tabs" aria-label="Seções do CMS">
      {(["courses","modules","lessons","quizzes","assets","audit"] as const).map(tab => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{({courses:"Cursos",modules:"Módulos",lessons:"Aulas",quizzes:"Quizzes",assets:"Assets",audit:"Histórico"})[tab]}</button>)}
    </nav>

    {activeTab === "courses" && <section className="admin-section">
      <div className="admin-section-heading"><div><span className="eyebrow">CRUD</span><h2>Cursos</h2></div><Link className="button secondary" href="/mvp">Checklist do MVP</Link></div>
      <form className="cms-form" onSubmit={createCourse}><input name="title" placeholder="Título" required/><input name="slug" placeholder="slug-do-curso" required/><input name="description" placeholder="Descrição"/><select name="level" defaultValue="beginner"><option value="beginner">Iniciante</option><option value="intermediate">Intermediário</option><option value="advanced">Avançado</option></select><input name="estimated_minutes" type="number" min="0" placeholder="Minutos"/><button className="button primary" disabled={busy}>Criar curso</button></form>
      <div className="cms-list">{courses.map(course => <article className="cms-item" key={course.id}><div><span className={`status-chip ${course.status}`}>{statusLabel[course.status]}</span><h3>{course.title}</h3><p>{course.slug}</p></div><div className="cms-actions"><select value={course.status} onChange={e => changeStatus("courses", course.id, e.target.value as Status)}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}</select><button onClick={() => { const title = window.prompt("Título do curso", course.title); if (title) saveFields("courses", course.id, { title }); }}>Editar</button><Link href={`/cursos/${course.slug}`}>Abrir</Link></div></article>)}</div>
    </section>}

    {activeTab === "modules" && <section className="admin-section"><span className="eyebrow">CRUD</span><h2>Módulos</h2>
      <form className="cms-form" onSubmit={createModule}><select name="course_id" required><option value="">Curso</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select><input name="title" placeholder="Título do módulo" required/><input name="description" placeholder="Descrição"/><input name="position" type="number" min="1" defaultValue="1"/><button className="button primary" disabled={busy}>Criar módulo</button></form>
      <div className="cms-list">{modules.map(module => <article className="cms-item" key={module.id}><div><span className={`status-chip ${module.status}`}>{statusLabel[module.status]}</span><h3>{module.position}. {module.title}</h3><p>{courses.find(c => c.id === module.course_id)?.title}</p></div><div className="cms-actions"><select value={module.status} onChange={e => changeStatus("modules", module.id, e.target.value as Status)}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}</select><button onClick={() => { const title = window.prompt("Título do módulo", module.title); if (title) saveFields("modules", module.id, { title }); }}>Editar</button></div></article>)}</div>
    </section>}

    {activeTab === "lessons" && <section className="admin-section"><span className="eyebrow">CRUD</span><h2>Aulas</h2>
      <form className="cms-form cms-form-wide" onSubmit={createLesson}><select name="module_id" required><option value="">Módulo</option>{modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}</select><input name="title" placeholder="Título" required/><input name="slug" placeholder="slug-da-aula" required/><input name="summary" placeholder="Resumo"/><textarea name="content" placeholder="Conteúdo da aula"/><input name="position" type="number" min="1" defaultValue="1"/><input name="estimated_minutes" type="number" min="0" placeholder="Minutos"/><button className="button primary" disabled={busy}>Criar aula</button></form>
      <div className="cms-list">{lessons.map(lesson => <article className="cms-item" key={lesson.id}><div><span className={`status-chip ${lesson.status}`}>{statusLabel[lesson.status]}</span><h3>{lesson.position}. {lesson.title}</h3><p>{modules.find(m => m.id === lesson.module_id)?.title} · {lesson.estimated_minutes} min</p></div><div className="cms-actions"><select value={lesson.status} onChange={e => changeStatus("lessons", lesson.id, e.target.value as Status)}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}</select><button onClick={() => { const title = window.prompt("Título da aula", lesson.title); if (title) saveFields("lessons", lesson.id, { title }); }}>Editar</button></div></article>)}</div>
    </section>}

    {activeTab === "quizzes" && <section className="admin-section"><span className="eyebrow">Avaliação</span><h2>Quizzes</h2>
      <form className="cms-form cms-form-wide" onSubmit={createQuiz}><select name="lesson_id" required><option value="">Aula</option>{lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select><input name="prompt" placeholder="Pergunta" required/><input name="option_a" placeholder="Alternativa A" required/><input name="option_b" placeholder="Alternativa B" required/><input name="option_c" placeholder="Alternativa C" required/><input name="option_d" placeholder="Alternativa D" required/><select name="correct_option" defaultValue="0"><option value="0">Correta: A</option><option value="1">Correta: B</option><option value="2">Correta: C</option><option value="3">Correta: D</option></select><input name="explanation" placeholder="Explicação"/><button className="button primary" disabled={busy}>Criar quiz</button></form>
      <div className="cms-list">{quizzes.map(q => <article className="cms-item" key={q.id}><div><h3>{q.prompt}</h3><p>{lessons.find(l => l.id === q.lesson_id)?.title}</p></div><div className="cms-actions"><button onClick={() => { const prompt = window.prompt("Pergunta", q.prompt); if (prompt) saveFields("quiz_questions", q.id, { prompt }); }}>Editar</button><button className="danger" onClick={() => removeQuiz(q.id)}>Excluir</button></div></article>)}</div>
    </section>}

    {activeTab === "assets" && <section className="admin-section"><span className="eyebrow">Biblioteca</span><h2>Assets educacionais</h2>
      <form className="cms-form" onSubmit={createAsset}><select name="course_id"><option value="">Sem curso</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select><input name="title" placeholder="Título" required/><select name="kind"><option value="pdf">PDF</option><option value="slides">Slides</option><option value="guide">Guia</option><option value="checklist">Checklist</option><option value="image">Imagem</option><option value="other">Outro</option></select><input name="url" placeholder="/materiais/arquivo" required/><button className="button primary" disabled={busy}>Criar asset</button></form>
      <div className="cms-list">{assets.map(asset => <article className="cms-item" key={asset.id}><div><span className={`status-chip ${asset.status}`}>{statusLabel[asset.status]}</span><h3>{asset.title}</h3><p>{asset.kind} · {asset.url}</p></div><div className="cms-actions"><select value={asset.status} onChange={e => changeStatus("content_assets", asset.id, e.target.value as Status)}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}</select><a href={asset.url}>Abrir</a></div></article>)}</div>
    </section>}

    {activeTab === "audit" && <section className="admin-section"><span className="eyebrow">Auditoria</span><h2>Histórico de alterações</h2><div className="audit-list">{audit.map(item => <article key={item.id}><strong>{item.action.toUpperCase()} · {item.entity_type}</strong><span>{new Date(item.created_at).toLocaleString("pt-BR")}</span><code>{item.entity_id}</code></article>)}</div></section>}
  </div>;
}
