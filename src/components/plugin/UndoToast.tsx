/** Aviso para deshacer «Restablecer letra y color» (dura 10 segundos) */
export function UndoToast({ message, onUndo }: { message: string; onUndo: () => void }) {
  return (
    <div className="toast" role="status">
      <span>{message}</span>
      <button type="button" onClick={onUndo}>Deshacer</button>
    </div>
  );
}
