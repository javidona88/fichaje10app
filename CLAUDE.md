# Fichaje 10 — Contexto del proyecto

Juego de modo carrera de fútbol en HTML/JS de un solo archivo (`index.html`, ~10.970 líneas),
inspirado en "El Ídolo" (potrerofutbol.ar). Interfaz en español (castellano de España). Todo
—HTML, CSS y JS— vive en un único archivo autocontenido, sin dependencias externas ni build step.
Pie de pantalla: "Fichaje 10 · v1.3.4" (`VERSION_JUEGO`). Al publicar cambios, subir
`VERSION_JUEGO` en `index.html` y, en el mismo commit, `CACHE` en `sw.js` al mismo número
(`fichaje10-1.3.3` → `fichaje10-1.3.4`) para forzar el refresco en dispositivos instalados.
Desplegado en GitHub Pages: `https://javidona88.github.io/fichaje10app/` (repo `javidona88/fichaje10app`,
workflow `.github/workflows/deploy.yml` en cada push a `main`).

## Historial de desarrollo

- Todo el desarrollo previo (temporadas 1-10 de trabajo) se hizo en el chat de claude.ai
  **"FICHAJE 10"** (1.068 mensajes, 11-ago → 30-ago 2026). Ese chat quedó pausado por longitud.
  El historial completo, legible, está guardado en `historial/FICHAJE10-historial.md`, y el export
  bruto de claude.ai en `historial/export-claude-2026-08-31.zip`. Copia de seguridad del
  `index.html` de ese momento: `historial/index-backup-20260831-1019.html`.
- Los bloques de herramientas del historial salen como "This block is not supported on your
  current device yet" — se ven los razonamientos y resúmenes, no los diffs concretos.

## Cómo trabajar en este proyecto

- Todo está en `index.html`. No hay bundler ni framework. El JS vive en un único `<script>`.
- **Este equipo (Windows / Claude Code) NO tiene `node` ni `python` reales en el PATH**
  (solo los stubs de Microsoft Store). Los scripts de verificación del historial asumían que sí
  (el entorno del chat web los tenía). Opciones aquí:
  - Extraer el `<script>` a un `.js` y validarlo con cualquier linter disponible; si se instala
    Node, `node --check` sobre el script extraído es lo más rápido.
  - Comprobación de sintaxis "a ojo" + revisión cuidadosa del diff. Para lógica, el patrón de
    siempre: extraer el `<script>`, stubear `window`/`document`/`AudioContext` con objetos
    mínimos (`el()` devuelve objetos con `appendChild`/`classList`/`style`/`innerHTML`),
    `eval()` el script y aserciones con `console.log`. Mantener este patrón si se recupera Node.
- Sin tests automatizados formales.
- **Persistencia**: durante FICHAJE 10 hubo varios episodios de "arreglos que no llegaron a
  guardarse en el archivo" (el entorno de Artifact revertía cambios). Al terminar cualquier
  edición, releer la zona editada del archivo YA GUARDADO para confirmar que persiste.

## Modelo de datos del jugador (`j`)

`nuevoJugador(nombre,pais,extra,clubInicial,localidad)` construye `j`. Estado global: `S`
(pantalla actual, jugador, temporada, y decenas de flags temporales `S.xxx` / `S._xxx`).
Guardado multi-slot en `localStorage` (`fichaje10Guardado_v1_slotN`, N=1..3; `claveSlot(n)`);
`migrarJugadorGuardado(j)` rellena campos nuevos en partidas viejas — **añadir aquí toda clave
nueva del modelo**.

```
j = {
  nombre, pais, posicion:"Delantero" (POSICION_FIJA), edad (empieza a 16), localidad,
  club:{ nombre, categoria, colores:[hex1,hex2], extranjero?, pais?, liga?, grande?,
         nivelEuropeo?('champions'|'europa'|'conference'), ambicionNivel(1-4), objetivoActual? },
  contrato:{ sueldoAnual, duracionTemporadas, duracionOriginal },  // duracionOriginal = años al firmar; el tab Club muestra "X de Y años"
  stats:{ forma, confianza, reputacion, salud, dinero, popularidad, valorMercado,
          felicidadPareja, vestuario },
  atributos:{ fisico, velocidad, tiro, regate, pase, desmarque },   // 1-20, visibles (6 ahora)
  atributosProgreso:{ ...igual, decimales ocultos },
  mentalidad, mentalidadProgreso,                          // atributo permanente 1-20 (base 1)
  estadoMental:'normal'|'racha'|'crisis', rachaResultados (-5..5),
  rachaGafada (bool),                                      // ex-malDeOjo; malDeOjo solo en migración
  patrocinio:{ marca, cantidadAnual } | null,
  promesasActivas:[], promesasIncumplidas,                 // sistema de promesas de negociación
  representante:{ comision(0.03/0.06/0.10), nombre(agencia), agente:{nombre,apodo,genero,relacion} } | null,
  suscripciones:{ familia: nivel },                        // servicios contratados (TIENDA_SERVICIOS)
  prioridadesEntreno:[], historialCompras:[], clubesEnfriados:{},
  objetos:{ inspiracion, avalNegociacion, segundaOportunidad, vestuario, confianzaCiega },
  comprasUnicas:[], cocheActual (idx TIENDA_COCHES),
  carinoAficion(0-100), maxCarinoAlcanzado, temporadasEnClub, enFilial,
  lesionSemanas,
  historial:[], eventosVistos:[{id,temporada}],
  historialTemporadas:[{ ..., goles, asistencias, notaMedia, trofeosIndividuales, ... }],
  trayectoria:[{ club, categoria, pais, extranjero, colores, temporadaInicio, temporadaFin,
                 partidos, goles, asistencias, carino, titulos:[{nombre,temporada}] }],
  carrera:{ partidos, goles, asistencias, ascensos, titulos, dineroGanado, valorMercadoMaximo },
  titulosSeleccion:[{nombre,temporada}], tuvoPrimeraConvocatoriaAbsoluta, tuvoPrimeraConvocatoriaSub21,
  legadosVistos:[temporadas],                              // hitos de legado ya mostrados

  // ---- SUBTRAMAS (personajes recurrentes) ----
  companeros:[{ id, nombre, apodo, temporadasJuntos, relacion(0-100), juntosActualmente }],
                                                           // COMPANEROS_CANTERA_BASE: Kike, Marcos, Nico
  rival:{ nombre, apodo, relacion(-100..100), nivel(1-4), club, categoria, colores, titulos,
          balonesDeOro, trayectoriaIniciada, ultimoCruce }, // RIVAL_CANTERA_BASE: Adrián
  mentor:{ nombre, apodo, genero, relacion, nivel, club, activo } | null,   // club = punto 7
  protegido:{ nombre, apodo, relacion(-100..100), nivel(1-4) } | null,
  periodista:{ nombre, apodo } | null,
  hermano:{ nombre, apodo, genero } | null,
  padreMadre:{ nombre, apodo, genero } | null,
  pareja:{ nombre, apodo } | null,   tienePareja (bool; siempre en sincronía con `pareja` —
    `migrarJugadorGuardado` reconcilia `tienePareja && !pareja` generando pareja),
  hijo:{ nombre, genero } | null,
  amigoNoFutbol:{ nombre, apodo, profesion, genero } | null,
  fichajeVeranoGarantizado?, clubesEnfriados?
}
```

## Sistemas clave

### Dados (estilo Disco Elysium)
`1d20 + round(atributo/3)` vs `dificultadBase`. Funciones: `tirar(j, tirada, bonoExtra, ventaja)`
(resolución real) y `probabilidadExito(j, tirada, bonoExtra)` (el % que se muestra ANTES de
elegir). **Las dos tienen que aplicar exactamente los mismos modificadores** — se han
desincronizado varias veces (racha gafada, crisis) y el jugador veía un % más optimista del real.
- **1 natural = FALLO automático, 20 natural = ÉXITO automático**, pase lo que pase con bono y
  dificultad (`exito = dado===1 ? false : (dado===20 ? true : total>=dificultad)`). Aplicado
  también en `probabilidadExito`, en la pantalla de lesión y en `SCREENS.resultado`.
  **Durante la tirada (`SCREENS.tirando`) NO se adelanta el 1/20 automático** — el caption es
  siempre "1d20 + N de <atributo>" y la suma siempre "dado + bono = total" (p. ej. "20 + 4 =
  24"); el resultado auto solo se revela al final con ÉXITO/FALLO. `SCREENS.resultado` (pantalla
  de consecuencia, ya con el resultado a la vista) sí explicita "20 natural — éxito automático"
  en `.outcome-roll`.
- `ventaja:true` → tira 2 dados y se queda con el mejor (objeto "Segunda Oportunidad").
- El % de `probabilidadExito` siempre es múltiplo de 5 (probabilidad exacta de un d20). Verificado
  con Monte Carlo que coincide con `tirar()` en todos los estados (crisis / racha gafada / salud
  / forma). `etiquetaProbabilidad(pct)` mapea a 9 niveles deliberadamente conservadores:
  Imposible (0) · Casi imposible (≤10) · Muy difícil (≤25) · Difícil (≤40) · Incierto (≤55) ·
  Favorable (≤70) · Probable (≤85) · Muy probable (≤95) · Seguro (100).
- Modificadores de dificultad (`calcModBono`): salud<50 (+2), forma<40 (+1), confianza<35 en
  tiradas de mentalidad (-2 al bono).
- **Racha gafada** (`j.rachaGafada`, ex-malDeOjo): sacar un 1 natural la activa; la SIGUIENTE
  tirada sale con -3 al bono; se consume sola dentro de `tirar()`. Etiqueta "Racha gafada -3".
- **Estado mental** (`j.estadoMental` + `j.rachaResultados`): `actualizarRachaResultados` cuenta
  20 (+1) y 1 (-1) naturales. A -4 → 'crisis' (confianza -15, no se cura sola, solo con decisión
  activa `salirDeCrisis`); a +4 → 'racha' (se rompe al primer fallo). 'crisis' resta -2 al bono.
- Objetos: Golpe de Inspiración (+4 a una tirada), Segunda Oportunidad (ventaja), Aval de
  Negociación (éxito garantizado en una petición de negociación, sin tirar), Confianza Ciega
  (`usarConfianzaCiegaSiHay` — protege de efectos negativos en ciertos eventos).
- `SCREENS.tirando`: muestra "Necesitas un total de X o más" (la dificultad), luego el dado
  suelto, luego `dado + bono = total`, y al final ÉXITO/FALLO (~1.650ms visible).
- **Reparto de atributos**: reequilibrado para no abusar de Mentalidad. Usar el atributo que
  encaje con la acción real (tiro=rematar, pase=asistir, regate=jugadas de calle, velocidad=
  sprints, fisico=resistencia, desmarque=movilidad sin balón, mental=cabeza/sangre fría/
  negociación). Las finales dan a elegir Tiro (potencia) o Mentalidad (sangre fría).

### Progreso oculto de atributos
Los atributos NO suben con el número bruto del efecto: se divide por `DIVISOR_PROGRESO` (8) y se
acumula en `*Progreso` hasta cruzar un entero (`acumularProgresoAtributo`). Tienda y chips de
resultado NUNCA muestran el número crudo, solo una flecha. `CLAVES_STAT_INMEDIATA` /
`STATS_SIN_NUMERO_VISIBLE` deciden qué claves sí muestran cifra; `dinero` y `valorMercado`
llevan sufijo € vía `formatearDelta()`. `valorAtributo(j,clave)`: `'tecnica'` = media de
tiro/regate/pase, `'mental'` = `j.mentalidad`.

### Estados apilados (Forma / Confianza / Salud / Reputación / Popularidad / Rol / Cariño)
Mismo diseño de tarjeta apilada (`estadoItem()` dentro de `cromo()`).
- **Salud**: persistente. `estadoSalud()`. Si hay lesión, el texto incluye las semanas:
  "Lesionado (4 sem.)" — sin badge aparte.
- **Forma / Confianza**: decaen ~12% hacia 55 cada paso de temporada (`decaerForma`, decae las
  dos). Confianza ±3 con cada tirada. `estadoForma()`, `estadoConfianza()`.
- **Reputación / Popularidad / Rol / Cariño**: `estadoReputacion()`, `estadoPopularidad()`
  ("Ídolo"/"Superestrella" en el tramo alto — se renombró desde "Ídolo local"/"Estrella"),
  `S.rolTemporada.corto/clase`, `estadoCarino()` (+ barra segmentada de 10 bloques `.carino-seg`).
  Objetivo de temporada como caja, texto corto vía `ABREVIATURA_OBJETIVO`.
- Mentalidad va en ATRIBUTOS DE JUGADOR, no en ESTADO (es entrenable y permanente).

### Lesiones y recuperación
- Solo cuentan como baja golpes de salud <= -20. `semanas = min(10, max(1, round(abs(v)/7 *
  variacion)))`, `variacion = 0.7 + random()*0.7`.
- **Aviso de lesión** (`SCREENS.lesionReveal`, "Parte médico"): `generarLesion(j)` devuelve
  `{ventanas, semanas, gravedad, dado...}`; si `ventanas >= 2` se guarda en
  `S.pendienteLesionReveal` (si `ventanas === 1`, solo `mostrarNotificacion`). El check que
  redirige a la pantalla está al final de `avanzarPaso` (`if(S.pendienteLesionReveal){ S.screen
  = 'lesionReveal' }`). **NO borrar `S.pendienteLesionReveal` al principio de `avanzarPaso`** —
  lo puso un evento (`efectosFn`) y tiene que sobrevivir; se limpia solo en `SCREENS.lesionReveal`
  al pulsar "Entendido". (Bug corregido: las lesiones venidas de eventos no avisaban.)
- Con `lesionSemanas > 0`: `avanzarPaso` redirige a `SCREENS.recuperacion`; eventos con
  `soloSiSano:true` se filtran; hay eventos `soloSiLesionado:true` (`aburrimiento_lesion`,
  `duda_tras_lesion`) y variantes de relleno propias (`EVENTO_RELLENO_VARIANTES_LESIONADO`).
- **Lesiones "sin tirada"**: algunos sucesos causan una baja fija que no sale de un `1d20`
  (infección tras injerto capilar en `perdida_pelo`, golpe en la cabeza en
  `despedida_soltero_banana`). El `efectosFn` monta a mano `S.pendienteLesionReveal =
  {gravedad, origen, semanas, ventanas, sinTirada:true}` y fija `j.lesionSemanas` /
  `S.temporadaSemanasLesion`. `SCREENS.lesionReveal` con `r.sinTirada` oculta la caja de
  "1d20 + físico" y cambia el texto de cierre ("Los servicios médicos del club lo confirman…").
- Servicios de "actividad física" (`prepFisico`, `entrenTecnico`) se pausan durante la lesión;
  fisio/nutrición/etc. siguen. Si te lesionas en verano: `SCREENS.veranoLesionado` y te pierdes
  el torneo de selección (`S.torneoPerdidoPorLesion`).

### Banco de eventos (`BANCO_EVENTOS`)
Cada evento: `id, cooldown|unico, evitarTrasTitulo?, soloSiSano?, soloSiLesionado?,
trigger:{edadMin, edadMax, probabilidad(num|fn), condicion}`, `texto` (string o `j=>string`),
`opciones[]`.
- Opción con tirada: `{texto, tirada:{atributo,dificultadBase}, exito:{...}, fallo:{...}}`.
  Las ramas pueden llevar `efectosFn` (calculado al momento) además de `efectos` estático,
  y `costeEstimado`/`costeFn` para mostrar el gasto antes de elegir.
- Opción sin tirada: `{texto, resultado, efectos|efectosFn, patrocinioFn?, parejaInicio?,
  parejaFin?, fichaje?/fichajeExtranjero?/fichajeGrande?/fichajeUltimaEtapa?, diferirVerano?}`.
- `evitarTrasTitulo:true`: no puede salir justo tras ganar un título (`S.ultimoEventoFueTitulo`,
  se consume al principio de `elegirEvento`). Marcado en `entrenador_nuevo`,
  `critica_prensa_dura`, `mala_racha_publica`.
- Condiciones muy a menudo comprueban `S.pasoIndex` (0-5 dentro de `SECUENCIA_TEMPORADA`, que
  son 6 pasos "evento"). Playoff y ciertos eventos exigen `S.pasoIndex === 4` (penúltimo).
- Al añadir un evento: preguntarse siempre si tiene sentido dado club / categoría / rol / edad /
  lesión / si es extranjero / si ya tiene pareja, etc. (fuente recurrente de bugs).

### Subtramas / personajes recurrentes
Sistema añadido en FICHAJE 10. Personajes en `j` (ver modelo). Puntos clave:
- **Descubrimiento**: un evento único presenta al personaje. El candidato pendiente se guarda en
  `S._mentorCandidato` / `S._protegidoCandidato` / `S._periodistaCandidata` / `S._hermanoCandidato`
  / `S._padreMadreCandidato` / `S._amigoNoFutbolCandidato` mientras se resuelve.
- **Generadores** (`generarNombreProtegido`, `generarHermano(j)`, `generarPadreMadre(j)`,
  `generarAmigoNoFutbol`, `generarNombrePereja`, `generarNombreHijo`, `generarNombrePeriodista`,
  `generarNombreAgente`): los que pueden ser de cualquier género devuelven `{nombre, apodo,
  genero:'m'|'f'}`. **Usar `genero` para todo texto con concordancia** ("Tu hijo/hija",
  "el/la hermano/a de...") — bug de género corregido varias veces.
- **Etiqueta de relación**: al nombrar a un personaje en un texto, anteponer siempre la relación
  ("Tu amiga Lucía", "Tu hermano Diego", "Tu agente, Lidia,", "Tu compañero Kike") — nunca el
  nombre a secas, porque son muchos personajes. Ya revisado en ~26 sitios; al añadir eventos
  nuevos, mantenerlo.
- **`j.mentor.club`**: el mentor guarda en qué club estaba al empezar a apadrinarte; los eventos
  de seguimiento exigen `j.mentor.club === j.club.nombre` (si cambias de club, ya no aparece).
- **Rival (Adrián)**: en el prólogo (`SCREENS.origenRival`) queda con `trayectoriaIniciada` pero
  SIN club ("la llamada que no le llegó a él"). `evolucionarRival(j)` (llamado al pasar de
  temporada): si el rival no tiene club aún, la temporada siguiente le asigna uno **garantizado**
  en Tercera RFEF (no filial, distinto de tu club y de los de tus compañeros) y ese año solo hace
  eso; a partir de ahí sube/baja `nivel`, gana títulos/Balones de Oro y cambia de club según
  nivel (`CATEGORIA_POR_NIVEL_RIVAL`). `tierRelacionRival(relacion)` → `'reconciliacion'` (>=40)
  / `'toxica'` (<=-30) / `'sana'`. Todos los eventos de rival guardan contra `j.rival.club` null.
- **Rivalidad de vestuario** (`j.rival.compartiendoVestuario` / `temporadasCompartiendo` /
  `yaCompartioVestuario`): el evento único `adrian_ficha_tu_club` (edadMax 21, tu categoría <=
  Primera RFEF, rival a ±1 categoría) mete a Adrián en TU club — 3 vías (acogerle / marcar
  territorio con tirada de mentalidad / dejar que hable el campo con tirada de tiro). Mientras
  comparte vestuario: `calcularRolTemporada` resta 0.14 a `chance` (≈ un escalón de rol),
  `evolucionarRival` no lo cambia de club, y `iniciarTemporadaJuego` NO dispara
  `SCREENS.reencuentroAdrian`. `procesarFinTemporada` incrementa `temporadasCompartiendo`; a
  partir de 2, el evento único `adrian_uno_de_los_dos_sobra` lo resuelve (2 vías) y
  `despedirRivalDeTuClub(j)` lo recoloca según su nivel. `resumenSubtramas` menciona el arco si
  ocurrió.
- **Protegido**: `evolucionarProtegido(j)` sube `nivel` (~40%/temporada). Origen en
  `SCREENS.origenCompaneros`.
- **Compañeros de cantera** (`COMPANEROS_CANTERA_BASE`: Kike/Marcos/Nico, con `rasgo`,
  `titulo` (subtítulo corto) y `desc`): array `j.companeros`, cada uno con `relacion` y
  `juntosActualmente`. `SCREENS.reencuentroCompaneros` cuando coincidís de nuevo.
- **Creación — `SCREENS.personalizarGrupo`** ("La gente con la que creciste"): pone nombre a los
  3 compañeros + el rival. Cada uno se muestra con su `titulo` (rótulo dorado, Space Grotesk)
  sobre la `desc`. El del rival vive en `RIVAL_CANTERA_BASE.titulo`.
- **`refrescarApodosCompaneros(j)`**: recalcula `cmp.apodo` desde `cmp.nombre` (primer token);
  si dos compañeros comparten nombre de pila, les añade el primer apellido ("Dani Roldán" /
  "Dani Ibáñez") para poder distinguirlos en los textos. Idempotente. Se llama al confirmar
  `personalizarGrupo` y en `migrarJugadorGuardado` (arregla saves viejos con colisión). Si un
  compañero no tiene apellido, se queda el nombre de pila a secas.
- **`SCREENS.origenCompaneros`** ("El resto de la pandilla"): reparte a los compañeros (32% se
  quedan en tu club, resto a clubes aleatorios de Tercera RFEF, en `SCREENS.elegirClub`, con
  `nivel:1` / `categoria:'Tercera RFEF'` / `retirado:false`) y lo narra. El texto de "fichan
  fuera" **agrupa por club** (`unirNombres`) para no repetir el mismo club, y adapta el cierre
  si los que se van acaban todos juntos.
- **`evolucionarCompaneros(j)`** (en `procesarFinTemporada`, junto a `evolucionarRival`):
  progresión modesta de Kike/Marcos/Nico. Cada uno tiene un `techo` de categoría
  (`COMPANEROS_CANTERA_BASE`: Kike=Segunda RFEF, Marcos=Primera RFEF, Nico=LaLiga2 — **ninguno
  llega a LaLiga**, tope duro `LaLiga2`). Cada temporada: 20% de subir categoría (hasta su
  techo), ~8% de bajar, algo de cambio de club sin cambiar de división; desde los 34 se retiran
  (`cmp.retirado`). No se tocan si comparten club contigo. `cmp.nivel` = idxCategoría+1 (1=3ª
  RFEF … 4=LaLiga2). Los eventos de Kike/Marcos/Nico exigen `!c.retirado`. `marcos_capitan`:
  `edadMin:24` + `S.temporada >= 6` + `c.nivel >= 3` (Primera RFEF+).

### Rueda de prensa
`SCREENS.ruedaPrensa` al fichar por cualquier club. `PREGUNTAS_RUEDA_PRENSA`: array de huecos,
3 variantes por hueco; en la pregunta 1 (`idx===0`) se elige variante aleatoria por hueco y se
guarda en `S.ruedaPrensaSeleccion`. Se responden las 2 seguidas y el resultado combinado sale al
final (`S.ruedaPrensaRespuestas`). Protección anti-doble-clic (`respondiendo` local por render)
porque `render()` tarda 260ms en limpiar el DOM. Si vuelves a un club donde ya jugaste, antes de
la rueda de prensa va `SCREENS.regresoClub` (ver abajo).

### Regreso a un club anterior — `SCREENS.regresoClub`
Al fichar por un club que ya está en `j.trayectoria`, pantalla "Vuelves a casa" con el resumen
real de tus etapas previas ahí (partidos, goles, asistencias, títulos, sumando todas). Flags:
`S.esRegresoClub`, `S.regresoClubDatos`. Va justo antes de la rueda de prensa; fichaje a club
nuevo va directo a la rueda de prensa como siempre. En `PANTALLAS_SIN_TABBAR`.

### Negociación de contrato — `SCREENS.negociacionFichaje`
Mismo minijuego para fichajes nuevos y renovaciones (`neg.esRenovacion`). Hasta 3 intentos de
pedir más dinero/años, con "ánimo" del club (contento→neutral→molesto→enfadado). Fallar penaliza
de verdad (sueldo ~-8% o -1 año). 20 natural → Aval de Negociación. Romper la negociación (o
rechazar renovar) → contrato de emergencia de 1 año al 70% del sueldo de mercado, **notificado
en pantalla**. `aplicarPromesasNegociacion(j, neg)` añade promesas del club.
- **Suelo mínimo en renovaciones**: la oferta nunca cae por debajo del sueldo actual, SALVO
  rendimiento reciente flojo (nota media < 5,5), donde se permite hasta -15%.
- **Última propuesta**: al agotar `neg.maxTurnos` (6) NO se fuerza el fracaso — se pone
  `neg.sinMasPropuestas` y el club deja su última oferta sobre la mesa; solo quedan
  Aceptar / Levantarte. El club sí rompe si `neg.medidor <= 12`. Aplica a fichaje/renovación
  y a `SCREENS.negociacionPatrocinio`.

### Agente libre — temporada sin club (`SCREENS.temporadaSinClub`)
Desde `SCREENS.renovacion` (el club no renueva, o eliges no renovar) hay un botón para
**quedarte sin equipo**. `entrarEnParo(j)` cierra la etapa actual de `j.trayectoria`
(`temporadaFin = S.temporada-1`, `cerrada:true` — `abrirNuevaEtapa` respeta ese flag y no la
pisa), pone `j.club` a un centinela `{nombre:'Sin equipo', sinEquipo:true, categoria:'Sin
equipo', ...}`, `j.contrato = {0,0}`, `j.enParo = true`, `S.paroFase='intro'`.
`SCREENS.temporadaSinClub` tiene 2 fases (`S.paroFase` 'intro' → 'resultado'):
`pasarTemporadaSinEquipo(j)` aplica el año en blanco (forma→~42, confianza -8, reputación
-6..14, popularidad -3..9, **valorMercado ×0.6**, sin sueldo pero `costeVidaAnual` corre,
`comprobarNumerosRojos`), añade la temporada a `j.temporadasSinEquipo[]`, avanza edad/temporada,
y genera `generarOfertasSinClub(j)` (reutiliza `generarOfertas` con contexto de categoría según
reputación —suelo 2ª RFEF—, degrada sueldos ×0.8, quita prestigio 4, extranjero y filiales,
máx 3; si vacío, oferta de reserva). Luego → `SCREENS.ofertas`, donde el botón "Seguir en X"
pasa a **"Seguir otro año sin equipo"** si `j.club.sinEquipo`. Firmar (`iniciarFichaje`, que
pone `j.enParo=false`) cierra el arco. En `SCREENS.retiro`, "seguir" con `sinEquipo` vuelve a
`temporadaSinClub` (no a `renovacion`). El resumen de fin de carrera (`SCREENS.final` y
`generarImagenResumenCarrera`) muestra una línea "Temporadas sin equipo: …" sin contar como
club. `migrarJugadorGuardado` rellena `j.temporadasSinEquipo=[]` y `j.enParo=false`.

### Patrocinios — `SCREENS.negociacionPatrocinio` + sistema de promesas
Minijuego propio de negociación con la marca. `aplicarPromesasPatrocinio(j, neg)` crea promesas
en `j.promesasActivas`; `evaluarPromesas(j)` las comprueba en fin de temporada (tipos: `campeon`,
`titular`, `prima_popularidad`, ...). Resultado en `S.resultadoPromesas` / `S.resultadoPromesas`.
- **Prima de popularidad**: apunta al SIGUIENTE nivel de popularidad por encima del actual en el
  momento de firmar (guardado en `promesa.umbralPopularidad`), y se muestra como **texto**
  (nombre del nivel: "Ídolo", "Superestrella"...), nunca un número fijo.
- **Duración**: ya no siempre 1 año — varía 1-3 según reputación y popularidad.
- El evento que ofrece patrocinio tiene `cooldown:1` (antes 5) y funciona también en el
  extranjero: en cuanto expira un patrocinio, la temporada siguiente ya puede haber otra oferta.

### Objetivos de temporada
`OBJETIVOS_DATA[categoria]` (3 niveles) + `OBJETIVOS_GRANDE` (4 niveles, para los clubes que
pasan `esClubGrande(nombre)`; techo en liga+continental, los LaLiga normales llegan a "pelear
por Europa"). Los textos de `OBJETIVOS_GRANDE` (niveles 4/3/2) son funciones `j => string` que
mencionan la competición continental vía `competicionContinentalDeClub(j)` (usa
`j.club.nivelEuropeo` si está, si no deduce por país; por defecto Champions League).
`elegirObjetivo` resuelve el `texto` función a string antes de devolver `{texto, tipo}`.
`SCREENS.ofertas` ordena las ofertas por prestigio del club desc y, a igualdad, por sueldo ×
duración desc; las de `PRESTIGIO_CLUB` 4 llevan la clase `.oferta-card.elite` (borde dorado).
`j.club.ambicionNivel` (1-4) elige (`elegirObjetivo`) y sube/baja según se cumpliera el anterior
(`evaluarObjetivo` dentro de `calcularResumenTemporada`). Se resetea en cualquier cambio de club
(`ambicionInicial(nombreClub)`). Declinar ofertas y quedarte sube el cariño +5 (solo si de
verdad rechazaste ofertas). `ABREVIATURA_OBJETIVO` da la versión corta.

### Ascensos y playoffs — formato real español
- Ascenso automático: 1 equipo en Segunda RFEF y Primera RFEF (1º de grupo); 2 en LaLiga2
  (`umbralAscensoDirecto` en `calcularResumenTemporada`).
- `ultimo_partido_playoff` / `SCREENS.playoffFinalIntro` → `playoffFinal` → `playoffFinalReveal`:
  exige `S.pasoIndex === 4` y estar en zona de playoff real (2º-5º RFEF, 3º-6º LaLiga2).
- `SCREENS.mejoraContratoAscenso` tras subir de categoría.

### Torneos y selección nacional
`TORNEOS_CONFIG`: entradas `tipo:'copa'|'europa'|'seleccion'|'seleccion_sub21'`, cada una con
`condicion`, `probabilidad` (num o `j=>num`), `efectosVictoria`, `edadMax?`.
- **Club**: copas nacionales y europeas (`j.club.nivelEuropeo`). Semifinal → final.
- **Selección**: `torneoDeVerano(S.temporada)` decide qué torneo de verano toca.
  `seleccion_absoluta` exige LaLiga + (trofeo individual la temporada anterior O reputación >=55);
  `seleccion_sub21` exige edad <=21, reputación 25-40, categoría >= Primera RFEF.
  `TITULOS_SELECCION_NOMBRES = ['Eurocopa','Mundial','Eurocopa Sub-21','Mundial Sub-21']`.
  Ganar añade a `j.titulosSeleccion`. `SCREENS.primeraConvocatoria` la primera vez
  (`j.tuvoPrimeraConvocatoriaAbsoluta` / `...Sub21`).
- Pantallas: `torneoSemifinal` → `torneoFinalIntro` → `torneoFinal` → `torneoFinalReveal`
  (y `torneoEliminado` / `playoffEliminado` si caes).
- **Estadísticas de selección**: `acumularEstadisticasSeleccion(j, cfg, nombreCompeticion)` se
  llama en `iniciarTorneoEliminatorio` para cada torneo de selección (absoluta o Sub-21). Asume
  el recorrido completo del torneo (5-7 PJ) y estima goles/asistencias por atributos. Acumula en
  `j.carrera.partidosSeleccion/golesSeleccion/asistenciasSeleccion` y añade una fila a
  `j.historialSeleccion:[{temporada,torneo,sub21,partidos,goles,asistencias}]`. Se muestran en
  la sección SELECCIÓN de `SCREENS.tabEstadisticas` (filas por torneo + "Total selección", igual
  que CLUBES), en la fila de selección de `SCREENS.final` y en `generarImagenResumenCarrera`.
  `migrarJugadorGuardado` rellena los campos nuevos.
- **Semifinales a doble vuelta**: los textos NO deben decir "campo neutral" / "todo un partido"
  (`TEXTOS_SEMIFINAL_CLUB`, `TEXTOS_SEMIFINAL_SELECCION`), y hay protección para no repetir la
  misma variante dos veces seguidas (cuidado con el fallo de `0` "falsy" en JS al hacerlo).
- **Ventaja del 20 natural en semifinal**: `S.ventajaFinalNatural20` → mención especial + **+3
  real** en la tirada de la final, tanto en `SCREENS.torneoFinal` como en `SCREENS.playoffFinal`.

### Legado de carrera — `SCREENS.legadoCarrera`
Hito cada 5 temporadas (`S.temporada % 5 === 0 && !j.legadosVistos.includes(S.temporada)`),
antes cada 10. Texto de intro adaptado al hito concreto (`TEXTOS_LEGADO_HITO[5|10|15|...]`,
fallback genérico usando `j.localidad`). Menciona subtramas (rival, compañeros, mentor,
protegido, pareja, hijo...). `TEXTOS_RIVAL_LEGADO` por tier de relación con el rival.
En `PANTALLAS_SIN_TABBAR`.

### Fin de carrera — `SCREENS.retiro` / `SCREENS.final`
`retiro` = decisión de seguir o colgar las botas (forzosa a los 42). `final` = resumen, con:
- Tarjeta `.press`: titular (`capitalizarNombre`) + párrafo de retiro + mejor temporada +
  sección **"La carrera en números"** rediseñada: una fila destacada `.press-stats-hero`
  (Goles · Partidos · Asistencias, tiles grandes con fondo dorado) y 4 subsecciones
  `.press-stat-group` con rótulo `.grp-tit` + `iconoInline` (En el campo=tiro, Palmarés=trofeo,
  Distinciones=estrella, Recorrido=calendario), cada una con 3 `.press-stat` en
  `.press-stat-grid`. Ítems marcados como "logro" (`esLogro`) van en dorado (`.press-stat.gold`)
  si el valor es >0 y atenuados (`.press-stat.dim`) si es 0. Después: debut con la selección,
  badge de leyenda/querido, botón "Descargar resumen como imagen"
  (`generarImagenResumenCarrera`). La vieja rejilla plana `.press-stats` (13 cuadrados iguales)
  quedó sustituida.
- Tarjeta "Trayectoria profesional": una fila por etapa de `j.trayectoria` (escudo, meta,
  stats, chips de títulos) + fila de la selección + `.resumen-total`.
- Tarjeta **"El legado personal"** (eyebrow "Más allá del fútbol"): `resumenSubtramas(j)`
  devuelve una línea de cierre por cada subtrama viva (rival con comparativa de palmarés/Balones
  de Oro y tono según `tierRelacionRival`; mentor/protegido/pareja/hijo/hermano/padreMadre/
  periodista/amigoNoFutbol/compañeros de cantera), con concordancia de género. Se renderiza como
  lista `.legado-personal` / `.legado-item` (`.legado-tit` dorado + `.legado-txt`) y un
  `.legado-cierre` en cursiva. `unirNombres(arr)` une apodos con comas y "y". Si no hay ninguna
  subtrama (save viejo sin `j.companeros`), muestra un párrafo alternativo.

### Economía — escala real (€)
- `calcularSueldoOferta(j, categoria|"Extranjero"|"Grande", nombreClub, multLiga?)` pondera
  rating, experiencia, edad, nota de la última temporada (peso fuerte), reputación, prestigio
  del club y un `azar` 0.92-1.08. `calcularDuracionContrato(j)` 1-5 años.
  `SUELDO_BASE_POR_CATEGORIA`, `MULTIPLICADOR_SUELDO_LIGA`, `PRESTIGIO_CLUB`.
- El "gran contrato de fin de carrera" (`fichajeUltimaEtapa`, países de `PAISES_ULTIMA_ETAPA`)
  multiplica el sueldo x2,2.
- **Coste de vida**: `nivelDeVida(sueldoAnual)` → precario / ajustado / cómodo / alto / élite,
  cada uno con `costeAnual`. `costeVidaAnual(j)`, `pagarNomina(j)` descuenta sueldo neto -
  comisión representante - servicios - coste de vida cada paso.
- Valor de mercado por temporada: `(goles*15000 + asistencias*6000) * (1 + idxCategoria*2)`.
  Bonos de eventos y servicios "porcentaje" escalan sobre el valor actual (nunca cifra fija).
- **Números rojos**: `comprobarNumerosRojos(j)` cancela automáticamente TODAS las suscripciones
  si `dinero < 0`; se muestra en `SCREENS.numerosRojosReveal`.
- **`puedePagarServicio(j, familia, nivel)`**: permite el cambio si el balance neto de la
  temporada con el cambio queda ≥ 0 **o** si `j.stats.dinero` (ahorros) cubre ese déficit anual
  — el dinero acumulado funciona como colchón. En números rojos (`dinero < 0`) los servicios
  `esPorcentaje` sí se bloquean.

### Tienda / servicios / gastos personales
`TIENDA_SERVICIOS`: 12 familias en 4 categorías (Rendimiento y Cuidado Físico, Desarrollo
Técnico y Análisis, Salud Mental y Bienestar, Gestión y Entorno Profesional). Cada familia tiene
`niveles:[{nivel, costeAnual|comisionPct, efectoTemporada:{...}, desc, ...porReputacion(N)}]`.
`j.suscripciones[familia] = nivel`. Efectos pro-rateados por paso de temporada
(`aplicarEfectosServiciosPasivo`, multiplica por `DIVISOR_PROGRESO` si es atributo).
- Los nombres van sin rol redundante ("Fisioterapeuta", "Analista de rendimiento", "Psicólogo
  deportivo", "Community Manager"). En la cabecera de cada servicio, junto al nombre, va un
  `↑ <atributos>` fino y dorado (de `niveles[0].efectoTemporada`); los botones de nivel solo
  muestran "Nivel N" + coste, sin el atributo.
- `patrocinio`: la ficha del patrocinio (marca, cantidad/temp., años) vive en `SCREENS.tabJugador`
  (caja `PATROCINIO`), no en Economía; en Economía solo queda la línea "· Patrocinio" del desglose
  de ingresos.
- `representante` es `esPorcentaje:true` (comisión 3/6/10% del sueldo, no coste fijo). Crea
  `j.representante` vía `crearRepresentante` con `.agente` (nombre + genero + relacion).
  `AGENCIAS_REPRESENTACION` para el nombre de la agencia.
- `TIENDA_COCHES` (`j.cocheActual` = índice), vivienda y vacaciones. Coche/vivienda `unico:true`.
- Servicios repetibles pero no más de uno por temporada (`S.comprasEstaTemporada`, reset en
  `iniciarTemporadaJuego`). `SCREENS.gastos` se salta si no hay nada pagable.

### Casino — `SCREENS.casino` / `SCREENS.ruleta` / `SCREENS.tragaperras`
Dos minijuegos con dinero real de `j.stats.dinero`, ambos en `PANTALLAS_TAB`.
- **Ruleta**: `S.ruletaApuestaTipo/Numero/Cantidad`, `S.ruletaGirando`, `S.ruletaUltimoResultado`.
  Apuestas: TODO en secciones **plegables** tipo acordeón (`GRUPOS_COLAPSABLES`: basicas
  rojo/negro/verde/par/impar/nº exacto, mitad 1-18/19-36 x2, docenas x3, columnas x3 con
  `(numeroGanador-1)%3`). `S.ruletaGrupoAbierto` = grupo abierto (o null); por defecto se abre
  `basicas`, o el grupo de la apuesta activa la 1ª vez. La cabecera plegada muestra la opción
  elegida si hay una. `pintarRejillaApuestas(lista, idGrupo)`. Cantidades: 10 · 25 · 50 · 100 ·
  250 · 500 · 1K · 2,5K · 5K · 10K (filtradas por saldo). El cartel de resultado lleva fondo
  **verde** si ganas y **rojo** si pierdes. `colorNumeroRuleta`
  decide el color por número (fijo, como en una ruleta real); `ORDEN_RUEDA_EUROPEA` es el orden
  físico real de una ruleta europea (0,32,15,19,4,...) — el ángulo de parada usa la POSICIÓN del
  número ganador en ese array, no el número en sí. `svgRuedaRuleta()` dibuja el plato como SVG:
  37 sectores con línea divisoria + números impresos girados en radial (como en una rueda física).
  **Bola** (`#ruleta-bola-track`): capa independiente que gira en sentido contrario a la rueda;
  siempre completa vueltas enteras, así que vuelve exactamente a la posición del puntero (arriba)
  cuando termina su transición — coincide visualmente con el número ganador porque la rueda
  también gira hasta dejarlo bajo el puntero. Plato con aro de madera + brillo de cristal fijo +
  cubo central que toma el color del resultado.
- **Tragaperras**: estilo máquina clásica española. `TRAGA_SIMBOLOS` (🍒🍋🍊🔔⭐ con peso y
  pago de triple), `tiraSimboloTraga()` ponderado, `resultadoTraga([obj,obj,obj])` (triple = xN;
  dos 🍒 = x1). **Grid 3×3** (`S.tragaGrid` = 3 columnas de 3 símbolos), solo paga la **fila
  central** (línea de premio). Marcador tipo LED arriba (MENSAJE / PREMIO / SALDO), tabla de
  premios a la izquierda (€ = apuesta × multiplicador, resalta el combo ganador vía
  `S.tragaComboGanador`), fichas de apuesta redondas. Retorno de la línea ≈0,94 (casa ~6%).
  **Juego de riesgo** (`S.tragaFase='riesgo'`, `S.tragaBote`): tras premio, Cobrar o Arriesgar
  (50% doblar / 50% perderlo todo); tope a 4 dobles o 200.000 €. `cobrarBoteTraga(j)` acredita
  el bote. Celdas `#traga-c{col}-r{row}` (colDiv con `justify-content:center` para que la línea
  de premio en `top:50%` caiga justo en el centro de la fila central). Animación por columna con
  `setTimeout` recursivo: cada columna gira más ticks que la anterior (`10 + col*7 + col*col*2`)
  y desacelera en los últimos 5 ticks — para escalonada y progresivamente más lenta.
- Sonidos: la ruleta usa `Sonido.ruletaGira` / `ruletaGana` / `ruletaPierde` (bolita en el
  plato). La tragaperras tiene los suyos, con timbre electrónico de máquina de bar y claramente
  distintos: `Sonido.tragaGira` (arpegio square rápido), `tragaPara` (clunk por rodillo),
  `tragaGana` (arpegio ascendente + cascada de monedas), `tragaPierde` (dos notas cortas hacia
  abajo), `tragaRiesgo` (tic-toc de suspense). Ninguno se parece a los de los dados. Perder una
  apuesta grande resta algo de mental.

### Clubes — bases de datos reales
- `CLUBES_POR_CATEGORIA`: clubes reales de España (temporada 2026-27), LaLiga / LaLiga2 /
  Primera RFEF / Segunda RFEF, cada uno `{nombre, colores:[hex1,hex2]}`. Categoría inicial del
  jugador: "Tercera RFEF" (`CATEGORIAS` es la escala completa).
- `escudoSVG(nombre, tamano, colores)`: escudo genérico con iniciales + colores — NUNCA el
  escudo oficial. `PATRON_ESCUDO_LALIGA` da forma (escudo/círculo) y patrón (rayas/mitades/
  diagonal/sólido) por club de LaLiga. Excepción: escudo especial del Novelda CF por nombre.
  `inicialesClub`, `colorDesdeTexto`, `esColorClaro`.
- **Escudos "a medida"** de los clubes top: `escudoBarcelona/RealMadrid/Atletico/Bayern/ManCity/
  PSG`, enganchados en `escudoSVG` por nombre. Son diseños propios mínimos (forma `FORMA_ESCUDO_OLLA`
  vía `envolverEscudo()` + color + franjas/bandas + siglas), NO los emblemas reales. Al añadir
  más, mismo criterio: nada de coronas/monogramas/animales/composiciones oficiales.
- **Dos tramos de élite**:
  - *Grandes* — `CLUBES_GRANDES` [Barça, Madrid, Atleti] + `CLUBES_GRANDES_EXTRANJERO` [Bayern,
    Man City, PSG]; `esClubGrande(nombre)` cubre ambos: sueldo "Grande", `OBJETIVOS_GRANDE`,
    techo de ambición 4, duración de contrato 1 año, escudo a medida. Los de fuera construyen
    su `j.club` con `grande:true`.
  - *Prestigio 4* (élite pero no grande) — además de los 6 grandes: Liverpool, Man United,
    Chelsea, Arsenal, Juventus, Inter, AC Milan, Borussia Dortmund. `factorPrestigio` = x1.6 al
    sueldo (x0.7/x1.0/x1.3 para niveles 1-3). Solo llegan como oferta a jugadores con
    reputación >= 60 (`tierMax` = 4 en `procesarBanderasFichaje` / `generarOfertas`).
- **Rivalidades directas** (`DERBIS` → `RIVAL_DIRECTO` → `esRivalDirecto(a,b)`): en `generarOfertas`
  (loop local y extranjero) el rival directo se descarta el 93% de las veces; se excluye de
  `candidatosGrandes` en `fichajeGrande`; si fichas por él, `iniciarFichaje` deja
  `carinoAficion=2`, hunde el `carino` de la etapa anterior y lanza aviso `riesgo`
  (`S.esFichajeRival`). Las ofertas de rival llevan `of.rivalDirecto` (badge en `SCREENS.ofertas`).
- `CLUBES_EXTRANJERO`: clubes reales de varios
  países con `pais`/`liga`/`colores`; `COPA_NACIONAL_POR_PAIS` / `nombreCopaNacional()` para el
  nombre correcto de la copa (Copa del Rey solo en España). `FILIAL_DE_CLUB`,
  `primerEquipoDeFilial` / `primeraEquipoDeFilial` para no fichar por filiales.
- Los tres fichajes narrativos (`fichaje`, `fichajeExtranjero`, `fichajeGrande`, +
  `fichajeUltimaEtapa`) van por `procesarBanderasFichaje(j, rama)` → construyen un `j.club`
  **nuevo entero** (nunca mutan el existente), y pasan por `S.ofertaFichajePendiente` /
  `SCREENS.ofertas` → negociación → (regresoClub?) → rueda de prensa.

### Iconos
`ICONOS_SVG` + `iconoInsignia(clave, tamano)` / `iconoInline(clave, tamano)`: insignia circular
dorada con icono SVG en trazo. Aplicado a los 6 atributos (físico, velocidad, tiro, regate,
pase, desmarque — `desmarque` es el atributo nuevo), la mentalidad, y los artículos de la
tienda. El resto de emojis sueltos del juego (trofeos, dados, badges) siguen sin tocar a
propósito. Si se retoma: mostrar muestra comparativa antes de aplicar a todo.

### Sonido
Módulo `Sonido`: efectos (clics, dados, éxito/fallo, fichaje, trofeo, sube/baja nivel). Música
desactivada a petición del usuario (el código sigue pero no se auto-arranca). Solo botón de
efectos en la topbar.

### Interfaz
- Logo "FICHAJE 10" (`.logo-wrap` > `.logo-badge` + `.logo-text` .top/.main) en la topbar y en
  el tutorial. La camiseta usa `logoCamisetaCompacta(19)` (SVG de `logoCamiseta` con el viewBox
  recortado a su dibujo y alto fijo), centrada verticalmente con el texto vía `align-items:center`.
  El logo grande de la portada (`SCREENS.menu`) usa `logoCamiseta(74)` directamente.
- `pintar()` hace `window.scrollTo(0,0)` en cada cambio de pantalla, PERO si se repinta la
  MISMA pantalla (`S.screen === _pantallaPintadaPrevia`, p. ej. togglear un servicio en
  `SCREENS.gastos`) conserva el scroll donde estaba. Los reveals con `.press-headline` /
  `.season-reveal .num` luego hacen `scrollIntoView` al dato.
- `SCREENS.ajustes` tiene botón "← Volver" (`S.pantallaAnteriorAjustes` o menú/tabJugador) —
  hace falta porque desde el menú no hay tabbar ni engranaje para salir.
- **Creación** (`SCREENS.crear`): campos en filas (`.field-row`): Nombre+Apellidos, y
  Localidad+Posición (Posición = input `disabled` con "Delantero"). Nombre/Apellidos arrancan
  vacíos; el botón "Empezar carrera" exige nombre+apellidos+localidad+estilo.
- `crearEyebrow(texto)` combina título/subtítulo de pantalla con el eyebrow de la tarjeta
  (usa `tituloPaginaPendiente` guardado por `topbar()`).
- `PANTALLAS_TAB` (con barra de pestañas: tabJugador/tabClub/tabEstadisticas/tabEconomia/gastos/
  ajustes/casino/ruleta) vs `PANTALLAS_SIN_TABBAR` (reveals, rueda de prensa, legado, regreso...).
- Nombre del jugador capitalizado (`capitalizarNombre`).
- `render()` con transición fade de 260ms — cuidado con handlers "viejos" en doble clic.
- **Tutorial de inicio** (`SCREENS.tutorial`): carrusel de 6 tarjetas (`TUTORIAL_PASOS`:
  `{icono,titulo,texto}`) con logo arriba, una ilustración SVG propia por paso
  (`ilustracionTutorial(id)`, switch por `icono`), caja de texto `.tuto-text` (sin el borde azul
  de `.lore-box`), dots (`.tuto-dots`), Anterior/Siguiente/Empezar y "Saltar". Se
  muestra la primera vez (gate en el arranque: `S.screen==='menu' && !S.jugador &&
  !tutorialYaVisto()` → `S.screen='tutorial'`), marca `localStorage['fichaje10_tutorialVisto_v1']`
  al terminar/saltar (`terminarTutorial()`), y hay acceso desde Ajustes ("Ver el tutorial otra
  vez"). `terminarTutorial` vuelve al menú o a `S.pantallaBase` si hay partida en curso.
  En `PANTALLAS_SIN_TABBAR`.

## Analítica (Umami Cloud)

Única dependencia externa deliberada del proyecto aparte de Google Fonts: un `<script>` de
[Umami Cloud](https://cloud.umami.is) (capa gratuita, sin cookies, sin datos personales) en el
`<head>` de `index.html`, con `data-website-id="TU-WEBSITE-ID"` — sustituir por el ID real que da
Umami al dar de alta el sitio (crear cuenta gratis en cloud.umami.is → añadir sitio con la URL de
GitHub Pages → copiar el Website ID). Cuenta visitas automáticamente sin código extra.
Eventos personalizados vía `trackEvento(nombre, datos)` (definida junto a `el()`, ~línea 7646;
no rompe nada si el script no ha cargado — bloqueadores de anuncios, sin red — porque comprueba
`typeof umami !== 'undefined'` dentro de un `try/catch`). Disparados actualmente:
- `nueva_partida` (`{estilo}`) al pulsar "Empezar carrera" en `SCREENS.crear`.
- `retiro` (`{temporada, partidos, goles, titulos, categoriaFinal}`) al pulsar "Colgar las
  botas" en `SCREENS.retiro` (forzosa a los 42 o voluntaria, mismo punto).
Al añadir un evento nuevo: nombre en minúsculas con guion bajo, payload pequeño (unas pocas
claves), y pensar en el volumen si se dispara muy seguido (capa gratuita: 100.000 eventos/mes).

## Errores ya cazados — vigilar que no se repitan

- **Cambios que no persisten**: en FICHAJE 10, varios arreglos "guardados" no llegaban al
  archivo. Releer siempre la zona editada del archivo YA GUARDADO tras cada edición.
- `probabilidadExito` y `tirar` desincronizados: el % mostrado no reflejaba racha gafada /
  crisis. Cualquier modificador nuevo va en LAS DOS funciones.
- Mutar `j.club` en vez de reemplazarlo deja campos residuales (`nivelEuropeo`, `grande`,
  objetivo viejo). Siempre objeto nuevo entero.
- Género fijo en textos ("el hermano de", "tu hijo") cuando el personaje puede ser mujer:
  usar `personaje.genero` para sustantivo Y artículo.
- Nombre de personaje sin etiqueta de relación ("Lidia te llama" en vez de "Tu agente Lidia").
- Condiciones de eventos incoherentes con el contexto (eventos "de España" en el extranjero,
  ofertas de club grande estando ya en uno, playoff fuera de posición/temporada, mentor en tu
  vestuario tras cambiar de club, "campo neutral" en eliminatorias a doble vuelta, prima ligada
  a un umbral que ya has superado).
- Fallo clásico de JS con el `0` "falsy" (protección de "no repetir variante", índices).
- Doble clic rápido dispara handler viejo (260ms de transición). Bandera local `respondiendo`.
- Cifras fijas que envejecen mal cuando otra parte se reescala: preferir % sobre el estado
  actual del jugador.
- No dejar cambios visibles sin notificar en pantalla (pasó con el contrato de emergencia).
- Pantalla en blanco = normalmente un `ReferenceError` en el render de esa `SCREENS.x`. Ej.
  corregido: `SCREENS.resultado` usaba `j.fichajeVeranoGarantizado` sin declarar `const j =
  S.jugador;` — solo reventaba en ramas con `diferirVerano:true` (evento `oferta_club_superior`).
- **Recordar subir la versión del `sw.js` al desplegar** (el service worker vive en el hosting,
  no en este `index.html`; irrelevante para pruebas locales).

## Estado al recuperar el proyecto (31-ago-2026)

El `index.html` de la carpeta viene del último Artifact de FICHAJE 10 y **contiene** los ~26
puntos trabajados en ese chat (subtramas con etiquetas de género/relación, prima de popularidad
en texto, duración de patrocinios variable, ventaja del 20 natural en semis, 1/20 natural
automáticos, pantalla de regreso a club, legado cada 5, "en/la" en títulos de copa, mención del
rival en el cruce de calendario, mentor.club, "campo neutral" eliminado, autobús/vuelo según
categoría...).

- Auditoría de persistencia completa (31-ago): cruzado el historial con el archivo, punto por
  punto. **Solo 1 arreglo no había persistido** (evento `El gol se te da con una facilidad
  pasmosa...`, faltaba "en las") — corregido. Todo lo demás de las dos tandas está aplicado
  (ver detalle en "Pendiente / ideas para retomar").
- El punto 10 (rediseño del resumen de fin de carrera + subtramas) se implementó al retomar,
  así que la lista de FICHAJE 10 queda **cerrada**.

## Pendiente / ideas para retomar

- **Punto 10 de FICHAJE 10 — HECHO (31-ago)**: `SCREENS.final` rediseñado, con la tarjeta
  "El legado personal" (`resumenSubtramas`) que cierra cada subtrama según su estado, más un
  rótulo de sección sobre las cifras. Verificado en navegador con 2 escenarios (relaciones
  altas / bajas) + caso sin subtramas. Con esto se cerró la lista de FICHAJE 10.
- Auditoría de persistencia de FICHAJE 10 — HECHA (31-ago). Se cruzó el historial con el
  archivo, punto por punto, para las dos tandas ("15 puntos" y "11 puntos"). **Todos aplicados**
  salvo uno: el evento del gol ("...facilidad pasmosa últimas jornadas", faltaba "en las"),
  detectado y corregido al recuperar. Verificados uno a uno: mayúsculas en mods de tirada,
  candidatos `S._xCandidato` para nombres estables, fichaje extranjero "sentarse a negociar",
  `carinoAficion` en `aplicarEfectos` (línea ~5439), textos de semifinal sin "campo neutral" +
  antirrepetición con `?? ` (línea ~9748), `oferta_patrocinio_local` cooldown 1 y sin excluir
  extranjero, `calcularDuracionPatrocinio`, `gira_pretemporada` con "fuera de España"
  condicional, `hermano_*` con género y artículo dinámicos, `articuloCompeticion` en títulos,
  `ventajaFinalNatural20`, 1/20 natural automáticos, suelo de renovación, `regresoClub`,
  legado cada 5, `prima_popularidad` por nivel/umbral. Sin eventos con "X te llama" sin etiqueta.
- Rediseño de iconos: extenderlo al resto de emojis (trofeos, dados, badges de eventos).
- Habilidades roleras desglosadas por atributo (tipo Disco Elysium, versión ligera).
- Avatar personalizable. Selección de posición distinta a Delantero.
- Ampliar `CLUBES_EXTRANJERO` a más países (5 top reales + colores + `COPA_NACIONAL_POR_PAIS`).
- Revisar si `S.rolTemporada` debería recalcularse en un fichaje a mitad de temporada
  (ahora se queda con el valor del inicio de temporada con el club anterior — aceptado).
