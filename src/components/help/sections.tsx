import type { ReactNode } from 'react';
import type { HelpSection } from '../../data/help/types';
import { BookIcon, HelpIcon, HomeIcon, MailIcon, UsersIcon, VideoIcon } from '../ui/Icons';

/** Secciones del Centro de ayuda, en el orden en que aparecen */
export const SECTIONS: { id: HelpSection; label: string; desc: string; icon: ReactNode }[] = [
  { id: 'inicio', label: 'Inicio', desc: 'Notín te orienta', icon: <HomeIcon /> },
  { id: 'guias', label: 'Guías', desc: 'Cómo usar cada herramienta', icon: <BookIcon /> },
  { id: 'videos', label: 'Videos', desc: 'Tutoriales de menos de 1 minuto', icon: <VideoIcon /> },
  { id: 'preguntas', label: 'Preguntas frecuentes', desc: 'Respuestas rápidas', icon: <HelpIcon /> },
  { id: 'comunidad', label: 'Comunidad', desc: 'Trucos y dudas de otros lectores', icon: <UsersIcon /> },
  { id: 'contacto', label: 'Contacto y reclamos', desc: 'Escríbenos o registra un reclamo', icon: <MailIcon /> },
];
