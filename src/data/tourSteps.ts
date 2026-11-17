/**
 * Pasos de la guía de primer uso. Un mensaje por paso, de 20 palabras o menos.
 * - target: selector del bloque que se resalta (sin target = mensaje centrado).
 * - showBar: en escritorio la barra solo aparece al abrir un panel; en la guía se muestra.
 * - optional: si el bloque no se ve en esa pantalla, el paso se salta (p. ej. el botón
 *   flotante solo existe en escritorio).
 */
export interface TourStep {
  id: string;
  target?: string;
  showBar?: boolean;
  optional?: boolean;
  title: string;
  body: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'bienvenida',
    title: '¡Hola! Soy Notín',
    body: 'Te enseño a leer noticias de forma más fácil. Son pocos pasos y toma menos de 1 minuto.',
  },
  {
    id: 'barra',
    target: '[data-tour="bar"]',
    showBar: true,
    title: 'Tu barra de lectura fácil',
    body: 'Aquí tienes 4 herramientas. Puedes usar una sola o combinarlas.',
  },
  {
    id: 'resumen',
    target: '[data-tour="tab-resumen"]',
    showBar: true,
    title: 'Resumir',
    body: 'Te explica la noticia en 4 ideas cortas, una a la vez. Cada idea dice de dónde sale.',
  },
  {
    id: 'foco',
    target: '[data-tour="tab-foco"]',
    showBar: true,
    title: 'Sin anuncios',
    body: 'Oculta los anuncios, el video o la foto. Tú eliges qué quitar.',
  },
  {
    id: 'letra',
    target: '[data-tour="tab-letra"]',
    showBar: true,
    title: 'Letra',
    body: 'Cambia la letra, el tamaño y el color del fondo. Ves el cambio al instante.',
  },
  {
    id: 'voz',
    target: '[data-tour="tab-voz"]',
    showBar: true,
    title: 'Escuchar',
    body: 'Una voz lee la noticia y resalta en pantalla la frase que suena.',
  },
  {
    id: 'boton',
    target: '[data-tour="fab"]',
    optional: true,
    title: 'Lectura fácil',
    body: 'Cuando cierres la barra, toca este botón para volver a abrirla.',
  },
  {
    id: 'fin',
    title: '¡Listo, ya sabes usarlo!',
    body: 'Si tienes dudas, toca «?» en cualquier panel: abre el Centro de ayuda con guías, videos y respuestas.',
  },
];
