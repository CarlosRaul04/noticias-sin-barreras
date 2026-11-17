import { Fragment, useState, type ReactNode } from 'react';
import { todayLabel, useStoredState } from '../../hooks/useStoredState';
import { OpenBookIcon } from '../ui/Icons';
import { useShowFromTop } from './ContactHub';
import { DraftNote, ErrorSummary, RadioCards, SelectField, TextArea, TextField } from '../ui/FormFields';

/**
 * Libro de Reclamaciones virtual (Código de Protección y Defensa del Consumidor, Ley 29571, art. 150,
 * y su Reglamento DS 011-2011-PCM modificado por DS 101-2022-PCM).
 * - Hoja con numeración correlativa, fecha y datos del proveedor.
 * - Respuesta por correo o domicilio: se pide solo uno de los dos, el que elija la persona.
 * - Distingue reclamo y queja. Plazo de respuesta: 15 días hábiles improrrogables.
 * - Al enviar se muestra la constancia (copia de la hoja) de inmediato.
 * Prototipo académico: la hoja se guarda solo en este navegador.
 */
interface Claim {
  name: string; docType: string; docNum: string; minor: string; parent: string;
  replyBy: string; email: string; address: string; phone: string;
  good: string; amount: string; goodDesc: string;
  type: string; detail: string; request: string;
}
interface SavedClaim extends Claim { number: string; date: string; }

const EMPTY: Claim = { name: '', docType: '', docNum: '', minor: 'no', parent: '', replyBy: '', email: '', address: '', phone: '', good: 'servicio', amount: '', goodDesc: '', type: '', detail: '', request: '' };

const PROVIDER = {
  name: 'Noticias sin barreras (prototipo académico)',
  ruc: 'Por registrar',
  address: 'Proyecto del curso Interacción Humano Computador · USIL, Lima, Perú',
};

export function ClaimBook({ back }: { back: ReactNode }) {
  const [f, setF, reset] = useStoredState<Claim>('borrador-reclamo', EMPTY);
  const [sheets, setSheets] = useStoredState<SavedClaim[]>('reclamos', []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<SavedClaim | null>(null);
  const set = (k: keyof Claim) => (v: string) => setF({ ...f, [k]: v });
  const nextNumber = `${String(sheets.length + 1).padStart(9, '0')}-${new Date().getFullYear()}`;

  if (done) return <Constancia back={back} c={done} />;

  const submit = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 3) e['lr-name'] = 'Escribe tu nombre completo.';
    if (!f.docType) e['lr-doctype'] = 'Elige el tipo de documento.';
    if (f.docNum.trim().length < 6) e['lr-docnum'] = 'Escribe el número de tu documento.';
    if (f.minor === 'si' && f.parent.trim().length < 3) e['lr-parent'] = 'Escribe el nombre de tu madre, padre o apoderado.';
    if (!f.replyBy) e['lr-reply'] = 'Elige cómo quieres recibir la respuesta.';
    if (f.replyBy === 'correo' && !/^\S+@\S+\.\S+$/.test(f.email)) e['lr-email'] = 'Escribe un correo con la forma nombre@correo.com.';
    if (f.replyBy === 'domicilio' && f.address.trim().length < 8) e['lr-address'] = 'Escribe tu dirección completa (calle, número y distrito).';
    if (!f.type) e['lr-type'] = 'Elige si es un reclamo o una queja.';
    if (f.detail.trim().length < 15) e['lr-detail'] = 'Cuéntanos qué pasó (al menos 15 letras).';
    if (f.request.trim().length < 5) e['lr-request'] = 'Cuéntanos qué solución esperas.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const c: SavedClaim = { ...f, number: nextNumber, date: todayLabel() };
    setSheets([...sheets, c]); reset(); setDone(c);
  };

  return (
    <form className="hc-stack" noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }}>
      {back}
      <header className="lr-head">
        <OpenBookIcon size={52} />
        <div>
          <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Libro de Reclamaciones</h3>
          <p className="hc-muted">Hoja de reclamación N.° {nextNumber} · {todayLabel()}</p>
        </div>
      </header>
      <p className="lr-legal">Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, este establecimiento cuenta con un Libro de Reclamaciones a tu disposición.</p>

      <section className="lr-box" aria-labelledby="lr-prov">
        <h4 id="lr-prov" className="hc-h4">1. Datos del proveedor</h4>
        <dl className="lr-dl">
          <dt>Razón social</dt><dd>{PROVIDER.name}</dd>
          <dt>RUC</dt><dd>{PROVIDER.ruc}</dd>
          <dt>Dirección</dt><dd>{PROVIDER.address}</dd>
        </dl>
      </section>

      <ErrorSummary errors={errors} />

      <fieldset className="lr-box">
        <legend className="hc-h4">2. Tus datos</legend>
        <TextField id="lr-name" label="Nombre completo" required autoComplete="name" value={f.name} onChange={set('name')} error={errors['lr-name']} />
        <div className="lr-row">
          <SelectField id="lr-doctype" label="Tipo de documento" required value={f.docType} onChange={set('docType')} error={errors['lr-doctype']} options={[
            { value: 'DNI', label: 'DNI' }, { value: 'CE', label: 'Carné de extranjería' }, { value: 'Pasaporte', label: 'Pasaporte' }, { value: 'RUC', label: 'RUC' },
          ]} />
          <TextField id="lr-docnum" label="Número de documento" required inputMode="numeric" value={f.docNum} onChange={set('docNum')} error={errors['lr-docnum']} />
        </div>
        <RadioCards id="lr-minor" label="¿Eres menor de edad?" required value={f.minor} onChange={set('minor')} options={[
          { value: 'no', label: 'No' }, { value: 'si', label: 'Sí', desc: 'Tu madre, padre o apoderado figura en la hoja.' },
        ]} />
        {f.minor === 'si' && <TextField id="lr-parent" label="Nombre de tu madre, padre o apoderado" required value={f.parent} onChange={set('parent')} error={errors['lr-parent']} />}
        <RadioCards id="lr-reply" label="¿Cómo quieres recibir la respuesta?" required value={f.replyBy} onChange={set('replyBy')} error={errors['lr-reply']} options={[
          { value: 'correo', label: 'Por correo electrónico', desc: 'Es lo más rápido.' },
          { value: 'domicilio', label: 'En mi domicilio', desc: 'Por carta a tu dirección.' },
        ]} />
        {f.replyBy === 'correo' && <TextField id="lr-email" label="Correo electrónico" type="email" inputMode="email" autoComplete="email" required value={f.email} onChange={set('email')} error={errors['lr-email']} />}
        {f.replyBy === 'domicilio' && <TextField id="lr-address" label="Dirección" required autoComplete="street-address" value={f.address} onChange={set('address')} error={errors['lr-address']} />}
        <TextField id="lr-phone" label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} />
      </fieldset>

      <fieldset className="lr-box">
        <legend className="hc-h4">3. Lo que contrataste</legend>
        <RadioCards id="lr-good" label="¿Es un producto o un servicio?" required value={f.good} onChange={set('good')} options={[
          { value: 'servicio', label: 'Servicio', desc: 'Por ejemplo, el plugin o el soporte.' }, { value: 'producto', label: 'Producto' },
        ]} />
        <TextField id="lr-amount" label="Monto reclamado (S/)" hint="Déjalo vacío si no pagaste nada." inputMode="decimal" value={f.amount} onChange={set('amount')} />
        <TextArea id="lr-gooddesc" label="Descripción" hint="Por ejemplo: «La herramienta Resumir del plugin»." rows={2} value={f.goodDesc} onChange={set('goodDesc')} />
      </fieldset>

      <fieldset className="lr-box">
        <legend className="hc-h4">4. Tu reclamo o queja</legend>
        <RadioCards id="lr-type" label="Tipo" required value={f.type} onChange={set('type')} error={errors['lr-type']} options={[
          { value: 'Reclamo', label: 'Reclamo', desc: 'No estás de acuerdo con el producto o servicio que recibiste.' },
          { value: 'Queja', label: 'Queja', desc: 'No estás de acuerdo con la atención, aunque no tenga que ver con el producto o servicio.' },
        ]} />
        <TextArea id="lr-detail" label="¿Qué pasó?" required value={f.detail} onChange={set('detail')} error={errors['lr-detail']} />
        <TextArea id="lr-request" label="¿Qué solución esperas?" required rows={2} value={f.request} onChange={set('request')} error={errors['lr-request']} />
      </fieldset>

      <section className="lr-box lr-box--muted" aria-labelledby="lr-resp">
        <h4 id="lr-resp" className="hc-h4">5. Acciones del proveedor</h4>
        <p className="hc-muted">Este espacio lo llena el equipo de Noticias sin barreras cuando responda.</p>
      </section>

      <ul className="lr-notes">
        <li>Te responderemos en un plazo máximo de <b>15 días hábiles</b>, que no se pueden ampliar.</li>
        <li>Presentar un reclamo no impide acudir a otras vías de solución ni es requisito para presentar una denuncia ante el Indecopi.</li>
        <li>Al enviar recibirás una copia de esta hoja.</li>
      </ul>
      <DraftNote />
      <button type="submit" className="btn primary">Enviar hoja de reclamación</button>
      <p className="hc-tip">Prototipo académico: la hoja se guarda solo en este equipo y no llega al Indecopi ni a ninguna persona.</p>
    </form>
  );
}

function Constancia({ back, c }: { back: ReactNode; c: SavedClaim }) {
  const [copied, setCopied] = useState(false);
  useShowFromTop();
  const rows: [string, string][] = [
    ['Hoja N.°', c.number], ['Fecha', c.date], ['Proveedor', PROVIDER.name],
    ['Nombre', c.name], ['Documento', `${c.docType} ${c.docNum}`],
    ...(c.minor === 'si' ? [['Apoderado', c.parent] as [string, string]] : []),
    ['Respuesta por', c.replyBy === 'correo' ? `Correo: ${c.email}` : `Domicilio: ${c.address}`],
    ...(c.phone ? [['Teléfono', c.phone] as [string, string]] : []),
    ['Bien contratado', `${c.good === 'servicio' ? 'Servicio' : 'Producto'}${c.amount ? ` · S/ ${c.amount}` : ''}${c.goodDesc ? ` · ${c.goodDesc}` : ''}`],
    ['Tipo', c.type], ['Detalle', c.detail], ['Pedido', c.request],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  return (
    <div className="hc-stack">
      {back}
      <div className="hc-done" role="status">
        <OpenBookIcon size={52} />
        <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Registramos tu {c.type.toLowerCase()}</h3>
        <p>Número de hoja</p>
        <p className="hc-case">{c.number}</p>
        <p>Te responderemos en máximo 15 días hábiles.</p>
      </div>
      <section className="lr-box" aria-labelledby="lr-copy">
        <h4 id="lr-copy" className="hc-h4">Tu copia de la hoja</h4>
        <dl className="lr-dl">{rows.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
      </section>
      <div className="hc-actions">
        <button type="button" className="btn" onClick={async () => {
          try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); }
        }}>{copied ? 'Copia guardada en el portapapeles' : 'Copiar la hoja'}</button>
        <button type="button" className="btn" onClick={() => { try { window.print(); } catch { /* sin impresión */ } }}>Imprimir</button>
      </div>
      <p className="hc-tip">Prototipo académico: en el servicio real, esta copia también llegaría a tu correo.</p>
    </div>
  );
}
