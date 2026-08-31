# Fichaje 10

Juego de modo carrera de fútbol en un solo archivo HTML (`index.html`). Sin dependencias, sin
build. Se abre en cualquier navegador y está publicado como web / app instalable (PWA).

**En producción:** <https://javidona88.github.io/fichaje10app/>

## Contenido del repositorio

| Archivo | Para qué |
|---|---|
| `index.html` | El juego entero (HTML + CSS + JS). |
| `manifest.json` | Metadatos de PWA (nombre, colores, icono). |
| `sw.js` | Service worker: permite jugar sin conexión una vez cargado. |
| `icon.svg` | Icono de la app. |
| `CLAUDE.md` | Notas técnicas del proyecto (contexto de desarrollo). |
| `.github/workflows/deploy.yml` | Publica el sitio en GitHub Pages en cada `push` a `main`. |

> La carpeta `historial/` está en `.gitignore` **a propósito**: contiene el export de
> conversaciones y copias de seguridad, y no debe publicarse.

---

## Probar en local (sin publicar)

Abre `index.html` con doble clic. Funciona, aunque el service worker solo se activa sobre
`https://` o `localhost`, así que como archivo suelto no queda "instalado".

---

## Publicar cambios

El despliegue es automático: **cada `push` a la rama `main`** dispara el workflow
`.github/workflows/deploy.yml`, que republica el sitio en 1–2 minutos (pestaña **Actions** del
repo para ver el progreso).

**Cambios pequeños, desde el móvil (sin PC):**
GitHub web → abre `index.html` → icono del lápiz (**Edit**) → haz el cambio → **Commit changes**.
Se redepliega solo.

**Cambios grandes:**
Desde el PC (`git pull` → editar → `git commit` → `git push`), o pidiéndoselo a Claude apuntando
a este repositorio.

**Tras publicar**, en el móvil abre la web **con conexión** y recárgala una vez: el service
worker está configurado para traer siempre la última versión del `index.html` cuando hay red.

---

## Instalar en el móvil

1. Abre <https://javidona88.github.io/fichaje10app/> en el navegador del móvil.
2. Menú del navegador → **"Añadir a pantalla de inicio"** / "Instalar app".
3. Se abre a pantalla completa y funciona sin conexión una vez cargado.

---

## Versionado

- La versión visible del juego está en `VERSION_JUEGO` dentro de `index.html` (aparece en el pie:
  "Fichaje 10 · v1.0").
- Al publicar una tanda de cambios, sube ese número (`v1.0` → `v1.1` para mejoras/arreglos,
  `v2.0` para un cambio grande) y, **en el mismo commit**, cambia `CACHE` en `sw.js` al mismo
  número (`fichaje10-1.0` → `fichaje10-1.1`). Eso obliga a todos los dispositivos a refrescar.

---

## Si alguna vez hay que recrear el repositorio

1. Crea un repo **público** en <https://github.com/new> (Pages gratis solo funciona en repos
   públicos; para privado usa Cloudflare Pages o Netlify). No añadas README/.gitignore/licencia.
2. Desde esta carpeta:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/EL-REPO.git
   git push -u origin main
   ```
   Si Git pide credenciales: usa un *Personal Access Token* como contraseña, o instala
   [GitHub CLI](https://cli.github.com) y haz `gh auth login` una vez.
3. En el repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Pestaña **Actions**: espera a que el workflow termine en verde. La URL aparece en
   **Settings → Pages** (`https://TU-USUARIO.github.io/EL-REPO/`).
