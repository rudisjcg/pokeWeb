# Fase 2 — Rediseño visual: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a todas las páginas de `apps/web` el sistema visual "Arena", con escena 3D interactiva en Home, tarjetas holográficas, filtro por tipo y transiciones entre páginas.

**Architecture:** Tokens de diseño como variables CSS expuestas a Tailwind; primitivas en `components/ui/`; el color de tipo se propaga con `--type` desde `lib/typeColors.ts`. La lógica nueva (colores, porcentajes, unidades, filtro) vive en funciones puras con tests; lo visual se verifica con Playwright y capturas.

**Tech Stack:** Next.js 16, React 19, Tailwind 3, framer-motion, react-three-fiber/drei, View Transitions API, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-12-fase-2-rediseno-design.md`

## Global Constraints

- Colores, fuentes y nombres de token exactamente como en la tabla del spec (`ink-950 #05070f` … `volt #f5d90a`, `danger #ff4d5e`; Chakra Petch + Manrope).
- TypeScript estricto, sin `any`; textos en `lib/strings.ts`; PokeAPI solo desde `lib/pokeapi.ts`.
- Home, `/pokedex` y `/pokemon/[id]` siguen estáticas/ISR: nada de cookies ni sesión en servidor en esas rutas.
- Con `prefers-reduced-motion: reduce` no hay inclinación, parallax, transición de página ni canvas 3D.
- Foco visible `volt` y objetivos táctiles ≥ 44 px en todo control.
- No se añade ninguna dependencia. Se eliminan `chart.js`, `react-chartjs-2`, `swiper`, `react-parallax-tilt`, `tailwindcss-animated`.
- Commits sin `Co-Authored-By`.

## Review Focus

1. Pokémon con un tipo que no está en la tabla de colores (p. ej. `stellar`, `unknown`) → color neutro, sin romper la página. (Tarea 1)
2. Estadística por encima de 255 o negativa → la barra se queda entre 0 % y 100 %. (Tarea 1)
3. Filtro por tipo combinado con búsqueda y orden → la búsqueda manda; al reiniciar vuelve el filtro activo. (Tarea 3)
4. Detalle del primer y último Pokémon (`#1`, formas `#10001+`) → anterior/siguiente no enlazan a páginas inexistentes. (Tarea 4)
5. Navegador sin WebGL → imagen estática, sin error en consola. (Tarea 5)

---

### Task 1: Tokens, fuentes y primitivas

**Files:**
- Modify: `app/globals.css` (reescrito), `tailwind.config.ts`, `app/layout.tsx`
- Create: `lib/typeColors.ts`, `lib/stats.ts`, `components/ui/Panel.tsx`, `Button.tsx`, `StatBar.tsx`; Modify: `components/TypeBadge.tsx` → `components/ui/TypeBadge.tsx`, `components/ui/SkeletonCard.tsx`
- Test: `lib/typeColors.test.ts`, `lib/stats.test.ts`

**Interfaces:**
- Produces:
  - `typeColor(type: string): string` — hex del tipo; `NEUTRAL_TYPE_COLOR = "#7c86a8"` para desconocidos.
  - `readableOn(hex: string): "#05070f" | "#ffffff"` — texto con mayor contraste sobre ese fondo.
  - `typeStyle(types: string[]): CSSProperties` — `{ "--type": …, "--type-2": … }` (el segundo repite el primero si no hay).
  - `statPercent(value: number, max = 255): number` — 0–100, acotado.
  - `statTotal(values: number[]): number`.
  - `formatHeight(decimetres: number): string` → `"0,4 m"`; `formatWeight(hectograms: number): string` → `"6 kg"`.
  - `<Panel as? tone?: "default" | "type" className?>`, `<Button variant size href? …>` (renderiza `<Link>` si hay `href`), `<TypeBadge type size?>`, `<StatBar label value>`.

- [ ] **Step 1: Tests que fallan:** `typeColor("fire") === "#ff6b3d"`, `typeColor("stellar") === NEUTRAL_TYPE_COLOR`; `readableOn("#f5d90a") === "#05070f"`, `readableOn("#3b2a8c") === "#ffffff"`; `typeStyle(["grass","poison"])` da ambas variables y `typeStyle(["fire"])` repite; `statPercent(255) === 100`, `statPercent(300) === 100`, `statPercent(-5) === 0`, `statPercent(51) === 20`; `statTotal([35,55,40,50,50,90]) === 320`; `formatHeight(4) === "0,4 m"`, `formatWeight(60) === "6 kg"`, `formatWeight(69) === "6,9 kg"`.
- [ ] **Step 2:** `pnpm --filter web test` → fallan.
- [ ] **Step 3:** Implementar helpers; reescribir tokens, fuentes y primitivas.
- [ ] **Step 4:** Tests pasan; typecheck y lint limpios.
- [ ] **Step 5:** Commit `feat(web): Arena design tokens and UI primitives`.

### Task 2: Marco común

**Files:** Modify `components/Navbar.tsx`, `components/auth/Modal.tsx`, `LoginModal.tsx`, `SignUpModal.tsx`, `app/not-found.tsx`, `app/error.tsx`, `app/layout.tsx`, `lib/strings.ts`; Create `components/Footer.tsx`; Delete `components/Banner.tsx`.

**Interfaces:** Navbar muestra "Iniciar sesión" y "Registrarse" (mismos nombres accesibles que hoy) cuando no hay sesión, y el chip `data-testid="nav-user"` cuando la hay.

- [ ] **Step 1:** Rediseñar navbar (translúcida, activo con `usePathname`, menú móvil a pantalla completa), footer con aviso de proyecto de fans, modales con `Panel`, 404 y error.
- [ ] **Step 2:** `pnpm --filter web e2e` → los 5 tests siguen pasando.
- [ ] **Step 3:** Capturas 390/1280 de Home y del modal de acceso. Commit `feat(web): Arena navbar, footer, modals and error pages`.

### Task 3: Tarjeta holográfica y Pokédex con filtro

**Files:** Modify `lib/pokeapi.ts`, `lib/parseIds.ts` (→ añade `parseType`), `app/api/pokemon/route.ts`, `components/PokemonCard.tsx`, `components/pokedex/PokedexBrowser.tsx`, `app/pokedex/page.tsx`; Create `components/HoloTilt.tsx`; Delete `components/Tilt.tsx`.
**Test:** `lib/pokeapi.test.ts`, `lib/parseIds.test.ts`, `e2e/pokedex.spec.ts`

**Interfaces:**
- `listPokemonIdsByType(type: string): Promise<number[]>` — ids ascendentes; `[]` si el tipo no existe (404).
- `parseType(raw: string | null): string | null` — solo uno de los 18 tipos conocidos.
- `GET /api/pokemon?type=fire` → `number[]`; tipo inválido → 400.
- `<HoloTilt>` — inclinación + brillo siguiendo el puntero vía variables CSS; inactivo en táctil y con reduced motion.
- `<PokemonCard pokemon size?: "md" | "sm" />`; la ilustración lleva `style={{ viewTransitionName: \`pokemon-${id}\` }}`.

- [ ] **Step 1: Tests que fallan:** `listPokemonIdsByType("fire")` con respuesta simulada → ids ordenados; 404 → `[]`. `parseType("fire") === "fire"`, `parseType("FIRE")`, `parseType("lava")`, `parseType(null)` → `null`. E2E: pulsar el chip "fire" deja solo tarjetas con insignia fire y la primera es charmander; "Todos" vuelve a bulbasaur; buscar con filtro activo y reiniciar conserva el filtro.
- [ ] **Step 2:** Ejecutar → fallan.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Unit y e2e pasan. Capturas 390/1280.
- [ ] **Step 5:** Commit `feat(web): holographic cards and type filter in the Pokédex`.

### Task 4: Detalle de Pokémon

**Files:** Modify `app/pokemon/[id]/page.tsx`, `components/pokemon/EvolutionChain.tsx`, `TypeMatchups.tsx`, `components/AddFavoriteButton.tsx`; Create `components/pokemon/PokemonHero.tsx`, `ParallaxArt.tsx`, `PrevNext.tsx`, `lib/neighbors.ts`; Delete `components/pokemon/StatsChart.tsx`.
**Test:** `lib/neighbors.test.ts`, `e2e/pokemon.spec.ts`

**Interfaces:**
- `neighbors(id: number, names: PokemonName[]): { prev: PokemonName | null; next: PokemonName | null }` — vecinos por posición en la lista; `null` en los extremos o si el id no está.

- [ ] **Step 1: Tests que fallan:** `neighbors(1, …).prev === null`; `neighbors(25, …)` → raichu/arbok según lista; último → `next === null`; id ausente → ambos `null`. E2E: `/pokemon/pikachu` muestra seis barras de estadística y el total 320; "Siguiente" lleva a `/pokemon/raichu`; `/pokemon/bulbasaur` no tiene enlace "Anterior".
- [ ] **Step 2:** Ejecutar → fallan.
- [ ] **Step 3:** Implementar la página con las secciones del spec.
- [ ] **Step 4:** Tests pasan; e2e de favoritos siguen pasando. Capturas.
- [ ] **Step 5:** Commit `feat(web): Arena pokemon detail page`.

### Task 5: Home con escena 3D

**Files:** Modify `app/page.tsx`, `components/Header.tsx` → `components/home/Hero.tsx`, `components/Featured.tsx`, `canvas/ModelCanvas.tsx`; Create `canvas/ArenaScene.tsx`, `canvas/HeroCanvas.tsx`, `lib/useReducedMotion3d.ts`, `components/home/FeaturedRail.tsx`, `public/assets/pikachu-static.png`; Delete `components/FeaturedCarousel.tsx`, `canvas/Pikachu.tsx`.
**Test:** `e2e/home.spec.ts`

**Interfaces:**
- `useCanRender3d(): boolean | null` — `null` hasta comprobar; `false` sin WebGL o con reduced motion.
- `<HeroCanvas />` — monta `ArenaScene` solo si `useCanRender3d()` es `true`; si es `false`, `<img data-testid="hero-static">`.

- [ ] **Step 1: E2E que falla:** con `reducedMotion: "reduce"` no hay `canvas` en Home y sí `hero-static`; sin esa preferencia aparece un `canvas`; el botón "Explorar la Pokédex" navega a `/pokedex`; hay 10 tarjetas destacadas.
- [ ] **Step 2:** Ejecutar → falla.
- [ ] **Step 3:** Implementar escena (plataforma, anillos, partículas, luz que sigue el puntero, pausa fuera de pantalla, dpr ≤ 1.5), hero y fila de destacados. Generar `pikachu-static.png` capturando la escena.
- [ ] **Step 4:** E2E pasa; sin errores de consola. Capturas 390/1280.
- [ ] **Step 5:** Commit `feat(web): interactive 3D arena hero and featured rail`.

### Task 6: Mi Lista

**Files:** Modify `components/mylist/FavoritesGrid.tsx`, `app/mylist/page.tsx`, `canvas/Center.tsx`, `app/not-found.tsx`.

- [ ] **Step 1:** Tarjeta de entrenador, rejilla con `PokemonCard size="sm"` (el botón conserva `data-testid="favorite-item"`), estado vacío con Pokécenter y enlace a la Pokédex; Pokécenter también en 404.
- [ ] **Step 2:** E2E de favoritos pasan. Capturas con lista vacía y con elementos.
- [ ] **Step 3:** Commit `feat(web): Arena My List and empty states`.

### Task 7: Transiciones, limpieza y verificación

**Files:** Modify `next.config.ts` (`experimental.viewTransition`), `components/PokemonCard.tsx`, `components/pokemon/PokemonHero.tsx`, `app/globals.css`, `package.json`, `tailwind.config.ts`.

- [ ] **Step 1:** Activar transiciones de vista; la ilustración comparte `view-transition-name` entre tarjeta y cabecera; desactivadas con reduced motion.
- [ ] **Step 2:** Quitar las cinco dependencias y todo CSS/clase del diseño anterior sin uso (`grep` de cada clase de `globals.css` en el código).
- [ ] **Step 3:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build` en verde; el build lista `/`, `/pokedex` y `/pokemon/[id]` como estáticas/ISR; e2e completos contra el build de producción.
- [ ] **Step 4:** Capturas finales 390/1280 de las cinco páginas. Commit `feat(web): page transitions and cleanup`; push.
