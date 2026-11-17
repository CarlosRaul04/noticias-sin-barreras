/** Interruptor con etiqueta y descripción (fila de «Leer sin distracciones») */
export function Switch({ label, hint, checked, onChange }: {
  label: string; hint: string; checked: boolean; onChange: () => void;
}) {
  return (
    <div className="sw">
      <div className="lbl"><b>{label}</b><span>{hint}</span></div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} />
    </div>
  );
}
