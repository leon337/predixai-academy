import Link from "next/link";

const highlights = [
  ["Aprendizagem visual", "Diagramas, analogias e blocos pedagógicos para reduzir complexidade."],
  ["Projetos progressivos", "Cada módulo aproxima teoria, prática e aplicação profissional."],
  ["Competências mensuráveis", "O aluno acompanha aulas concluídas e evolução por habilidade."],
  ["Conteúdo multiplataforma", "Cursos, livros, PDFs, quizzes e apresentações a partir da mesma base."],
];

export default function HomePage() {
  return (
    <main>
      <section className="hero shell">
        <div className="hero-copy">
          <span className="eyebrow">Sprint 02 — Plataforma navegável</span>
          <h1>Aprenda tecnologia de forma clara, visual e aplicável.</h1>
          <p>A PredixAI Academy transforma assuntos técnicos em trilhas estruturadas, aulas práticas e progresso real.</p>
          <div className="actions">
            <Link className="button primary" href="/cursos">Explorar cursos</Link>
            <Link className="button secondary" href="/login">Criar conta</Link>
          </div>
        </div>
        <div className="hero-panel">
          <span className="badge">Curso-piloto publicado</span>
          <h2>Integração com WhatsApp Business Platform</h2>
          <p>Ecossistema Meta, WABA, Cloud API, webhooks, backend e governança.</p>
          <div className="progress-block">
            <div className="progress-label"><span>Módulo 1</span><strong>6 aulas</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: "100%" }} /></div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <span className="eyebrow">Princípios</span>
          <h2>Aprender, compreender e construir</h2>
        </div>
        <div className="feature-grid">
          {highlights.map(([title, description]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
