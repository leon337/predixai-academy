import { CourseCatalog } from "../../components/CourseCatalog";

export default function CoursesPage() {
  return (
    <main className="page shell">
      <section className="page-heading">
        <span className="eyebrow">Catálogo</span>
        <h1>Cursos disponíveis</h1>
        <p>Conteúdos técnicos organizados em módulos, aulas e competências práticas.</p>
      </section>
      <CourseCatalog />
    </main>
  );
}
