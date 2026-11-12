# pokeWeb

Pokédex, wiki y lista de favoritos de Pokémon. En construcción por fases hacia una plataforma con batallas en línea y clasificaciones; ver `docs/superpowers/specs/`.

## Estructura

```
apps/web             Next.js (App Router): la web
apps/battle-server   Node + WebSocket: servidor de batallas (por ahora, solo el esqueleto)
packages/shared      Tipos y validaciones compartidos
supabase/migrations  Esquema de la base de datos
docs/                Specs, planes y guía de despliegue
```

## Desarrollo

Requiere Node 22 y pnpm 10.

```bash
pnpm install
```

Copia `apps/web/.env.example` a `apps/web/.env.local` y rellena la URL y la clave *publishable* del proyecto de Supabase.

```bash
pnpm dev
```

La web queda en http://localhost:3000.

| Comando | Qué hace |
|---|---|
| `pnpm lint` | ESLint y comprobación de tipos |
| `pnpm typecheck` | TypeScript en los tres paquetes |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm build` | Build de producción |
| `pnpm --filter web e2e` | Tests de navegador (Playwright); los de cuentas necesitan `E2E_USER_EMAIL` y `E2E_USER_PASSWORD` |
| `pnpm --filter battle-server dev` | Servidor de batallas en local (ver su `.env.example`) |

## Despliegue

Ver [docs/deploy.md](docs/deploy.md).
