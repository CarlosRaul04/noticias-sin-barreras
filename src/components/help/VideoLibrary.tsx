import { useEffect, useRef, useState } from 'react';
import type { HelpTarget } from '../../data/help/types';
import { VIDEOS } from '../../data/help/videos';
import { SegmentedControl } from '../ui/SegmentedControl';
import { ArrowLeftIcon, PlayIcon } from '../ui/Icons';

/**
 * Carga el video completo en memoria antes de reproducirlo.
 * Algunos celulares (sobre todo iPhone) piden el video por partes y no lo reproducen
 * si el servidor no lo permite; con el archivo ya descargado funciona igual en todos.
 * Si la descarga falla, se usa la dirección directa.
 */
function useVideoSrc(file: string) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let url: string | null = null;
    let alive = true;
    fetch(file)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.blob(); })
      .then((b) => { if (!alive) return; url = URL.createObjectURL(new Blob([b], { type: 'video/mp4' })); setSrc(url); })
      .catch(() => { if (alive) setSrc(file); });
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [file]);
  return src;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

/**
 * Videotutoriales: nunca se reproducen solos, no tienen sonido (el texto en pantalla
 * es el subtítulo), se puede cambiar la velocidad y leer la transcripción.
 */
export function VideoLibrary({ id, go }: { id?: string; go: (t: HelpTarget) => void }) {
  const video = VIDEOS.find((v) => v.id === id);
  if (video) return <VideoView key={video.id} id={video.id} go={go} />;
  return (
    <div className="hc-stack">
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Videos</h3>
      <p className="hc-muted">Videos cortos, sin sonido: lo importante aparece escrito en pantalla.</p>
      <ul className="hc-videos">
        {VIDEOS.map((v) => (
          <li key={v.id}>
            <button type="button" className="hc-vcard" onClick={() => go({ section: 'videos', id: v.id })}>
              <span className="hc-vthumb">
                <img src={v.poster} alt="" />
                <span className="hc-vplay" aria-hidden="true"><PlayIcon size={22} /></span>
                <span className="hc-vdur">{fmt(v.seconds)}</span>
              </span>
              <b>{v.title}</b>
              <small>{v.summary}</small>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VideoView({ id, go }: { id: string; go: (t: HelpTarget) => void }) {
  const v = VIDEOS.find((x) => x.id === id)!;
  const ref = useRef<HTMLVideoElement>(null);
  const [rate, setRate] = useState(1);
  const src = useVideoSrc(v.file);
  const [failed, setFailed] = useState(false);
  useEffect(() => { if (ref.current) ref.current.playbackRate = rate; }, [rate]);
  return (
    <div className="hc-stack">
      <button type="button" className="hc-back" onClick={() => go({ section: 'videos' })}><ArrowLeftIcon /> Todos los videos</button>
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>{v.title}</h3>
      {src ? (
        <video ref={ref} className="hc-video" src={src} poster={v.poster} controls preload="metadata" playsInline muted
          aria-describedby={`tr-${v.id}`} onError={() => setFailed(true)}
          onLoadedMetadata={(e) => { setFailed(false); e.currentTarget.playbackRate = rate; }} />
      ) : (
        <div className="hc-video hc-video--loading" role="status">
          <img src={v.poster} alt="" />
          <span>Cargando el video…</span>
        </div>
      )}
      {failed && (
        <p className="hc-tip" role="alert">
          Este equipo no pudo reproducir el video. Puedes leer abajo lo que dice, paso a paso, o{' '}
          <a href={v.file} target="_blank" rel="noopener">abrirlo en otra pestaña</a>.
        </p>
      )}
      <div className="fld"><b>Velocidad</b>
        <SegmentedControl<number> label="Velocidad del video" options={[{ value: 0.75, label: 'Más lento' }, { value: 1, label: 'Normal' }, { value: 1.25, label: 'Más rápido' }]} value={rate} onChange={setRate} />
      </div>
      <section aria-labelledby={`trt-${v.id}`}>
        <h4 id={`trt-${v.id}`} className="hc-h4">Lo que dice el video</h4>
        <ol id={`tr-${v.id}`} className="hc-steps hc-read">
          {v.scenes.map((s) => <li key={s.text}>{s.text}</li>)}
        </ol>
      </section>
    </div>
  );
}
