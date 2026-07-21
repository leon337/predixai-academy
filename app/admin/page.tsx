import { AdminPanel } from "../../components/AdminPanel";

export default function AdminPage() {
  return (
    <main className="page shell">
      <section className="page-heading">
        <span className="eyebrow">Administração</span>
        <h1>Gestão da Academy</h1>
        <p>Inventário editorial, prontidão do conteúdo e preparação operacional do MVP.</p>
      </section>
      <AdminPanel />
    </main>
  );
}
