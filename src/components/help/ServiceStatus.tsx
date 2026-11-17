/** Estado del servicio (lo que prometimos en el SLA). En el prototipo es fijo. */
export function ServiceStatus() {
  return (
    <section className="hc-status" aria-labelledby="hc-status-t">
      <h3 id="hc-status-t" className="hc-h4">Estado del servicio</h3>
      <ul>
        <li><span className="hc-dot ok" aria-hidden="true" />Resumen con IA: <b>funcionando</b></li>
        <li><span className="hc-dot ok" aria-hidden="true" />Sin anuncios, Letra y Escuchar: <b>funcionando</b></li>
      </ul>
      <p className="hc-muted">Atención: lunes a viernes, de 9:00 a 18:00 (hora de Lima).</p>
    </section>
  );
}
