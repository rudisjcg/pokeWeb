# Fase 2 — Rediseño visual, animaciones y 3D

Fecha: 2026-11-12
Estado: aprobado en conversación

## Contexto

Tras la fase 1, pokeWeb corre en Next.js 16 con el mismo aspecto que la SPA original: fondo azul casi negro, Poppins en todo, tarjetas planas, un Pikachu 3D pequeño en Home y un Pokécenter 3D en la Pokédex. Esta fase cambia el aspecto y el movimiento de todas las páginas sin añadir contenido nuevo.

Decisiones tomadas con el dueño:

- Dirección visual: **Arena competitiva** — oscuro, con energía de e-sports, color según el tipo del Pokémon, paneles tipo HUD.
- 3D: **escena grande en Home + efectos 3D en tarjetas**. No hay modelos 3D por Pokémon; el 3D de tarjetas y detalle se hace con CSS sobre las ilustraciones.

## Sistema visual

### Color

Definidos como variables CSS en `globals.css` y expuestos a Tailwind.

| Token | Valor | Uso |
|---|---|---|
| `ink-950` | `#05070f` | fondo de página |
| `ink-900` | `#0a0e1c` | secciones alternas, navbar |
| `ink-800` | `#111728` | paneles |
| `ink-700` | `#1b2338` | paneles elevados, campos |
| `line` | `#2a3352` | bordes |
| `text` | `#eef1fa` | texto principal |
| `muted` | `#98a2c3` | texto secundario |
| `volt` | `#f5d90a` | color de marca, acciones principales, foco |
| `danger` | `#ff4d5e` | acciones destructivas, errores |

Cada uno de los 18 tipos tiene un color propio (`lib/typeColors.ts`). Un componente fija `--type` (y `--type-2` si hay segundo tipo) en su contenedor; tarjetas y cabeceras leen esas variables. El texto sobre un color de tipo es oscuro o claro según su luminancia, para mantener contraste AA.

### Tipografía

- Display: **Chakra Petch** (600/700) — títulos y números.
- Texto: **Manrope** (400/500/700).
- Ambas con `next/font`. Poppins se elimina.

### Componentes base (`components/ui/`)

| Componente | Qué es |
|---|---|
| `Panel` | contenedor con esquinas cortadas (clip-path), borde `line` y, opcional, resplandor del color de tipo |
| `Button` | variantes `primary` (volt), `ghost` (borde), `danger`; tamaños `md` y `lg` |
| `TypeBadge` | icono del tipo + nombre sobre su color |
| `StatBar` | etiqueta, valor y barra que se llena hasta `valor / 255` |
| `SkeletonCard` | esqueleto con la forma de la tarjeta nueva |
| `Modal` | el existente, con el estilo de panel |

## Páginas

### Home

- Hero a altura de pantalla: titular, subtítulo y dos acciones ("Explorar la Pokédex" → `/pokedex`; "Crear cuenta" abre el registro, o "Mi lista" si hay sesión).
- Escena 3D detrás/al lado del texto: Pikachu sobre una plataforma circular con anillos luminosos, partículas flotantes y una luz que sigue el puntero. Rotación automática lenta; el usuario puede arrastrar para girar.
- Debajo, los 10 destacados actuales como fila horizontal de tarjetas holográficas con desplazamiento táctil (sin Swiper; se elimina la dependencia).

### Pokédex

- Barra fija bajo la navbar: búsqueda por nombre o número, orden (número, A–Z, Z–A) y **filtro por tipo** (18 chips; uno activo a la vez; "Todos" lo quita).
- Rejilla responsive de tarjetas. "Cargar más" de 12 en 12.
- Estados: cargando (esqueletos), sin resultados, error con reintento.
- El Pokécenter 3D deja esta página.

### Detalle de Pokémon

- Cabecera teñida con el color del tipo: número grande de fondo, nombre, insignias, ilustración grande con parallax al mover el puntero, botón de favorito.
- Estadísticas como seis `StatBar` más el total. Se elimina chart.js.
- Línea evolutiva con flechas entre etapas; la actual resaltada.
- Datos (altura en m, peso en kg, experiencia base, habilidades) en un panel.
- Efectividad por tipo como grupos de insignias (fuerte contra, débil contra, resiste, vulnerable a).
- Navegación anterior / siguiente por número.

### Mi Lista

- Tarjeta de entrenador (avatar, nombre, número de Pokémon, cerrar sesión).
- Colección en rejilla con la tarjeta nueva en tamaño compacto; al pulsar, el modal con detalles y quitar.
- Estado vacío con el Pokécenter 3D y un botón hacia la Pokédex.

### Marco común

- Navbar translúcida con indicador de página activa y chip de usuario; menú móvil a pantalla completa.
- Pie de página nuevo: enlaces, y el aviso de que es un proyecto de fans no afiliado a Nintendo / The Pokémon Company.
- El banner inferior de acceso se sustituye por los botones de la navbar (el banner tapaba contenido).
- 404 y error con el mismo sistema; el 404 muestra el Pokécenter 3D.
- Modales de acceso y registro con estilo de panel.

## Tarjeta de Pokémon

- Fondo con degradado del color del tipo, número, nombre, insignias e ilustración que sobresale del borde superior.
- Al pasar el puntero: inclinación 3D siguiendo el cursor y un brillo holográfico que se desplaza (CSS, sin WebGL). En táctil no se inclina.
- Toda la tarjeta es un único enlace al detalle.

## Animación

- Transición entre páginas con la View Transitions API de React/Next; la ilustración de la tarjeta se transforma en la de la cabecera del detalle. En navegadores sin soporte, la navegación es instantánea.
- El movimiento automático se concentra en dos momentos: la carga del hero y la transición tarjeta → detalle. Las secciones no animan su entrada una a una.
- Barras de estadísticas que se llenan al entrar en pantalla.
- Con `prefers-reduced-motion: reduce`: sin inclinación, sin parallax, sin transición de página, sin rotación automática; solo fundidos.

## 3D y rendimiento

- La escena de Home se importa de forma diferida después del primer render; el texto del hero no depende de ella.
- `frameloop` bajo demanda cuando no hay interacción ni rotación; se detiene cuando el hero sale de pantalla o la pestaña pierde foco.
- Resolución limitada a `dpr` 1.5.
- Sin WebGL, o con "reducir movimiento", se muestra una imagen estática del Pikachu (render guardado en `public/`).
- En pantallas menores de 768 px la escena se muestra más pequeña bajo el texto y sin partículas.

## Accesibilidad

- Contraste AA en texto e insignias.
- Foco visible (anillo `volt`) en todo elemento interactivo.
- Chips de tipo como grupo de botones con `aria-pressed`.
- La escena 3D es decorativa (`aria-hidden`).
- Objetivos táctiles de al menos 44 px.

## Datos

Único cambio: `lib/pokeapi.ts` gana `listPokemonIdsByType(type)` (endpoint `type/{name}`, misma caché de 24 h) y `/api/pokemon` acepta `?type=` para devolver esos ids.

## Dependencias

- Se eliminan: `chart.js`, `react-chartjs-2`, `swiper`, `react-parallax-tilt`, `tailwindcss-animated`.
- No se añade ninguna.

## Pruebas

- Los 5 tests de Playwright existentes siguen pasando; se ajustan solo los selectores cuyo texto cambie.
- Tests unitarios: colores y contraste por tipo, porcentaje de `StatBar`, conversión de altura/peso, `listPokemonIdsByType`, validación de `?type=`.
- Tests de Playwright nuevos: filtro por tipo, navegación anterior/siguiente, y que con "reducir movimiento" no se monta el canvas 3D.
- Revisión visual con capturas a 390 px y 1280 px de cada página.

## Fuera de alcance

Contenido nuevo de wiki (movimientos, habilidades, generaciones, buscador avanzado), pantallas de batalla o rankings, modo claro, sonido, inglés.

## Criterios de éxito

1. Todas las páginas usan el sistema Arena; no queda ninguna clase ni estilo del diseño anterior sin uso.
2. Home muestra la escena 3D interactiva y degrada a imagen estática sin WebGL o con "reducir movimiento".
3. La Pokédex filtra por tipo.
4. La navegación tarjeta → detalle anima la ilustración en navegadores compatibles.
5. Home, Pokédex y detalle siguen siendo estáticas/ISR.
6. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` y los tests de navegador pasan.
