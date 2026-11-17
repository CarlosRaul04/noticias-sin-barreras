import type { FocusOptionId, FontId, PaletteId, PresetId, ReadingSettings } from '../types';

/** Paletas: [fondo, texto, texto secundario, líneas] */
export const PALETTES: Record<PaletteId, { label: string; colors: [string, string, string, string] }> = {
  blanco: { label: 'Blanco', colors: ['#FFFFFF', '#14213D', '#4A5873', '#E1E7F0'] },
  crema: { label: 'Crema', colors: ['#F7F1E3', '#2A2723', '#5B5448', '#E4DAC3'] },
  salvia: { label: 'Salvia', colors: ['#E2EDE3', '#1F2B24', '#46564B', '#C9DACB'] },
  sepia: { label: 'Sepia', colors: ['#F0E4D0', '#33281A', '#6A5A44', '#DCCBAE'] },
  noche: { label: 'Nocturno', colors: ['#14161B', '#E7E9EE', '#AEB5C4', '#2A2F3A'] },
};

export const FONTS: Record<FontId, { label: string; family: string; spaced?: boolean }> = {
  lexend: { label: 'Lexend', family: "'Lexend','Inter',system-ui,sans-serif" },
  atkinson: { label: 'Atkinson', family: "'Atkinson Hyperlegible','Inter',system-ui,sans-serif" },
  espaciada: { label: 'Espaciada', family: "'Lexend','Inter',system-ui,sans-serif", spaced: true },
  clasica: { label: 'Clásica', family: "Georgia,'Times New Roman',serif" },
};

export const LINE_HEIGHTS = [1.5, 1.7, 2.1];
export const TEXT_SIZE = { min: 16, max: 24, step: 2 };

export const DEFAULT_SETTINGS: ReadingSettings = { font: 'lexend', size: 18, lh: 1.7, pal: 'blanco' };

/** Combinaciones listas (la forma rápida, sin entrar a «Más opciones») */
export const PRESETS: Record<PresetId, { label: string; settings: ReadingSettings; swatch: { bg: string; ink?: string; font?: string } }> = {
  estandar: { label: 'Estándar', settings: { font: 'lexend', size: 18, lh: 1.7, pal: 'blanco' }, swatch: { bg: '#FFFFFF', font: 'Lexend,Inter,sans-serif' } },
  aire: { label: 'Más aire', settings: { font: 'atkinson', size: 20, lh: 2.1, pal: 'crema' }, swatch: { bg: '#F7F1E3', font: "'Atkinson Hyperlegible',Inter,sans-serif" } },
  suave: { label: 'Suave', settings: { font: 'lexend', size: 18, lh: 1.7, pal: 'salvia' }, swatch: { bg: '#E2EDE3' } },
  noche: { label: 'Poca luz', settings: { font: 'lexend', size: 18, lh: 1.7, pal: 'noche' }, swatch: { bg: '#14161B', ink: '#E7E9EE' } },
};

export const PREVIEW_TEXT = 'Se construirá un bypass de 4 carriles en el Km 80 de la Panamericana Norte.';

/** Interruptores de «Leer sin distracciones» */
export const FOCUS_OPTIONS: { id: FocusOptionId; label: string; hint: string }[] = [
  { id: 'hide-ads', label: 'Ocultar anuncios', hint: 'Quita avisos y enlaces patrocinados' },
  { id: 'hide-video', label: 'Ocultar video', hint: 'Detiene y esconde el video en vivo' },
  { id: 'hide-links', label: 'Ocultar otras noticias', hint: 'Quita «Mira aquí», «Lo más visto» y recomendados' },
  { id: 'hide-img', label: 'Ocultar foto principal', hint: 'Deja solo el texto' },
  { id: 'on-ruler', label: 'Guía de renglón', hint: 'Una franja te marca la línea que lees' },
  { id: 'reduce', label: 'Reducir animaciones', hint: 'Los paneles aparecen sin deslizarse, la página salta sin desplazarse y Notín se queda quieto' },
];

/** Velocidades de la voz. delay = multiplicador del tiempo por frase en la simulación */
export const VOICE_SPEEDS = [
  { label: '0.75×', rate: 0.75, delay: 1.4 },
  { label: '1×', rate: 1, delay: 1 },
  { label: '1.25×', rate: 1.25, delay: 0.7 },
];
