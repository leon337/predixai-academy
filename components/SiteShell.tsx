"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("predixai-theme");
    const nextDark = saved !== "light";
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";

    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("predixai-theme", next ? "dark" : "light");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <Link className="brand" href="/">PredixAI Academy</Link>
          <nav className="main-nav" aria-label="Navegação principal">
            <Link href="/cursos">Cursos</Link>
            <Link href="/biblioteca">Biblioteca</Link>
            <Link href="/perfil">Painel</Link>
          </nav>
          <div className="header-actions">
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Alternar tema">
              {dark ? "☀" : "☾"}
            </button>
            {email ? (
              <button className="text-button" type="button" onClick={signOut}>Sair</button>
            ) : (
              <Link className="text-button" href="/login">Entrar</Link>
            )}
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="shell footer-inner">
          <strong>PredixAI Academy</strong>
          <span>Aprendizagem visual, técnica e aplicável.</span>
        </div>
      </footer>
    </>
  );
}
