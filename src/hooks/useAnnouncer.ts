import { useCallback, useState } from 'react';

/** Mensajes para lectores de pantalla (región aria-live) */
export function useAnnouncer() {
  const [message, setMessage] = useState('');
  const announce = useCallback((msg: string) => {
    setMessage('');
    window.setTimeout(() => setMessage(msg), 50);
  }, []);
  return { message, announce };
}
