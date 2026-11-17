/** Las 4 herramientas de la barra de lectura */
export type ToolId = 'resumen' | 'foco' | 'letra' | 'voz';

/** Interruptores de «Leer sin distracciones» (cada id es también la clase CSS que se aplica) */
export type FocusOptionId = 'hide-ads' | 'hide-video' | 'hide-links' | 'hide-img' | 'on-ruler' | 'reduce';
export type FocusState = Record<FocusOptionId, boolean>;

export type FontId = 'lexend' | 'atkinson' | 'espaciada' | 'clasica';
export type PaletteId = 'blanco' | 'crema' | 'salvia' | 'sepia' | 'noche';
export type PresetId = 'estandar' | 'aire' | 'suave' | 'noche';

/** Ajustes de «Letra y color» */
export interface ReadingSettings {
  font: FontId;
  size: number; // px
  lh: number; // interlineado
  pal: PaletteId;
}

/** Bloques de la noticia, en el orden en que aparecen */
export type ArticleBlock =
  | { type: 'paragraph'; sentences: number[] }
  | { type: 'ad'; id: 'inline' }
  | { type: 'seeAlso'; text: string }
  | { type: 'video' };

export interface SummaryIdea {
  title: string;
  /** Texto de la idea. Los términos con explicación van entre [[corchetes dobles]] */
  text: string;
  /** Índice de la frase de la noticia que respalda la idea */
  source: number;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}
