const base = process.env.BASE_URL || "https://predixai-academy.vercel.app";
const routes = ["/", "/cursos", "/biblioteca", "/login", "/perfil", "/admin", "/mvp", "/api/health"];
let failed = false;
for (const route of routes) {
  const response = await fetch(`${base}${route}`, { redirect: "follow" });
  const ok = response.status >= 200 && response.status < 400;
  console.log(`${ok ? "PASS" : "FAIL"} ${response.status} ${route}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
