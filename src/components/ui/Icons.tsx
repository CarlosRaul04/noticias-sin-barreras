import type { SVGProps } from 'react';

/** Íconos del prototipo (los mismos trazos de la versión 3.0). Todos son decorativos: aria-hidden. */
type P = SVGProps<SVGSVGElement> & { size?: number };
const stroke = (size: number, sw = 2) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true,
});

export const MenuIcon = ({ size = 24, ...p }: P) => <svg {...stroke(size)} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const CloseIcon = ({ size = 24, ...p }: P) => <svg {...stroke(size)} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const SparkleIcon = ({ size = 24, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M19 15l.7 1.8L21.5 17.5l-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" />
  </svg>
);
export const EyeIcon = ({ size = 24, ...p }: P) => (
  <svg {...stroke(size)} {...p}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const SpeakerIcon = ({ size = 24, waves = 2, ...p }: P & { waves?: 1 | 2 }) => (
  <svg {...stroke(size)} {...p}>
    <path d="M11 5L6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" />
    {waves === 2 && <path d="M19 5a10 10 0 0 1 0 14" />}
  </svg>
);
export const ResetIcon = ({ size = 20, ...p }: P) => (
  <svg {...stroke(size)} {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
);
export const ChevronLeftIcon = ({ size = 22, ...p }: P) => <svg {...stroke(size, 2.2)} {...p}><path d="M15 18l-6-6 6-6" /></svg>;
export const ChevronRightIcon = ({ size = 22, ...p }: P) => <svg {...stroke(size, 2.2)} {...p}><path d="M9 18l6-6-6-6" /></svg>;
export const CheckIcon = ({ size = 20, ...p }: P) => <svg {...stroke(size, 2.4)} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const HelpIcon = ({ size = 22, ...p }: P) => (
  <svg {...stroke(size)} {...p}><circle cx="12" cy="12" r="9.5" /><path d="M9.5 9.3a2.6 2.6 0 0 1 5 1c0 1.8-2.5 2.2-2.5 3.9" /><path d="M12 17.2h.01" /></svg>
);
export const PlayIcon = ({ size = 28, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M7 4l13 8-13 8z" /></svg>
);
export const StopIcon = ({ size = 20, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
);
export const PauseIcon = ({ size = 28, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <rect x="6" y="4" width="4.5" height="16" rx="1" /><rect x="13.5" y="4" width="4.5" height="16" rx="1" />
  </svg>
);

/* ---------- Íconos del Centro de ayuda ---------- */
export const HomeIcon = ({ size = 22, ...p }: P) => <svg {...stroke(size)} {...p}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>;
export const BookIcon = ({ size = 22, ...p }: P) => <svg {...stroke(size)} {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /><path d="M8 7h7M8 11h7" /></svg>;
export const VideoIcon = ({ size = 22, ...p }: P) => <svg {...stroke(size)} {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9l5 3-5 3z" /></svg>;
export const UsersIcon = ({ size = 22, ...p }: P) => <svg {...stroke(size)} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5" /><path d="M16 4.5a3 3 0 0 1 0 6" /><path d="M18 14c1.6.6 2.7 2.2 3 5" /></svg>;
export const MailIcon = ({ size = 22, ...p }: P) => <svg {...stroke(size)} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7l8 6 8-6" /></svg>;
export const SearchIcon = ({ size = 20, ...p }: P) => <svg {...stroke(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
export const FlagIcon = ({ size = 20, ...p }: P) => <svg {...stroke(size)} {...p}><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></svg>;
export const ClockIcon = ({ size = 20, ...p }: P) => <svg {...stroke(size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const ArrowLeftIcon = ({ size = 20, ...p }: P) => <svg {...stroke(size, 2.2)} {...p}><path d="M19 12H5" /><path d="M11 18l-6-6 6-6" /></svg>;
export const ChevronDownIcon = ({ size = 20, ...p }: P) => <svg {...stroke(size, 2.2)} {...p}><path d="M6 9l6 6 6-6" /></svg>;
/** Libro abierto del aviso «Libro de Reclamaciones» */
export const OpenBookIcon = ({ size = 40, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" {...p}>
    <path d="M24 12c-4-3-10-4-18-3v26c8-1 14 0 18 3 4-3 10-4 18-3V9c-8-1-14 0-18 3z" fill="#fff" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
    <path d="M24 12v26" stroke="currentColor" strokeWidth="2.6" />
    <path d="M11 16c3-.4 6 0 9 1.4M11 22c3-.4 6 0 9 1.4M11 28c3-.4 6 0 9 1.4M28 17.4c3-1.4 6-1.8 9-1.4M28 23.4c3-1.4 6-1.8 9-1.4M28 29.4c3-1.4 6-1.8 9-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
