# Fase 1 — Base: stack, infraestructura y cuentas

Fecha: 2026-11-12
Estado: pendiente de revisión

## Contexto

pokeWeb es hoy una SPA en Vite + React 18 (JavaScript, ~2.200 líneas) con cuatro páginas (Home, Pokédex, detalle de Pokémon, Mi Lista), Firebase Auth + Firestore, datos de PokeAPI y dos escenas 3D con react-three-fiber. Se despliega como sitio estático en Vercel. No tiene servidor propio ni tests.

## Objetivo del proyecto

Convertirlo en un producto real con usuarios: rediseño visual con más animación y 3D, cuentas, peleas con el motor real de Pokémon Showdown, leaderboards, wiki y anuncios discretos.

Decisiones ya tomadas con el dueño:

- Objetivo: producto público con usuarios, no demo.
- Peleas: motor real de Showdown (`@pkmn/sim`, MIT) en servidor propio autoritativo.
- Datos: no hay usuarios reales en Firebase; se empieza limpio en Supabase.

## Hoja de ruta

Cada fase tiene su propio spec, plan e implementación.

| Fase | Contenido |
|---|---|
| 1 | Base: Next.js, monorepo, Supabase (cuentas + favoritos), esqueleto del servidor de batallas, CI. **Este documento.** |
| 2 | Rediseño visual, animaciones y 3D |
| 3 | Wiki / Pokédex ampliada con SEO |
| 4 | Team builder y batallas contra IA |
| 5 | PvP en tiempo real, matchmaking, ELO y leaderboards |
| 6 | Anuncios |

Nota sobre la fase 6: Pokémon es propiedad de Nintendo / The Pokémon Company. Monetizar un fan site tiene riesgo legal y las redes de anuncios pueden rechazarlo. Se deja para el final y se decide entonces.

## Arquitectura global

```
Navegador ──HTTPS──> Next.js en Vercel (páginas, wiki SSG/ISR, team builder)
    │                      │
    │                      └──> Supabase: Auth + Postgres
    │                                   ▲
    └──WebSocket──> Servidor de batallas en Railway (Node + @pkmn/sim)
```

- **Vercel** sirve la web. La wiki y la Pokédex necesitan SSR/SSG para posicionar en buscadores.
- **Railway** aloja el servidor de batallas: proceso Node persistente con WebSockets, cosa que Vercel no soporta. Se descartó Render porque su plan gratuito duerme el servicio.
- **Supabase** da autenticación y Postgres. ELO, rankings e historial de partidas son consultas SQL directas.
- El servidor de batallas es autoritativo: el cliente envía decisiones y nunca calcula resultados. Solo el servidor escribe partidas y ratings, con la service role key.

Alternativas descartadas: mantener la SPA de Vite (sin SSR la wiki no posiciona) y un único servidor con Next custom (pierde CDN/ISR y acopla la web a la carga de batallas).

Costo inicial estimado: Vercel Hobby $0, Supabase Free $0, Railway ~$5/mes. El plan Hobby de Vercel prohíbe uso comercial: al activar anuncios hay que pasar a Pro ($20/mes).

## Alcance de la fase 1

### 1. Monorepo

pnpm workspaces:

```
apps/web             Next.js (App Router), TypeScript
apps/battle-server   Node + TypeScript
packages/shared      Tipos y protocolo de mensajes compartidos
supabase/migrations  SQL versionado
```

TypeScript estricto en todo. El código actual se convierte a TS al migrarlo.

### 2. Migración a Next.js

Rutas, con el mismo comportamiento y aspecto que hoy:

| Ruta | Render | Notas |
|---|---|---|
| `/` | Estático | Header con escena 3D + destacados |
| `/pokedex` | Servidor, con caché | Listado, búsqueda y filtro por tipo |
| `/pokemon/[id]` | SSG/ISR | Stats, evoluciones, gráfico |
| `/mylist` | Cliente, requiere sesión | Favoritos del usuario |
| 404 | Estático | |

- Las escenas 3D (`Pikachu`, `Center`) se cargan con `next/dynamic` y `ssr: false`.
- Los datos de PokeAPI se piden en el servidor mediante un módulo único `lib/pokeapi.ts` con `fetch` cacheado (revalidación de 24 h). Los componentes no llaman a PokeAPI directamente.
- Se conservan Tailwind, framer-motion, react-three-fiber/drei, chart.js y sonner.
- `vercel.json` con el rewrite de SPA se elimina.

### 3. Limpieza de dependencias

Se eliminan: Firebase, MUI y Emotion, jQuery, Redux Toolkit y react-redux (la sesión la da Supabase; los modales usan estado local), react-router, axios, Storybook, y las que no tengan ningún uso tras la migración (se verifica con búsqueda de imports antes de quitar cada una).

### 4. Cuentas

- Supabase Auth con `@supabase/ssr` (sesión en cookies, disponible en servidor y cliente).
- Métodos: email + contraseña y Google OAuth.
- Registro pide nombre de usuario único (3–20 caracteres, letras, números y guion bajo).
- Los modales actuales de login y registro se conservan, conectados a Supabase.
- `/mylist` redirige al login si no hay sesión.

### 5. Esquema de base de datos

```sql
profiles (
  id          uuid primary key references auth.users on delete cascade,
  username    citext unique not null,
  avatar_url  text,
  created_at  timestamptz not null default now()
)

favorites (
  user_id     uuid references profiles on delete cascade,
  pokemon_id  int not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, pokemon_id)
)
```

Row Level Security activado en ambas:

- `profiles`: lectura pública; cada usuario solo actualiza su propia fila.
- `favorites`: cada usuario solo lee, inserta y borra las suyas.

El perfil se crea con un trigger al registrarse el usuario. Las tablas de equipos, partidas y ratings se añaden en las fases 4 y 5.

### 6. Esqueleto del servidor de batallas

Sin lógica de batalla todavía. Solo:

- `GET /health` devuelve 200.
- Endpoint WebSocket que valida el JWT de Supabase al conectar, responde a `ping` con `pong` y rechaza conexiones sin token válido.
- Dockerfile y configuración de Railway.

Su propósito es dejar probado el pipeline de despliegue y la autenticación entre servicios antes de la fase 4.

### 7. Tests y CI

- Vitest: `lib/pokeapi.ts`, validación de nombre de usuario, validación de JWT en el servidor de batallas.
- Playwright: registro, login, añadir y quitar un favorito, redirección de `/mylist` sin sesión.
- GitHub Actions en cada PR: lint, typecheck, tests unitarios y build de ambas apps.

### 8. Despliegue

- Vercel: proyecto apuntando a `apps/web`.
- Railway: servicio apuntando a `apps/battle-server`.
- Supabase: proyecto nuevo; migraciones aplicadas desde `supabase/migrations`.
- Variables de entorno documentadas en `.env.example` de cada app. Ningún secreto en el repo.

Conectar Vercel y Railway al repo lo hace el dueño desde sus cuentas; el spec de implementación incluye los pasos.

## Manejo de errores

- PokeAPI caída o lenta: las páginas con caché sirven la última versión; si no hay caché, página de error con reintento.
- Errores de autenticación: mensaje en el modal mediante toast, sin exponer detalles internos.
- Nombre de usuario duplicado: validación en el formulario y restricción única en base de datos como garantía final.
- Fallo al guardar un favorito: se revierte el cambio optimista y se avisa con toast.

## Fuera de alcance

Rediseño visual, wiki ampliada, team builder, cualquier lógica de batalla, matchmaking, leaderboards, anuncios, inglés. La interfaz queda en español con los textos centralizados para facilitar añadir idiomas después.

## Criterios de éxito

1. Las cuatro páginas actuales funcionan en Next.js sin pérdida de funciones.
2. Un usuario puede registrarse, iniciar sesión (email y Google) y gestionar favoritos contra Supabase.
3. Firebase no aparece en el código ni en las dependencias.
4. El servidor de batallas responde al health check en Railway y rechaza WebSockets sin JWT válido.
5. La CI pasa en verde: lint, typecheck, tests y build.
6. Todo el código es TypeScript estricto: no queda ningún archivo `.js` o `.jsx` de aplicación (solo archivos de configuración que la herramienta exija en JS) y no se usa `any`.
