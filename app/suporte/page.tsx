import { FeedbackForm } from "../../components/FeedbackForm";

export default function SupportPage() {
  return (
    <main className="page shell narrow-page">
      <section className="page-heading">
        <span className="eyebrow">Piloto v1.0</span>
        <h1>Suporte e feedback</h1>
        <p>Use este canal para registrar falhas, dúvidas e sugestões durante o lançamento controlado da PredixAI Academy.</p>
      </section>
      <section className="admin-section">
        <h2>Canal operacional</h2>
        <p>O feedback fica registrado no Supabase e será revisado pela administração da Academy.</p>
        <ul>
          <li>Informe a página em que ocorreu o problema.</li>
          <li>Descreva o resultado esperado e o resultado observado.</li>
          <li>Não envie senhas, tokens ou informações sensíveis.</li>
        </ul>
      </section>
      <FeedbackForm />
    </main>
  );
}
