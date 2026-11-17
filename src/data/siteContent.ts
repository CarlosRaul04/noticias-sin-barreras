/**
 * Elementos del diario que compiten por la atención: anuncios, video, listas y enlaces.
 * Imitan la estructura de las notas de los diarios digitales peruanos (El Comercio, La República,
 * Gestión). Todas las marcas son ficticias.
 */

export type AdId = 'billboard' | 'inline' | 'box' | 'tall' | 'anchor';

export interface AdData {
  brand: string;
  initials: string;
  title: string;
  text: string;
  cta: string;
  /** colores del anunciante: fondo, texto, botón */
  colors: { bg: string; ink: string; cta: string; ctaInk: string };
  emoji?: string;
}

export const ADS: Record<AdId, AdData> = {
  billboard: {
    brand: 'Banco Andino', initials: 'BA', title: 'Préstamo para tu negocio desde 8.9 % TEA',
    text: 'Evaluación en 24 horas, 100 % digital', cta: 'Solicítalo hoy',
    colors: { bg: '#0E6B4F', ink: '#FFFFFF', cta: '#FBD24A', ctaInk: '#3A2A00' },
  },
  inline: {
    brand: 'Kuntur Móvil', initials: 'KM', title: 'Cámbiate a 5G: 50 % de descuento por 6 meses',
    text: 'Portabilidad en minutos y sin papeleo', cta: 'Quiero mi chip',
    colors: { bg: '#4B1D8F', ink: '#FFFFFF', cta: '#FF5DA2', ctaInk: '#FFFFFF' },
  },
  box: {
    brand: 'Inversiones Huáscar', initials: 'IH', title: '6.5 %',
    text: 'TREA en soles a 360 días', cta: 'Simular mis ahorros',
    colors: { bg: '#7A3E00', ink: '#FFFFFF', cta: '#FFFFFF', ctaInk: '#7A3E00' },
  },
  tall: {
    brand: 'Yaku', initials: 'Y', title: '¿Hambre?', emoji: '🛵',
    text: 'Tu primer pedido con envío gratis en Yaku.', cta: 'Pedir ahora',
    colors: { bg: '#A3123A', ink: '#FFFFFF', cta: '#FFFFFF', ctaInk: '#A3123A' },
  },
  anchor: {
    brand: 'Banco Andino', initials: 'BA', title: 'Cuenta sueldo sin mantenimiento',
    text: 'Ábrela gratis desde tu celular', cta: 'Abrir',
    colors: { bg: '#FFFFFF', ink: '#14213D', cta: '#0E6B4F', ctaInk: '#FFFFFF' },
  },
};

export const LIVE_VIDEO = {
  poster: 'media/poster.jpg',
  tag: 'EN VIVO',
  title: 'EN VIVO: Debate en el Pleno sobre reforma de pensiones y presupuesto 2027',
  note: '4.2 mil personas viendo ahora',
};

export const MOST_VIEWED = [
  'Tipo de cambio hoy: así cerró el dólar en el mercado peruano',
  'Gratificación de diciembre: quiénes la reciben y cuándo se paga',
  'Corredor vial Lima–Chancay: las rutas alternas mientras duren las obras',
  'Clima en Lima: Senamhi anuncia mañanas frías hasta fin de mes',
  'Exportaciones a Asia crecen 18 % en el tercer trimestre',
];

export const RELATED = [
  { section: 'Economía', title: 'Chancay ya movió US$ 3,600 millones en carga durante su primer año' },
  { section: 'Lima', title: 'Panamericana Norte: estos son los desvíos por obras en Huaral' },
  { section: 'Perú', title: 'Huacho y Barranca preparan sus planes urbanos ante el crecimiento del puerto' },
];

export const SPONSORED = [
  { sponsor: 'Tarjetas Inti', title: 'Las 5 tarjetas de crédito peruanas que acumulan más millas en 2026' },
  { sponsor: 'Inmobiliaria Costa Norte', title: 'Departamentos en preventa frente al mar en Huacho desde $45,000' },
  { sponsor: 'Seguros Pachacútec', title: '¿Tu auto está protegido? Compara 4 seguros en 2 minutos' },
];

export const TAGS = ['Puerto de Chancay', 'MTC', 'Panamericana Norte', 'APN', 'Infraestructura'];
