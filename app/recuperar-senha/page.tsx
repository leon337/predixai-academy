import { PasswordRecovery } from "../../components/PasswordRecovery";

export default function RecoverPasswordPage() {
  return (
    <main className="page shell narrow-page">
      <section className="page-heading">
        <span className="eyebrow">Acesso</span>
        <h1>Recuperar senha</h1>
        <p>Solicite um link por e-mail ou defina uma nova senha após abrir o link de recuperação.</p>
      </section>
      <PasswordRecovery />
    </main>
  );
}
