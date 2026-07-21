import { ProfilePanel } from "../../components/ProfilePanel";

export default function ProfilePage() {
  return (
    <main className="page shell">
      <section className="page-heading">
        <span className="eyebrow">Área do aluno</span>
        <h1>Seu perfil</h1>
        <p>Acompanhe sua conta e as aulas concluídas.</p>
      </section>
      <ProfilePanel />
    </main>
  );
}
