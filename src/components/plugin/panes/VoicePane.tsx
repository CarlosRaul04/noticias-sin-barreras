import { VOICE_SPEEDS } from '../../../data/readingOptions';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '../../ui/Icons';
import { Pane } from './Pane';

interface Props {
  visible: boolean;
  index: number;
  total: number;
  playing: boolean;
  progress: number;
  speedIndex: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeed: (i: number) => void;
  onClose: () => void;
  onHelp: () => void;
}

/** Escuchar la nota: la frase que suena se resalta en la noticia */
export function VoicePane(p: Props) {
  return (
    <Pane id="voz" visible={p.visible} onClose={p.onClose} onHelp={p.onHelp}>
      <div className="player">
        <div className="pl-top">
          <button className="small-round" type="button" aria-label="Frase anterior" onClick={p.onPrev}><ChevronLeftIcon /></button>
          <button className="round" type="button" aria-label={p.playing ? 'Pausar' : 'Reproducir'} onClick={p.onTogglePlay}>
            {p.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="small-round" type="button" aria-label="Frase siguiente" onClick={p.onNext}><ChevronRightIcon /></button>
          <div className="pl-meta pl-meta--right">Frase {p.index + 1} de {p.total}</div>
        </div>
        <div className="prog" aria-hidden="true"><i style={{ width: `${p.progress}%` }} /></div>
        <div className="fld"><b>Velocidad</b>
          <SegmentedControl<number>
            label="Velocidad"
            options={VOICE_SPEEDS.map((s, i) => ({ value: i, label: s.label }))}
            value={p.speedIndex} onChange={p.onSpeed}
          />
        </div>
        <p className="pl-meta pl-meta--hint">Toca cualquier frase de la noticia para empezar desde ahí.</p>
      </div>
    </Pane>
  );
}
