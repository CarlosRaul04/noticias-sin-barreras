import { MOST_VIEWED } from '../../data/siteContent';
import { Ad } from './Ad';

/** Columna derecha del diario: anuncio 300×250, «Lo más visto» y anuncio alto fijo. En celular y tablet baja al final. */
export function Sidebar() {
  return (
    <aside className="rail" aria-label="Columna lateral del diario">
      <Ad id="box" />
      <section className="most-viewed" aria-labelledby="mas-visto">
        <h2 id="mas-visto" className="np-h2 np-rule">Lo más visto</h2>
        <ol>{MOST_VIEWED.map((t, n) => <li key={t}><span aria-hidden="true">{n + 1}</span><a href="#" onClick={(e) => e.preventDefault()}>{t}</a></li>)}</ol>
      </section>
      <div className="rail-sticky"><Ad id="tall" /></div>
    </aside>
  );
}
