import type { FocusOptionId, FocusState } from '../../../types';
import { FOCUS_OPTIONS } from '../../../data/readingOptions';
import { Switch } from '../../ui/Switch';
import { Pane } from './Pane';

/** Leer sin distracciones: nada se oculta hasta que el usuario lo decide */
export function FocusPane({ visible, focus, activeCount, onToggle, onClose, onHelp }: {
  visible: boolean; focus: FocusState; activeCount: number;
  onToggle: (id: FocusOptionId) => void; onClose: () => void; onHelp: () => void;
}) {
  const subtitle = activeCount
    ? `${activeCount} ${activeCount === 1 ? 'ajuste activo' : 'ajustes activos'} · puedes combinarlos`
    : undefined;
  return (
    <Pane id="foco" visible={visible} subtitle={subtitle} listBody onClose={onClose} onHelp={onHelp}>
      {FOCUS_OPTIONS.map((o) => (
        <Switch key={o.id} label={o.label} hint={o.hint} checked={focus[o.id]} onChange={() => onToggle(o.id)} />
      ))}
    </Pane>
  );
}
