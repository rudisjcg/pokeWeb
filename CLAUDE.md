# pokeWeb

## Commits y pull requests

- No añadir líneas `Co-Authored-By` de Claude ni ningún otro crédito de coautoría en los mensajes de commit ni en las descripciones de PR. (Pedido por el dueño del repo el 2026-11-12.)

## Ramas

- El trabajo del cambio de arquitectura (Next.js + servidor de batallas + Supabase) vive en `feat/Arquitectural-change`.

## Specs y planes

- Los specs de diseño están en `docs/superpowers/specs/`. El proyecto se construye por fases; cada fase tiene su propio spec y plan.

## Código

- Monorepo pnpm: `apps/web` (Next.js 16), `apps/battle-server` (Node + ws), `packages/shared`.
- Todo en TypeScript estricto; sin `any` y sin archivos `.js`/`.jsx` de aplicación.
- Los textos visibles van en `apps/web/lib/strings.ts`. Los componentes no llaman a PokeAPI: solo `apps/web/lib/pokeapi.ts`.
- Next 16 usa `proxy.ts` (no `middleware.ts`).
- Antes de dar algo por terminado: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
