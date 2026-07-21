import Link from "next/link";

const checks = [
  ["Conteúdo", "Curso, módulo, aulas e quizzes revisados", "Concluído"],
  ["Experiência", "Fluxos de catálogo, aula, progresso e biblioteca", "Concluído"],
  ["Autenticação", "Cadastro, login, confirmação e saída", "Concluído"],
  ["Administração", "Painel protegido e inventário editorial", "Concluído"],
  ["Operação", "Endpoint de saúde e versão identificada", "Concluído"],
  ["Validação final", "Teste autenticado em celular e desktop", "Revisar"],
  ["Publicação", "Definir público piloto e canal de suporte", "Revisar"],
] as const;

export default function MvpPage() {
  const completed = checks.filter((item) => item[2] === "Concluído").length;
  const percent = Math.round((completed / checks.length) * 100);

  return (
    <main className="page shell">
      <section className="page-heading">
        <span className="eyebrow">Publicação controlada</span>
        <h1>Preparação do MVP</h1>
        <p>Critérios técnicos e operacionais antes da abertura para os primeiros alunos.</p>
      </section>

      <section className="mvp-overview">
        <article className="mvp-score-card">
          <span>Prontidão operacional</span>
          <strong>{percent}%</strong>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
          <small>{completed} de {checks.length} critérios concluídos</small>
        </article>
        <article className="mvp-release-card">
          <span className="eyebrow">Versão candidata</span>
          <h2>PredixAI Academy MVP 0.5.0</h2>
          <p>Primeiro corte funcional com aprendizagem, progresso, quizzes, biblioteca e administração.</p>
          <div className="admin-card-actions">
            <Link className="button secondary" href="/admin">Abrir administração</Link>
            <a className="button primary" href="/api/health">Ver saúde da aplicação</a>
          </div>
        </article>
      </section>

      <section className="release-checklist" aria-label="Checklist de publicação">
        {checks.map(([area, criterion, status]) => (
          <article className="release-check-row" key={area}>
            <div><span className="eyebrow">{area}</span><h2>{criterion}</h2></div>
            <span className={`status-chip ${status === "Concluído" ? "published" : "draft"}`}>{status}</span>
          </article>
        ))}
      </section>

      <section className="admin-section">
        <span className="eyebrow">Protocolo de lançamento</span>
        <h2>Sequência recomendada</h2>
        <ol className="release-steps">
          <li>Testar o curso completo com uma conta de aluno real.</li>
          <li>Verificar o painel administrativo com a conta autorizada.</li>
          <li>Executar o teste final em celular e desktop.</li>
          <li>Selecionar um grupo piloto pequeno e registrar feedback.</li>
          <li>Publicar a URL oficial somente após a validação do piloto.</li>
        </ol>
      </section>
    </main>
  );
}
