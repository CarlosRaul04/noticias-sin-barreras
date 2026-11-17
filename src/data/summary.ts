import type { GlossaryEntry, SummaryIdea } from '../types';

/**
 * Resumen verificable: cada idea enlaza con la frase de la noticia que la respalda.
 * La IA está simulada: estas ideas están escritas de antemano.
 */
export const SUMMARY_IDEAS: SummaryIdea[] = [
  {
    title: 'La solución vial',
    text: 'Se construirá un [[bypass]] de 4 carriles en el Km 80 de la Panamericana Norte para separar el transporte pesado del tránsito ligero.',
    source: 1,
  },
  {
    title: 'Alivio del tráfico',
    text: 'La obra busca evitar la congestión que causan 3,800 camiones diarios rumbo al Megapuerto de Chancay.',
    source: 2,
  },
  {
    title: 'Tiempo a Asia',
    text: 'El traslado marítimo hacia Shanghái tomaría entre 23 y 25 días.',
    source: 7,
  },
  {
    title: 'Quién lo anunció',
    text: 'El MTC y la APN presentaron el cronograma para conectar el puerto con Lima y el Callao.',
    source: 0,
  },
];

/** Explicación de los términos marcados con [[...]] */
export const GLOSSARY: Record<string, GlossaryEntry> = {
  bypass: { term: 'Bypass', definition: 'Vía alterna que permite evitar un tramo congestionado.' },
};

export const SUMMARY_VARIANTS = ['Breve', 'Lenguaje claro', '60 segundos'];
