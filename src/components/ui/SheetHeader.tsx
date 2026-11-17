import { CloseIcon, HelpIcon } from './Icons';

/** Cabecera de cada panel: título, descripción, ayuda y cerrar */
export function SheetHeader({ title, subtitle, onClose, onHelp }: {
  title: string; subtitle: string; onClose: () => void; onHelp?: () => void;
}) {
  return (
    <div className="sh-head">
      <div className="sh-title">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {onHelp && (
        <button type="button" className="xbtn xbtn--help" onClick={onHelp} aria-label="Abrir el Centro de ayuda" title="Ayuda">
          <HelpIcon />
        </button>
      )}
      <button type="button" className="xbtn" onClick={onClose} aria-label={`Cerrar ${title.toLowerCase()}`}>
        <CloseIcon />
      </button>
    </div>
  );
}
