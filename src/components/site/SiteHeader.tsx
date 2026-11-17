import { SITE } from '../../data/article';
import { MenuIcon } from '../ui/Icons';

/** Cabecera del diario: barra superior, logo, secciones y franja «EN VIVO · Temas del día» */
export function SiteHeader() {
  return (
    <>
      <div className="topbar">
        <span className="topbar-date">{SITE.date}</span>
        <div className="topbar-links">
          <a href="#" onClick={(e) => e.preventDefault()}>{SITE.login}</a>
        </div>
      </div>
      <header className="site">
        <button type="button" className="ghost" aria-label="Menú"><MenuIcon /></button>
        <button type="button" className="ghost search" aria-label="Buscar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        </button>
        <div className="logo">{SITE.name}</div>
        <button type="button" className="sub"><span className="sub-long">{SITE.subscribeLong}</span><span className="sub-short">{SITE.subscribe}</span></button>
      </header>
      <nav className="sections" aria-label="Secciones">
        {SITE.sections.map((s) => (
          <a key={s} href="#" aria-current={s === SITE.currentSection ? 'page' : undefined} onClick={(e) => e.preventDefault()}>{s}</a>
        ))}
      </nav>
      <div className="live-strip">
        <b><i aria-hidden="true" /> EN VIVO</b>
        <span className="live-label">Temas del día:</span>
        {SITE.liveTopics.map((t) => <a key={t} href="#" onClick={(e) => e.preventDefault()}>{t}</a>)}
      </div>
    </>
  );
}
