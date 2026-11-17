import type { ArticleBlock } from '../types';

/**
 * Noticia de prueba. «El Pacífico» es un diario ficticio: solo sirve para mostrar
 * el problema de los anuncios. El rediseño es del plugin.
 */
export const SITE = {
  name: 'El Pacífico',
  date: 'Martes, 3 de noviembre de 2026',
  login: 'Inicia sesión',
  subscribe: 'Suscríbete',
  subscribeLong: 'Suscríbete por S/ 12 al mes',
  sections: ['Últimas', 'Política', 'Economía', 'Lima', 'Mundo', 'Opinión', 'Tecnología', 'Deportes', 'Luces', 'Videos'],
  currentSection: 'Economía',
  liveTopics: ['Puerto de Chancay', 'Presupuesto 2027', 'Reforma de pensiones', 'Tipo de cambio', 'Clima en Lima'],
};

export const ARTICLE = {
  crumbs: ['Economía', 'Perú'],
  title: 'Megapuerto de Chancay: MTC y APN aprueban plan vial multimodal y coordinan bypass en la Panamericana Norte',
  lede: 'El Ministerio de Transportes y la Autoridad Portuaria Nacional anunciaron el cronograma de ampliación para la conectividad logística con Lima y el Callao ante el incremento del flujo comercial transpacífico.',
  author: {
    name: 'Carlos Mendoza Ramos',
    updated: 'Actualizado el 21/10/2026, 07:40 a. m.',
    avatar: 'media/autor.jpg',
  },
  image: {
    src: 'media/chancay.jpg',
    alt: 'Grúas del puerto de Chancay frente al mar',
    caption: 'Terminal del Megapuerto de Chancay. Foto de archivo.',
  },
  /**
   * Frases de la noticia: la voz las lee una por una y el resumen enlaza con ellas.
   * Los párrafos (en «blocks») agrupan frases por su índice.
   */
  sentences: [
    // 0 · párrafo 1
    'El Ministerio de Transportes y Comunicaciones (MTC), en coordinación con la Autoridad Portuaria Nacional (APN) y el Gobierno Regional de Lima, oficializó este martes la aprobación técnica del expediente de ampliación y ordenamiento multimodal para el eje logístico Lima-Chancay-Barranca.',
    // 1 · párrafo 2
    'La iniciativa contempla la construcción prioritaria de un paso a desnivel y un bypass de cuatro carriles a la altura del kilómetro 80 de la Panamericana Norte, para separar el transporte de carga pesada que ingresa al complejo portuario del tránsito interprovincial y vehicular ligero.',
    // 2-3 · párrafo 3
    'De acuerdo con las estimaciones de los gremios aduaneros y la Cámara de Comercio de Lima, el movimiento diario proyectado superará los 3,800 camiones de alto tonelaje en hora punta cuando la segunda etapa del terminal esté operativa.',
    'Esta cifra había despertado alarmas entre las comunidades de Chancay y Peralvillo frente a posibles cuellos de botella y niveles de ruido ambiental.',
    // 4 · párrafo 4
    '«No podemos permitir que una infraestructura de escala global colapse la principal arteria de comunicación de la costa centro y norte», declaró el titular del sector ante la Comisión de Transportes del Congreso.',
    // 5-6 · párrafo 5
    'El paquete de inversiones, valorizado en más de 380 millones de soles en esta etapa vial, incluirá además un sistema de pesaje dinámico inteligente y carriles auxiliares de desaceleración.',
    'También se contemplan pasos peatonales elevados con accesibilidad universal en las zonas urbanas contiguas al viaducto subterráneo.',
    // 7 · párrafo 6
    'Los representantes del consorcio portuario ratificaron que el tránsito marítimo directo entre Chancay y los terminales de Shanghái y Ningbo se mantendrá entre 23 y 25 días, más de diez jornadas menos que las rutas que hacían escala en México o Centroamérica.',
    // 8 · párrafo 7
    'El informe del MTC fija el inicio de las licitaciones públicas de obra civil para el último trimestre del año, bajo la supervisión técnica de Ositrán y con acompañamiento de la Contraloría General de la República.',
  ],
  /** Orden de la nota: párrafos, anuncios y enlaces intercalados, como en un diario digital */
  blocks: [
    { type: 'paragraph', sentences: [0] },
    { type: 'paragraph', sentences: [1] },
    { type: 'seeAlso', text: 'Chancay: las 21 obras que acompañarán al megapuerto en su área de influencia' },
    { type: 'paragraph', sentences: [2, 3] },
    { type: 'ad', id: 'inline' },
    { type: 'paragraph', sentences: [4] },
    { type: 'paragraph', sentences: [5, 6] },
    { type: 'video' },
    { type: 'paragraph', sentences: [7] },
    { type: 'seeAlso', text: 'Ruta Chancay-Shanghái: qué productos peruanos llegan primero a Asia' },
    { type: 'paragraph', sentences: [8] },
  ] as ArticleBlock[],
  footNote: 'El Pacífico es un diario ficticio creado para probar el plugin.',
};
