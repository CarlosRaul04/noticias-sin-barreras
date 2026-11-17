import { SITE } from '../../data/article';

/** Pie del diario ficticio */
export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="logo">{SITE.name}</div>
      <p>Diario ficticio creado para el prototipo académico «Noticias sin barreras» · USIL · Interacción Humano Computador.</p>
      <nav aria-label="Enlaces del diario">
        {['Contacto', 'Términos y condiciones', 'Política de privacidad', 'Suscripciones'].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()}>{l}</a>
        ))}
      </nav>
    </footer>
  );
}
