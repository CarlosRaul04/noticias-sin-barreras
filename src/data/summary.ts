import type { GlossaryEntry, SummaryIdea } from '../types';

/**
 * Resumen verificable: cada idea enlaza con la frase de la noticia que la respalda.
 * La IA está simulada: estas ideas están escritas de antemano.
 */
export type SummaryVersionId = 'breve' | 'claro' | 'minuto';

export interface SummaryVersion {
  id: SummaryVersionId;
  /** Nombre corto del botón */
  label: string;
  /** Qué cambia en esta versión, en una línea */
  hint: string;
  ideas: SummaryIdea[];
}

/** Tres versiones del mismo resumen. Las tres usan solo datos de la noticia y enlazan con su frase. */
export const SUMMARY_VERSIONS: SummaryVersion[] = [
  {
    id: 'breve',
    label: 'Breve',
    hint: 'Lo esencial, con los datos clave.',
    ideas: [
      { title: 'La solución vial', text: 'Se construirá un [[bypass]] de 4 carriles en el Km 80 de la Panamericana Norte para separar el transporte pesado del tránsito ligero.', source: 1 },
      { title: 'Alivio del tráfico', text: 'La obra busca evitar la congestión que causan 3,800 camiones diarios rumbo al Megapuerto de Chancay.', source: 2 },
      { title: 'Tiempo a Asia', text: 'El traslado marítimo hacia Shanghái tomaría entre 23 y 25 días.', source: 7 },
      { title: 'Quién lo anunció', text: 'El MTC y la APN presentaron el cronograma para conectar el puerto con Lima y el Callao.', source: 0 },
    ],
  },
  {
    id: 'claro',
    label: 'Lenguaje claro',
    hint: 'Palabras sencillas y frases cortas, sin siglas.',
    ideas: [
      { title: 'Una pista nueva para camiones', text: 'Harán una pista de 4 carriles en el kilómetro 80 de la Panamericana Norte. Así los camiones grandes no se mezclan con los autos.', source: 1 },
      { title: 'Para que no haya atascos', text: 'Se espera que lleguen más de 3,800 camiones al puerto de Chancay en las horas de más tráfico. La pista nueva busca evitar atascos.', source: 2 },
      { title: 'Barcos más rápidos a China', text: 'Un barco tardará entre 23 y 25 días en ir de Chancay a Shanghái, en China. Es más rápido que antes.', source: 7 },
      { title: 'Quién lo anunció', text: 'Lo anunció el Ministerio de Transportes junto con la Autoridad Portuaria Nacional, que se encarga de los puertos del país.', source: 0 },
    ],
  },
  {
    id: 'minuto',
    label: '60 segundos',
    hint: 'Más contexto: por qué, cuánto cuesta y cuándo empieza.',
    ideas: [
      { title: 'La obra principal', text: 'Un [[bypass]] y un paso a desnivel de 4 carriles en el Km 80 de la Panamericana Norte separarán los camiones que van al puerto de los autos y buses.', source: 1 },
      { title: 'Por qué se hace', text: 'Con la segunda etapa del puerto pasarán más de 3,800 camiones en hora punta. Los vecinos de Chancay y Peralvillo temían atascos y ruido.', source: 3 },
      { title: 'Cuánto cuesta y qué incluye', text: 'Esta etapa costará más de 380 millones de soles. Incluye pesaje inteligente de camiones y pasos peatonales elevados y accesibles.', source: 5 },
      { title: 'Cuándo empieza', text: 'Las [[licitaciones]] de la obra empezarán en el último trimestre del año, con la supervisión de [[Ositrán]] y la Contraloría.', source: 8 },
    ],
  },
];

export const DEFAULT_SUMMARY_VERSION: SummaryVersionId = 'breve';

export const getSummaryVersion = (id: string) => SUMMARY_VERSIONS.find((v) => v.id === id) ?? SUMMARY_VERSIONS[0];

/** Ideas de la versión breve (se mantiene para quien la importe directamente) */
export const SUMMARY_IDEAS: SummaryIdea[] = SUMMARY_VERSIONS[0].ideas;

/** Explicación de los términos marcados con [[...]] */
export const GLOSSARY: Record<string, GlossaryEntry> = {
  bypass: { term: 'Bypass', definition: 'Vía alterna que permite evitar un tramo congestionado.' },
  licitaciones: { term: 'Licitación', definition: 'Concurso público para elegir a la empresa que hará la obra.' },
  'Ositrán': { term: 'Ositrán', definition: 'Organismo del Estado que supervisa las carreteras, puertos y aeropuertos de uso público.' },
};

