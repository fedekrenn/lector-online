# Lector online

Webapp construida con Astro + React que permite cargar la página HTML de una URL remota (server-side) y mostrarla sin limitaciones de suscripción. Incluye un historial local (guardado en localStorage) y un endpoint API ligero que actúa como proxy para obtener el HTML remoto.

## Tecnologías principales

- Astro (v5)
- React + React DOM
- Tailwind CSS
- Axios (para las peticiones servidor-side)

## Requisitos

- Node.js 18+ (recomendado por compatibilidad con Astro)
- pnpm (recomendado) o npm/yarn

## Instalación (local)

Recomendado (con pnpm):

```bash
pnpm install
pnpm dev
```

Comandos útiles:

- `pnpm dev`: iniciar servidor de desarrollo
- `pnpm build`: construir para producción
- `pnpm preview`: previsualizar la build localmente

## Estructura del proyecto

- `astro.config.mjs`: configuración principal de Astro (adapter Vercel, integraciones React y Tailwind)
- `package.json`: dependencias y scripts
- `src/`
  - `assets/`: imágenes y SVGs usados por la UI
  - `components/`: componentes React (App, Aside, Header, Input, Spinner, History...)
  - `layouts/`: `Layout.astro` (HTML base y carga de estilos globales)
  - `pages/`: páginas de Astro
    - `index.astro`: página principal que monta el componente principal
    - `api/get-information.ts`: endpoint server-side que recibe `?url=` y devuelve el HTML remoto (ver sección API)
  - `styles/`: `global.css` (Tailwind + estilos custom)
  - `types/`: definiciones TypeScript (`types.d.ts`)
  - `utils/`: `getData.ts` (función que hace la petición HTTP con axios)

## Cómo funciona (flujo principal)

1. El usuario introduce una URL en el input en la UI.
2. El frontend llama a `/api/get-information?url=<URL>`.
3. El endpoint server-side obtiene el HTML de la URL remota y devuelve un JSON con: `{ id, html, slug, url }`.
4. El frontend recibe el HTML y lo renderiza.
5. La aplicación guarda un historial local en `localStorage` con las últimas URLs visitadas y permite reabrirlas rápidamente.

## Endpoint API

- Ruta: `GET /api/get-information?url=<URL>`
- Respuesta:

```json
{
  "id": "<string>",
  "html": "<string>",
  "slug": "<string>",
  "url": "<string>"
}
```

- Notas: la petición a la URL remota se realiza desde el servidor (no hay CORS desde el browser para esa llamada concreta). Si la URL es inválida o la petición falla, el endpoint responde con 500 y el mensaje de error.

<br>

## 🙋‍♂️ Hola, Soy Federico Krenn

:nerd_face: Software Developer
<br>
👨‍🎓 Técnico Superior en Desarrollo Web y aplicaciones. También me encuentro realizando la Tecnicatura en Software Libre en la UNL.
<br>
📫 Conectemos en Linkedin: https://www.linkedin.com/in/fkrenn/
