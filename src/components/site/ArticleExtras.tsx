import { RELATED, SPONSORED, TAGS } from '../../data/siteContent';

/** Lo que viene después de la nota: temas, «Te puede interesar» y contenido patrocinado */
export function ArticleExtras() {
  return (
    <>
      <section className="tags" aria-labelledby="seguir-temas">
        <h2 id="seguir-temas" className="np-h2">Seguir temas</h2>
        <ul>{TAGS.map((t) => <li key={t}><a href="#" onClick={(e) => e.preventDefault()}>{t}</a></li>)}</ul>
      </section>

      <section className="related" aria-labelledby="te-puede-interesar">
        <h2 id="te-puede-interesar" className="np-h2 np-rule">Te puede interesar</h2>
        <ul>
          {RELATED.map((r, n) => (
            <li key={r.title}>
              <span className={`thumb thumb-${n + 1}`} aria-hidden="true" />
              <div><small>{r.section}</small><a href="#" onClick={(e) => e.preventDefault()}>{r.title}</a></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="sponsored" aria-labelledby="patrocinado">
        <h2 id="patrocinado" className="sponsored-title">Contenido patrocinado</h2>
        <ul>
          {SPONSORED.map((s, n) => (
            <li key={s.title}>
              <span className={`thumb thumb-s${n + 1}`} aria-hidden="true" />
              <div><a href="#" onClick={(e) => e.preventDefault()}>{s.title}</a><small>{s.sponsor}</small></div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
