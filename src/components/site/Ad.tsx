import { ADS, type AdId } from '../../data/siteContent';

/**
 * Anuncio ficticio. La variante decide el formato, como en los diarios digitales:
 * billboard (arriba, a todo el ancho) · inline (entre párrafos) · box (300×250, columna) ·
 * tall (300×600, columna fija al bajar). Todos se ocultan con «Ocultar anuncios».
 */
export function Ad({ id }: { id: Exclude<AdId, 'anchor'> }) {
  const ad = ADS[id];
  const { bg, ink, cta, ctaInk } = ad.colors;
  return (
    <aside className={`adslot ad-${id}`} aria-label={`Publicidad de ${ad.brand}`} style={{ background: bg, color: ink }}>
      <small className="ad-label">PUBLICIDAD</small>
      <div className="ad-brand" style={{ color: bg }}>{ad.initials}</div>
      <div className="ad-copy">
        {ad.emoji && <span className="ad-emoji" aria-hidden="true">{ad.emoji}</span>}
        <b>{ad.title}</b>
        <span>{ad.text}</span>
      </div>
      <button type="button" className="ad-cta" style={{ background: cta, color: ctaInk }}>{ad.cta}</button>
    </aside>
  );
}
