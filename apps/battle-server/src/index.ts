import { createSupabaseVerifier } from "./auth";
import { createBattleServer } from "./server";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable ${name}. See apps/battle-server/.env.example.`);
    process.exit(1);
  }
  return value;
}

const supabaseUrl = requireEnv("SUPABASE_URL");
const allowedOrigins = requireEnv("ALLOWED_ORIGINS")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const port = Number(process.env.PORT ?? 8080);

const server = createBattleServer({ verify: createSupabaseVerifier(supabaseUrl), allowedOrigins });

server.listen(port, () => {
  console.log(`battle-server listening on :${port}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
