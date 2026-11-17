import type { ReactNode } from 'react';
import type { ToolId } from '../../../types';
import { TOOLS } from '../../../data/tools';
import { SheetHeader } from '../../ui/SheetHeader';

/**
 * Contenedor de un panel. Los 4 paneles quedan montados (ocultos) para que cada uno
 * recuerde dónde se quedó el usuario, como en la versión 3.0.
 */
export function Pane({ id, visible, subtitle, listBody, onClose, onHelp, children }: {
  id: ToolId; visible: boolean; subtitle?: string; listBody?: boolean;
  onClose: () => void; onHelp: () => void; children: ReactNode;
}) {
  const tool = TOOLS.find((t) => t.id === id)!;
  return (
    <div className="pane" data-pane={id} hidden={!visible}>
      <SheetHeader title={tool.title} subtitle={subtitle ?? tool.subtitle} onClose={onClose} onHelp={onHelp} />
      <div className={`sh-body${listBody ? ' sh-body--list' : ''}`}>{children}</div>
    </div>
  );
}
