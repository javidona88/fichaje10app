# El Camino — Fichaje 10

Juego de modo carrera de fútbol en un solo archivo HTML (`index.html`). Sin dependencias, sin
build. Se puede abrir directamente en cualquier navegador, y desplegar como web / app instalable
(PWA) en GitHub Pages.

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

## Probar en local (sin subir nada)

Abre `index.html` con doble clic. Funciona, aunque el service worker solo se activa sobre
`https://` o `localhost`, así que como archivo suelto no queda "instalado".

---

## Publicarlo en GitHub Pages (para jugar desde el móvil)

### Aviso previo: público vs privado
GitHub Pages con **cuenta gratuita solo funciona en repositorios públicos**. El código de un
juego no tiene secretos, así que lo normal aquí es hacerlo **público**.
Si lo quieres privado sin pagar, usa **Cloudflare Pages** o **Netlify** en lugar de GitHub
Pages (los dos despliegan repos privados gratis conectándose a tu GitHub; el resto de pasos de
git son iguales).

### Paso 1 — Crear el repositorio en GitHub
1. Entra en <https://github.com/new> (crea cuenta antes si no tienes).
2. **Repository name**: `el-camino` (o el que quieras).
3. **Public**.
4. **NO** marques "Add a README", "Add .gitignore" ni licencia (este repo ya los trae).
5. *Create repository*. Te quedará una página con una URL tipo
   `https://github.com/TU-USUARIO/el-camino.git`. Cópiala.

### Paso 2 — Subir el proyecto desde el PC
Abre una terminal **en esta carpeta** (`C:\Users\Javi\Desktop\Claude`) y ejecuta, cambiando la
URL por la tuya:

```bash
git remote add origin https://github.com/TU-USUARIO/el-camino.git
git push -u origin main
```

La primera vez, Git te pedirá iniciar sesión en GitHub:
- En Windows suele abrirse una ventana del navegador para autorizar. Acepta y listo.
- Si te pide usuario y contraseña en la terminal: la "contraseña" ya **no** es la de tu cuenta,
  necesitas un *Personal Access Token* (GitHub → Settings → Developer settings → Personal
  access tokens → Tokens (classic) → Generate new token, con permiso `repo`). Pega ese token
  como contraseña. Lo más cómodo es instalar **GitHub CLI** (<https://cli.github.com>) y hacer
  `gh auth login` una vez; a partir de ahí el `git push` funciona sin más.

### Paso 3 — Activar GitHub Pages
1. En el repo, ve a **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions**.
3. Ya está. No hay que elegir carpeta ni rama: el workflow incluido se encarga.

### Paso 4 — Esperar el primer despliegue
1. Pestaña **Actions** del repo → verás el workflow *"Desplegar en GitHub Pages"* ejecutándose
   (1–2 minutos).
2. Cuando termine (marca verde), vuelve a **Settings → Pages**: arriba aparecerá la URL
   pública, del tipo:
   `https://TU-USUARIO.github.io/el-camino/`

### Paso 5 — Abrirlo e instalarlo en el móvil
1. Abre esa URL en el navegador del móvil.
2. Menú del navegador → **"Añadir a pantalla de inicio"** / "Instalar app".
3. Se abrirá a pantalla completa y funcionará sin conexión una vez cargado.

---

## Editar el juego más adelante

**Cambios pequeños, desde el móvil (sin PC):**
GitHub web → abre `index.html` → icono del lápiz (**Edit**) → haz el cambio → **Commit changes**.
El workflow redepliega solo en ~1 minuto.

**Cambios grandes:**
Desde el PC (`git pull` → editar → `git commit` → `git push`), o pidiéndoselo a Claude apuntando
a este repositorio.

**Tras publicar un cambio**, en el móvil abre la web **con conexión** y recárgala una vez: el
service worker está configurado para traer siempre la última versión del `index.html` cuando hay
red. Si algún dispositivo se queda "pegado" a una versión vieja, sube el número de `CACHE` en
`sw.js` (`elcamino-v1` → `elcamino-v2`) y vuelve a publicar.
