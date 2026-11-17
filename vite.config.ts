import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base './' para que el build funcione abierto desde cualquier carpeta o publicado como artefacto
export default defineConfig({
  base: './',
  plugins: [react()],
});
