import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import "./globals.css";
import "./sprint3.css";

export const metadata: Metadata = {
  title: "PredixAI Academy",
  description: "Plataforma educacional oficial da PredixAI BR.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
