const highlights = [
  "Aprendizagem visual",
  "Projetos progressivos",
  "Competências mensuráveis",
  "Conteúdo multiplataforma",
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">Sprint 01 — Fundação técnica</span>
        <h1>PredixAI Academy</h1>
        <p>
          Uma plataforma educacional para transformar tecnologia complexa em
          aprendizagem clara, visual e aplicável.
        </p>
        <div className="actions">
          <a className="button primary" href="#curso-piloto">
            Conhecer o curso-piloto
          </a>
          <a className="button secondary" href="#fundacao">
            Ver a fundação
          </a>
        </div>
      </section>

      <section className="section" id="fundacao">
        <div className="section-heading">
          <span className="eyebrow">Princípios</span>
          <h2>Aprender, compreender e construir</h2>
        </div>
        <div className="grid">
          {highlights.map((highlight) => (
            <article className="card" key={highlight}>
              <h3>{highlight}</h3>
              <p>
                Cada elemento da experiência será projetado para reduzir a
                carga cognitiva e aproximar teoria e prática.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section course" id="curso-piloto">
        <span className="eyebrow">Curso-piloto</span>
        <h2>Integração com WhatsApp Business Platform</h2>
        <p>
          O primeiro módulo apresentará o ecossistema, a WABA, a Cloud API, os
          webhooks e os fluxos fundamentais antes da implementação prática.
        </p>
        <div className="status">Módulo 1 — Fundamentos e Ecossistema</div>
      </section>
    </main>
  );
}
