import { CloseIcon, PauseIcon, PlayIcon, SpeakerIcon } from '../ui/Icons';

/**
 * Reproductor pequeño: aparece cuando la voz sigue sonando con el panel cerrado.
 * Permite pausar o volver a los controles sin tapar la noticia.
 */
export function MiniPlayer({ index, total, playing, onTogglePlay, onOpen, onClose }: {
  index: number; total: number; playing: boolean; onTogglePlay: () => void; onOpen: () => void; onClose: () => void;
}) {
  return (
    <div className="mini-player" role="region" aria-label="Lectura en voz alta">
      <button type="button" className="mp-play" aria-label={playing ? 'Pausar la lectura' : 'Seguir escuchando'} onClick={onTogglePlay}>
        {playing ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
      </button>
      <button type="button" className="mp-info" onClick={onOpen}>
        <SpeakerIcon size={18} waves={playing ? 2 : 1} />
        <span><b>{playing ? "Escuchando" : "En pausa"}</b> · {index + 1} de {total}</span>
        <span className="mp-more">Controles</span>
      </button>
      <button type="button" className="mp-close" aria-label="Dejar de escuchar" onClick={onClose}><CloseIcon size={20} /></button>
    </div>
  );
}
