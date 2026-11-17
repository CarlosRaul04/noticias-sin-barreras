# Noticias sin barreras 3.1

Plugin de accesibilidad cognitiva para prensa digital, para adultos con TDAH, dislexia o autismo nivel 1.
Prototipo académico · Interacción Humano Computador · USIL.

La versión 3.1 toma el diseño responsive de la 3.0 (una sola página HTML) y lo pasa a React + TypeScript,
separado por componentes, datos y estilos. Además agrega la **guía de primer uso con foco** y la mascota **Notín**.

## Cómo correrlo

```bash
npm install
npm run dev       # abre http://localhost:3000
npm run build     # genera la carpeta dist/ (se puede abrir o publicar tal cual)
```

## El diario de prueba

«El Pacífico» imita la estructura de las notas de los diarios digitales peruanos (El Comercio,
La República, Gestión), porque esa saturación es lo que el plugin resuelve:

- Barra superior, secciones y franja «EN VIVO · Temas del día».
- Billboard bajo la cabecera y anuncio entre párrafos.
- Columna derecha con anuncio 300×250, «Lo más visto» y anuncio alto que se queda fijo al bajar.
- Enlaces «MIRA AQUÍ», video en vivo, «Seguir temas», «Te puede interesar» y «Contenido patrocinado».
- Anuncio fijo en la parte inferior (se puede cerrar).

En celular y tablet la columna derecha baja al final de la nota, como en los diarios reales.
Con «Ocultar anuncios», «Ocultar video» y «Ocultar otras noticias» activos, la nota queda sola y centrada.

## Cómo se adapta a cada pantalla

El diseño responde al ancho de la página con *container queries* (`styles/plugin.css`):

| Ancho | Barra de lectura | Dónde se abre cada herramienta |
| --- | --- | --- |
| Menos de 700 px (celular) | Fija abajo, al alcance del pulgar | Hoja que sube desde abajo |
| 700 a 999 px (tablet) | Flotante y centrada | Hoja flotante sobre la barra |
| 1000 px o más (escritorio) | Aparece al tocar el botón «Lectura fácil» | Panel a la derecha |

Al abrir una herramienta, la noticia se difumina para que la atención quede en el panel.

## Estructura

```
src/
├── App.tsx                  Une las piezas y guarda el estado general
├── main.tsx                 Punto de entrada
├── types/index.ts           Tipos compartidos
├── data/                    CONTENIDO (se cambia sin tocar componentes)
│   ├── article.ts           Diario y noticia (frases, párrafos y lo que va entre ellos)
│   ├── siteContent.ts       Anuncios, video, «Lo más visto», recomendados, patrocinados, temas
│   ├── summary.ts           Las 4 ideas del resumen y el glosario ([[término]])
│   ├── readingOptions.ts    Paletas, letras, combinaciones listas, interruptores, velocidades
│   ├── tools.ts             Pestañas de la barra y títulos de cada panel
│   ├── tourSteps.ts         Pasos de la guía (un mensaje de ≤ 20 palabras por paso)
│   └── help/                Centro de ayuda: guías, videos (videos.json), preguntas, comunidad, Notín
├── hooks/                   LÓGICA
│   ├── useReadingSettings   Letra y color → variables CSS (--r-*), con deshacer de 10 s
│   ├── useFocusOptions      Interruptores de «Leer sin distracciones»
│   ├── useVoiceReader       Voz frase por frase (voz del navegador o simulación)
│   ├── useGuidedTour        La guía sale sola la primera vez
│   ├── useAnnouncer         Mensajes para lectores de pantalla
│   └── useStoredState       Borradores y casos guardados en el navegador; números de caso
├── components/
│   ├── site/                Maqueta del diario «El Pacífico» (no es parte del plugin):
│   │                        cabecera, billboard, nota, columna derecha, anuncio fijo, pie
│   ├── plugin/              Barra, botón flotante, hoja, aviso inicial, aviso de deshacer
│   │   └── panes/           Los 4 paneles: Resumen, Foco, Letra y color, Voz
│   ├── tour/                Guía con foco (GuidedTour) y mascota (Mascot)
│   ├── help/                Centro de ayuda y formularios (contacto, ticket, Libro de Reclamaciones)
│   └── ui/                  Piezas reutilizables: íconos, interruptor, botones segmentados…
└── styles/
    ├── tokens.css           Colores, tipografías y medidas de la identidad visual
    ├── base.css             Reinicio, foco visible, contenedor de la app
    ├── site.css             Estilos del diario
    ├── plugin.css           Barra, hoja, difuminado y los 3 tamaños de pantalla
    ├── controls.css         Controles de los paneles
    ├── tour.css             Guía y animaciones de Notín
    └── help.css             Centro de ayuda y formularios
public/media/help/           Capturas de las guías
public/media/videos/         Videotutoriales (MP4 1280×720, sin sonido) y sus portadas
```

## Cómo extenderlo

- **Otra noticia:** editar `data/article.ts` y `data/summary.ts`. Cada frase es un elemento del arreglo `sentences`; las ideas del resumen apuntan a la frase que las respalda con `source`.
- **Otro término con explicación:** marcarlo en la idea como `[[término]]` y agregarlo a `GLOSSARY`.
- **Otra paleta o combinación lista:** agregarla en `data/readingOptions.ts`.
- **Otro anuncio o bloque del diario:** agregarlo en `data/siteContent.ts` (o como bloque en `ARTICLE.blocks`).
- **Otro interruptor de foco:** agregarlo en `FOCUS_OPTIONS`, al tipo `FocusOptionId` y su clase en `styles/site.css`.
- **Otro paso de la guía:** agregarlo en `data/tourSteps.ts` con el selector del bloque (`data-tour="…"`).

## Guía de primer uso (affordance y signifiers)

- Aparece apenas se abre la página (en cada visita, para las pruebas con usuarios); después se abre con «Ver la guía» al final de la noticia o desde el Centro de ayuda.
- Solo el bloque señalado queda nítido; el resto se difumina y oscurece, y no se puede tocar durante la guía.
- Progreso visible («Paso 2 de 5»), botones siempre en el mismo lugar, teclado (← → Esc) y lector de pantalla.
- Notín saluda 3 veces y se detiene. Con «Reducir animaciones» o la preferencia del sistema, no hay movimiento.

## Centro de ayuda (soporte al usuario)

Un solo punto de entrada para no sumar botones sobre el diario: el **?** de cada panel y los enlaces al final de la noticia («Centro de ayuda» y «Libro de Reclamaciones»).

| Componente | Dónde está | Qué hace |
|---|---|---|
| Base de conocimientos | Guías (`data/help/articles.ts`) | 8 guías de 1 minuto con captura, pasos, consejo y botón para abrir la herramienta |
| Videotutoriales | Videos (`data/help/videos.json`) | 5 videos de 22 a 35 s, sin sonido, con el texto en pantalla y transcripción; velocidad ajustable |
| Preguntas frecuentes | Preguntas (`data/help/faqs.ts`) | 10 preguntas por tema; se abre una a la vez |
| Foro de usuarios | Comunidad (`data/help/community.ts`) | Reglas, filtros, publicaciones con seudónimo y moderación previa; los ejemplos están marcados como tales |
| Libro de Reclamaciones | Contacto y reclamos | Hoja con N.° correlativo, datos del proveedor y del consumidor, bien contratado, reclamo o queja, pedido y constancia; plazo de 15 días hábiles |
| Otros | Inicio y Contacto | Notín con respuestas fijas (sin chat), buscador, reportar error del resumen, ticket con gravedad y tiempos del SLA, consulta del caso, estado del servicio |

- **Prototipo:** no hay servidor. Formularios, casos y publicaciones se guardan solo en el navegador (`localStorage`, prefijo `nsb-`).
- **Regenerar los videos:** los guiones están en `data/help/videos.json`; los videos se generaron capturando el prototipo con Playwright y uniendo las escenas con ffmpeg. Si cambia un guion, hay que volver a generar su video y actualizar `videoDurations.json`.
- **Libro de Reclamaciones:** sigue el Código de Protección y Defensa del Consumidor (Ley 29571, art. 150) y su Reglamento (DS 011-2011-PCM, modificado por DS 101-2022-PCM). Antes de publicar el servicio real, hay que registrar la razón social y el RUC.

## Notas

- La IA está **simulada**: el resumen está escrito de antemano.
- «El Pacífico» es un diario ficticio; solo sirve para mostrar el problema de los anuncios.
- Las fuentes Lexend y Atkinson Hyperlegible se cargan desde Google Fonts (sin internet se usa una fuente de respaldo).
