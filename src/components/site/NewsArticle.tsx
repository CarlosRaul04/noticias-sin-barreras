import { Fragment, useRef, useState } from 'react';
import { ARTICLE } from '../../data/article';
import { Ad } from './Ad';
import { SeeAlso } from './SeeAlso';
import { ArticleExtras } from './ArticleExtras';
import { LiveVideo } from './LiveVideo';
import { HelpIcon, OpenBookIcon } from '../ui/Icons';

interface Props {
  /** Frase que suena en la voz (se pinta de amarillo) */
  readingIndex: number | null;
  /** Frase que se señala desde el resumen («Ver dónde lo dice la noticia») */
  flashIndex: number | null;
  rulerOn: boolean;
  onSentenceClick: (i: number) => void;
  onOpenGuide: () => void;
  /** Abre el Centro de ayuda (o una sección concreta) */
  onOpenHelp: (section?: 'reclamaciones') => void;
}

/** La noticia. Cada frase es un elemento propio para poder resaltarla y leerla en voz alta. */
export function NewsArticle({ readingIndex, flashIndex, rulerOn, onSentenceClick, onOpenGuide, onOpenHelp }: Props) {
  const articleRef = useRef<HTMLElement>(null);
  const [rulerTop, setRulerTop] = useState(0);

  // Guía de renglón: sigue al puntero o al dedo
  const moveRuler = (y: number) => {
    const r = articleRef.current?.getBoundingClientRect();
    if (r) setRulerTop(Math.max(0, y - r.top - 14));
  };

  const sentence = (i: number) => (
    <span
      key={i}
      className={`s${readingIndex === i ? ' reading' : ''}${flashIndex === i ? ' flash' : ''}`}
      data-i={i}
      onClick={() => onSentenceClick(i)}
    >
      {ARTICLE.sentences[i]}
    </span>
  );

  return (
    <main
      className="article"
      id="article"
      ref={articleRef}
      onPointerMove={rulerOn ? (e) => moveRuler(e.clientY) : undefined}
      onTouchMove={rulerOn ? (e) => e.touches[0] && moveRuler(e.touches[0].clientY) : undefined}
    >
      <div className="ruler" style={{ top: rulerTop }} aria-hidden="true" />
      <div className="crumbs">
        {ARTICLE.crumbs.map((c, n) => (
          <Fragment key={c}>
            {n > 0 && <span aria-hidden="true">›</span>}
            <span>{c}</span>
          </Fragment>
        ))}
      </div>
      <h1 className="title">{ARTICLE.title}</h1>
      <p className="lede">{ARTICLE.lede}</p>
      <div className="byline">
        <img alt="" src={ARTICLE.author.avatar} />
        <div><b>{ARTICLE.author.name}</b><span>{ARTICLE.author.updated}</span></div>
      </div>
      <figure>
        <img alt={ARTICLE.image.alt} src={ARTICLE.image.src} />
        <figcaption>{ARTICLE.image.caption}</figcaption>
      </figure>

      {ARTICLE.blocks.map((b, n) => {
        if (b.type === 'ad') return <Ad key={n} id={b.id} />;
        if (b.type === 'seeAlso') return <SeeAlso key={n} text={b.text} />;
        if (b.type === 'video') return <LiveVideo key={n} />;
        return (
          <p key={n}>
            {b.sentences.map((i, k) => <Fragment key={i}>{k > 0 && ' '}{sentence(i)}</Fragment>)}
          </p>
        );
      })}

      <p className="foot-note">{ARTICLE.footNote}</p>
      <div className="help-row">
        ¿Cómo funciona Lectura fácil?{' '}
        <button type="button" className="help-link" onClick={onOpenGuide}><HelpIcon size={18} /> Ver la guía</button>
        <span aria-hidden="true"> · </span>
        <button type="button" className="help-link" onClick={() => onOpenHelp()}>Centro de ayuda</button>
        <span aria-hidden="true"> · </span>
        <button type="button" className="help-link" onClick={() => onOpenHelp('reclamaciones')}><OpenBookIcon size={22} /> Libro de Reclamaciones</button>
      </div>
      <ArticleExtras />
    </main>
  );
}
