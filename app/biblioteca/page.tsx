export default function LibraryPage() {
  const materials = [
    {
      type: "Livro do aluno",
      title: "Módulo 1 — Fundamentos e Ecossistema",
      description: "Livro digital com fundamentos, arquitetura, fluxo completo, checklist e quiz de revisão.",
      href: "/materiais/livro-modulo-1-whatsapp.md",
      action: "Abrir livro",
    },
    {
      type: "Apresentação",
      title: "Apresentação do Módulo 1",
      description: "Roteiro de 12 slides para revisão visual dos principais conceitos do módulo.",
      href: "/materiais/apresentacao-modulo-1-whatsapp.md",
      action: "Abrir apresentação",
    },
    {
      type: "Glossário",
      title: "Glossário contextual do WhatsApp Business Platform",
      description: "Definições objetivas de WABA, Cloud API, webhook, backend, token, RLS e outros termos.",
      href: "/materiais/glossario-whatsapp-business-platform.md",
      action: "Abrir glossário",
    },
    {
      type: "Guia de estudo",
      title: "Mapa do ecossistema WhatsApp Business Platform",
      description: "Resumo dos componentes Meta Business, WABA, Cloud API, webhook, backend e banco de dados.",
      href: "/materiais/mapa-ecossistema-whatsapp.md",
      action: "Baixar guia",
    },
    {
      type: "Checklist",
      title: "Checklist de preparação da integração",
      description: "Itens que devem ser verificados antes de iniciar testes e preparar o ambiente de produção.",
      href: "/materiais/checklist-integracao-whatsapp.md",
      action: "Baixar checklist",
    },
    {
      type: "Curso",
      title: "Integração com WhatsApp Business Platform",
      description: "Acesse as seis aulas, responda aos quizzes e acompanhe seu progresso no painel do aluno.",
      href: "/cursos/whatsapp-business-platform",
      action: "Abrir curso",
    },
  ];

  return (
    <main className="page shell">
      <section className="page-heading">
        <span className="eyebrow">Biblioteca</span>
        <h1>Materiais de aprendizagem</h1>
        <p>Livros, apresentações, glossários, guias e checklists vinculados aos cursos publicados.</p>
      </section>
      <section className="resource-grid">
        {materials.map((material) => (
          <article className="resource-card" key={material.title}>
            <span className="badge">{material.type}</span>
            <h2>{material.title}</h2>
            <p>{material.description}</p>
            <a className="button primary" href={material.href}>{material.action}</a>
          </article>
        ))}
      </section>
    </main>
  );
}
