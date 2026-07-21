import { AuthForm } from "../../components/AuthForm";

export default function LoginPage() {
  return (
    <main className="page shell narrow-page">
      <section className="page-heading centered">
        <span className="eyebrow">Conta do aluno</span>
        <h1>Entrar na Academy</h1>
        <p>Acesse seu progresso ou crie sua conta para acompanhar as aulas.</p>
      </section>
      <AuthForm />
    </main>
  );
}
