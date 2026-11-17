import type { ToolId } from '../../types';

/** Secciones del Centro de ayuda */
export type HelpSection = 'inicio' | 'guias' | 'videos' | 'preguntas' | 'comunidad' | 'contacto';

/** Formularios de la sección Contacto y reclamos */
export type ContactForm = 'error-resumen' | 'ticket' | 'estado' | 'reclamaciones';

/** Destino al que lleva un enlace interno del Centro de ayuda */
export type HelpTarget =
  | { section: HelpSection; id?: string }
  | { tool: ToolId }
  | { tour: true };

export interface HelpArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  minutes: number;
  image?: { src: string; alt: string };
  steps: string[];
  tip?: string;
  videoId?: string;
  tool?: ToolId;
}

export interface Faq {
  id: string;
  category: string;
  q: string;
  a: string;
  link?: { label: string; target: HelpTarget };
}

export interface VideoScene {
  /** Texto que aparece en pantalla (también es la transcripción) */
  text: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  summary: string;
  file: string;
  poster: string;
  seconds: number;
  scenes: VideoScene[];
}

export interface CommunityPost {
  id: string;
  alias: string;
  category: string;
  title: string;
  body: string;
  replies: { alias: string; body: string; team?: boolean }[];
  pinned?: boolean;
  example?: boolean;
  pending?: boolean;
}

export interface AssistantTopic {
  id: string;
  ask: string;
  answer: string;
  actions: { label: string; target: HelpTarget }[];
}
