import { LIVE_VIDEO } from '../../data/siteContent';

/** Video en vivo dentro de la nota (se oculta con «Ocultar video») */
export function LiveVideo() {
  return (
    <div className="video-block">
      <div className="video" aria-label="Video en vivo del Congreso">
        <img alt="" src={LIVE_VIDEO.poster} />
        <span className="tag">{LIVE_VIDEO.tag}</span>
        <span className="play">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#14213D" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>
        </span>
      </div>
      <p className="video-cap"><b>{LIVE_VIDEO.title}</b><span>{LIVE_VIDEO.note}</span></p>
    </div>
  );
}
