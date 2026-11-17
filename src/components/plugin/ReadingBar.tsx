import type { ReactNode } from 'react';
import type { ToolId } from '../../types';
import { TOOLS } from '../../data/tools';
import { EyeIcon, SparkleIcon, SpeakerIcon } from '../ui/Icons';

const ICONS: Record<ToolId, ReactNode> = {
  resumen: <SparkleIcon />,
  foco: <EyeIcon />,
  letra: <span className="aa" aria-hidden="true">Aa</span>,
  voz: <SpeakerIcon />,
};

/**
 * Barra de lectura anclada al pulgar (móvil), flotante (tablet) o junto al panel (escritorio).
 * El punto verde avisa que esa herramienta tiene algo activo.
 */
export function ReadingBar({ current, active, onSelect }: {
  current: ToolId | null;
  active: Partial<Record<ToolId, boolean>>;
  onSelect: (id: ToolId) => void;
}) {
  return (
    <nav className="bar" id="bar" aria-label="Lectura fácil" data-tour="bar">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`tab${active[t.id] ? ' active' : ''}`}
          data-tab={t.id}
          data-tour={`tab-${t.id}`}
          aria-pressed={current === t.id}
          onClick={() => onSelect(t.id)}
        >
          {t.id !== 'resumen' && <span className="dot" />}
          {ICONS[t.id]}
          {t.tab}
        </button>
      ))}
    </nav>
  );
}
