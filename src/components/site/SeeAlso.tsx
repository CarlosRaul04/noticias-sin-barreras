/** Enlace «MIRA AQUÍ» dentro de la nota (se oculta con «Ocultar otras noticias») */
export function SeeAlso({ text }: { text: string }) {
  return (
    <p className="mira">
      <strong>MIRA AQUÍ:</strong>{' '}
      <a href="#" onClick={(e) => e.preventDefault()}>{text}</a>
    </p>
  );
}
