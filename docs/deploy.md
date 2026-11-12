# Despliegue

Tres servicios, cada uno desplegado desde este repositorio.

| Servicio | Qué es | Dónde |
|---|---|---|
| Web | `apps/web` (Next.js) | Vercel |
| Servidor de batallas | `apps/battle-server` (Node + WebSocket) | Railway |
| Base de datos y cuentas | proyecto `pokeweb` | Supabase |

## 1. Supabase

El proyecto ya existe (`pokeweb`, organización `lendtrack`, región `us-east-1`) con la migración de `supabase/migrations` aplicada.

En el panel, **Authentication → URL Configuration**:

- **Site URL**: la URL de producción de Vercel.
- **Redirect URLs**: `https://<dominio>/auth/callback` y `http://localhost:3000/auth/callback`.

Para el botón "Continuar con Google", **Authentication → Providers → Google**: activar y pegar el Client ID y el Client Secret de un cliente OAuth creado en Google Cloud Console (tipo "Aplicación web"), con `https://pqzzgjfozrmcipuvhnhw.supabase.co/auth/v1/callback` como URI de redirección autorizada. Hasta que se configure, ese botón muestra un error; el acceso con correo y contraseña funciona sin esto.

## 2. Vercel (web)

1. Importar el repositorio.
2. **Root Directory**: `apps/web` (Settings → Build and Deployment). Vercel detecta Next.js y pnpm.

   Si el proyecto de Vercel ya existía de cuando la web era Vite, este paso es obligatorio: sin él el despliegue falla con `No Output Directory named "dist" found`. Deja además **Output Directory**, **Build Command** e **Install Command** sin sobrescribir (interruptores "Override" apagados); `apps/web/vercel.json` ya fija el framework en Next.js.
3. Variables de entorno (Production y Preview):

   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://pqzzgjfozrmcipuvhnhw.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | la clave *publishable* de Supabase (Project Settings → API Keys) |
   | `NEXT_PUBLIC_BATTLE_SERVER_URL` | `wss://<dominio-de-railway>` |

El plan Hobby de Vercel no permite uso comercial: antes de activar anuncios hay que pasar a Pro.

## 3. Railway (servidor de batallas)

1. Nuevo proyecto → Deploy from GitHub repo.
2. En el servicio, **Settings → Config-as-code**: `apps/battle-server/railway.json`. Deja el Root Directory en la raíz del repositorio: el Dockerfile necesita el workspace completo.
3. Variables:

   | Variable | Valor |
   |---|---|
   | `SUPABASE_URL` | `https://pqzzgjfozrmcipuvhnhw.supabase.co` |
   | `ALLOWED_ORIGINS` | la URL de producción de Vercel (varias, separadas por comas) |

   `PORT` lo pone Railway.
4. **Networking → Generate Domain**. Comprobar que `https://<dominio>/health` responde `{"status":"ok"}`.

## 4. GitHub Actions

`ci.yml` ejecuta lint, typecheck, tests y build en cada pull request. Las pruebas de navegador solo corren si existen estos secretos del repositorio: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `E2E_USER_EMAIL`, `E2E_USER_PASSWORD` (una cuenta de prueba ya confirmada).
