# Mutuum

**Plataforma P2P de préstamos entre odontólogos del NEA** — MVP demo de producto, por **Dmeter**.

Mutuum conecta odontólogos que quieren colocar su excedente con colegas que necesitan crédito
en mejores condiciones que el banco. La confianza se apoya en la **matrícula profesional**, el
**aval de pares (vouching)** y la **reputación**. La plataforma facilita el encuentro y
documenta legalmente cada operación, **sin custodiar el dinero del préstamo** (el capital viaja
directo entre las partes).

> Esta es una **demo clickable** para presentar junto a las propuestas comerciales. Todos los
> datos son **ficticios** y las integraciones (matrícula, Renaper, KYC, scoring, pasarela de
> cobro) están **simuladas**.

## Recorrido del demo

1. **Landing** (`/`) — propuesta de valor y cómo funciona.
2. **Acceso** (`/acceso`) — selector de perfil demo (prestamista / tomador), sin contraseña.
3. **Onboarding** (`/onboarding`) — alta simulada: matrícula → Renaper → KYC biométrico → vouching.
4. **Inicio** (`/app`) — score crediticio, reputación, insignias y verificaciones.
5. **Matching** (`/app/matching`) — lista de solicitudes + filtros + **mapa interactivo del NEA**.
6. **Nueva solicitud** (`/app/nueva`) — publicar para prestar o tomar, con categorías de insumos y precio de referencia.
7. **Operación** (`/app/solicitud/[id]`) — revelación progresiva de identidad, **scoring**, **chat trazable**, **contrato** entre partes y **cobro de comisión**.
8. **Perfil** (`/app/perfil`) — reputación, insignias e historial.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** (CSS `@theme`, sin config) — sistema de diseño heredado de Dmeter con accent verde propio
- **Leaflet** + OpenStreetMap (CARTO light tiles) para el mapa del NEA
- Datos **mock** (`src/data/`), sesión en `localStorage` (sin backend)

## Correr en local

```bash
npm install
npm run dev
# http://localhost:3000
```

## Estructura

```
app/                      # rutas (App Router)
  page.tsx                # landing
  acceso/ onboarding/     # acceso demo + alta
  app/                    # shell autenticado (dashboard, matching, nueva, solicitud, perfil)
src/
  components/             # UI, AppShell, MatchingMap, ScoreGauge
  data/                   # dentists, requests, messages, categories (mock NEA)
  lib/                    # types, user-context, format/scoring
```

---

Hecho por [Dmeter](https://dmeter.com.ar).
