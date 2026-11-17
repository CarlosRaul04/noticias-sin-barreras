import { ADS } from '../../data/siteContent';
import { CloseIcon } from '../ui/Icons';

/** Anuncio fijo en la parte inferior de la pantalla (se puede cerrar) */
export function AnchorAd({ onClose }: { onClose: () => void }) {
  const ad = ADS.anchor;
  return (
    <aside className="adslot ad-anchor" aria-label={`Publicidad fija de ${ad.brand}`}>
      <div className="ad-brand" style={{ background: ad.colors.cta, color: '#fff' }}>{ad.initials}</div>
      <div className="ad-copy">
        <small className="ad-label">PUBLICIDAD</small>
        <b>{ad.brand} · {ad.title}</b>
      </div>
      <button type="button" className="ad-x" onClick={onClose} aria-label="Cerrar publicidad"><CloseIcon size={20} /></button>
    </aside>
  );
}
