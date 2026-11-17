import type { ToolId } from '../types';

/** Pestañas de la barra y cabecera del panel que abre cada una */
export const TOOLS: { id: ToolId; tab: string; title: string; subtitle: string }[] = [
  { id: 'resumen', tab: 'Resumir', title: 'Resumen en 4 ideas', subtitle: 'Cada idea enlaza con la noticia' },
  { id: 'foco', tab: 'Sin anuncios', title: 'Leer sin distracciones', subtitle: 'Nada se oculta hasta que lo decidas' },
  { id: 'letra', tab: 'Letra', title: 'Letra y color', subtitle: 'Se aplica a toda la noticia al instante' },
  { id: 'voz', tab: 'Escuchar', title: 'Escuchar la nota', subtitle: 'La frase que suena se resalta en la noticia' },
];
