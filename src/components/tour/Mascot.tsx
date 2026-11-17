/**
 * «Notín»: mascota de Noticias sin barreras.
 * Un periódico con cara, en los colores de la marca (cobalto, azul claro y marino).
 * Las animaciones son suaves y se repiten pocas veces (no en bucle) para no
 * competir con la lectura; se apagan si el sistema pide reducir el movimiento.
 */
export function Mascot({ className = '', waving = false, animateIn = false, cheer = false }: {
  className?: string;
  /** Saluda con la mano (3 veces) */
  waving?: boolean;
  /** Entrada suave al aparecer */
  animateIn?: boolean;
  /** Celebración final: ojos felices */
  cheer?: boolean;
}) {
  return (
  <svg
    viewBox="0 0 170 176"
    className={`notin ${className} ${animateIn ? 'notin-in' : ''}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* sombra */}
    <ellipse cx="82" cy="168" rx="44" ry="5" fill="#14213D" opacity="0.12" />

    {/* líneas de velocidad (como en el logo) */}
    <g stroke="#1F5BD8" strokeWidth="5" strokeLinecap="round" opacity="0.9">
      <line x1="6" y1="58" x2="22" y2="58" />
      <line x1="2" y1="74" x2="22" y2="74" />
      <line x1="10" y1="90" x2="22" y2="90" />
    </g>

    {/* piernas */}
    <g stroke="#14213D" strokeWidth="5" strokeLinecap="round">
      <line x1="66" y1="146" x2="62" y2="160" />
      <line x1="98" y1="146" x2="102" y2="160" />
    </g>
    <ellipse cx="58" cy="162" rx="9" ry="5" fill="#14213D" />
    <ellipse cx="106" cy="162" rx="9" ry="5" fill="#14213D" />

    {/* brazo izquierdo, en reposo */}
    <path d="M32 100 Q20 110 20 124" fill="none" stroke="#14213D" strokeWidth="5" strokeLinecap="round" />
    <circle cx="20" cy="127" r="7" fill="#E8EFFC" stroke="#14213D" strokeWidth="4" />

    {/* brazo derecho: saluda */}
    <g className={waving ? 'notin-wave' : ''}>
      <path d="M132 96 Q148 84 150 64" fill="none" stroke="#14213D" strokeWidth="5" strokeLinecap="round" />
      <circle cx="150" cy="60" r="8" fill="#E8EFFC" stroke="#14213D" strokeWidth="4" />
    </g>

    {/* cuerpo: la página del periódico */}
    <rect x="32" y="20" width="100" height="128" rx="16" fill="#FFFFFF" stroke="#14213D" strokeWidth="4.5" />
    {/* esquina doblada */}
    <path d="M110 20 L132 20 Q132 20 132 22 L132 42 Q120 40 112 32 Q110 26 110 20 Z" fill="#E8EFFC" stroke="#14213D" strokeWidth="3.5" strokeLinejoin="round" />
    {/* cabecera del diario */}
    <rect x="44" y="32" width="58" height="13" rx="5" fill="#1F5BD8" />

    {/* ojos */}
    {cheer ? (
      <g fill="none" stroke="#14213D" strokeWidth="5" strokeLinecap="round">
        <path d="M58 80 Q65 72 72 80" />
        <path d="M92 80 Q99 72 106 80" />
      </g>
    ) : (
      <g className="notin-blink">
        <ellipse cx="65" cy="78" rx="7" ry="8" fill="#14213D" />
        <ellipse cx="99" cy="78" rx="7" ry="8" fill="#14213D" />
        <circle cx="67.5" cy="75" r="2.4" fill="#FFFFFF" />
        <circle cx="101.5" cy="75" r="2.4" fill="#FFFFFF" />
      </g>
    )}
    {/* mejillas */}
    <circle cx="54" cy="94" r="6" fill="#F4A9B8" opacity="0.75" />
    <circle cx="110" cy="94" r="6" fill="#F4A9B8" opacity="0.75" />
    {/* sonrisa */}
    <path d="M70 94 Q82 108 94 94" fill="#14213D" stroke="#14213D" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M76 100 Q82 104 88 100" fill="#F47B8E" />

    {/* renglones de la noticia */}
    <g fill="#C9D8F7">
      <rect x="44" y="116" width="76" height="6" rx="3" />
      <rect x="44" y="128" width="54" height="6" rx="3" />
    </g>
  </svg>
  );
}
