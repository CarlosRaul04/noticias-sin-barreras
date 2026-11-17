import type { FontId, PaletteId, PresetId, ReadingSettings } from '../../../types';
import { FONTS, LINE_HEIGHTS, PALETTES, PRESETS, PREVIEW_TEXT, TEXT_SIZE } from '../../../data/readingOptions';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { MoreOptions } from '../../ui/MoreOptions';
import { ResetIcon } from '../../ui/Icons';
import { Pane } from './Pane';

interface Props {
  visible: boolean;
  settings: ReadingSettings;
  activePreset: PresetId | null;
  onUpdate: (patch: Partial<ReadingSettings>) => void;
  onPreset: (id: PresetId) => void;
  onReset: () => void;
  onClose: () => void;
  onHelp: () => void;
}

/** Letra y color: primero combinaciones listas y tamaño; lo demás en «Más opciones» */
export function TextStylePane({ visible, settings, activePreset, onUpdate, onPreset, onReset, onClose, onHelp }: Props) {
  return (
    <Pane id="letra" visible={visible} onClose={onClose} onHelp={onHelp}>
      <div className="pv" aria-hidden="true">{PREVIEW_TEXT}</div>

      <div className="fld"><b>Combinaciones listas</b>
        <div className="presets" role="group" aria-label="Combinaciones listas">
          {(Object.keys(PRESETS) as PresetId[]).map((id) => {
            const p = PRESETS[id];
            return (
              <button
                key={id}
                className="preset"
                type="button"
                aria-pressed={activePreset === id}
                onClick={() => onPreset(id)}
                style={{ background: p.swatch.bg, color: p.swatch.ink, borderColor: id === 'noche' ? p.swatch.bg : undefined }}
              >
                <span className="aa" style={{ fontFamily: p.swatch.font }}>Aa</span>
                <span className="nm">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fld"><b>Tamaño del texto</b>
        <div className="slider">
          <span className="a1" aria-hidden="true">A</span>
          <input
            type="range" min={TEXT_SIZE.min} max={TEXT_SIZE.max} step={TEXT_SIZE.step} value={settings.size}
            aria-label="Tamaño del texto" aria-valuetext={`${settings.size} píxeles`}
            onChange={(e) => onUpdate({ size: Number(e.target.value) })}
          />
          <span className="a2" aria-hidden="true">A</span>
        </div>
      </div>

      <MoreOptions summary="Más opciones: tipo de letra, interlineado, fondo">
        <div className="more-body">
          <div className="fld"><b>Tipo de letra</b>
            <SegmentedControl<FontId>
              label="Tipo de letra" className="seg--grid2"
              options={(Object.keys(FONTS) as FontId[]).map((f) => ({ value: f, label: FONTS[f].label }))}
              value={settings.font} onChange={(font) => onUpdate({ font })}
            />
          </div>
          <div className="fld"><b>Interlineado</b>
            <SegmentedControl<number>
              label="Interlineado"
              options={LINE_HEIGHTS.map((l) => ({ value: l, label: String(l) }))}
              value={settings.lh} onChange={(lh) => onUpdate({ lh })}
            />
          </div>
          <div className="fld"><b>Fondo</b>
            <div className="pal" role="group" aria-label="Fondo">
              {(Object.keys(PALETTES) as PaletteId[]).map((c) => {
                const [bg, ink] = PALETTES[c].colors;
                return (
                  <button key={c} type="button" aria-pressed={settings.pal === c} onClick={() => onUpdate({ pal: c })}
                    style={{ background: bg, color: c === 'noche' ? ink : undefined }}>
                    {PALETTES[c].label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </MoreOptions>

      <button className="btn" type="button" onClick={onReset}><ResetIcon />Restablecer letra y color</button>
    </Pane>
  );
}
