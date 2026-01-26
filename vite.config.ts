import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,      // Porta fixa do Front
    strictPort: true, // Se a 5173 estiver ocupada, ele avisa em vez de tentar outra
    hmr: {
      port: 5173,     // Força o WebSocket na mesma porta
    },
    // IMPORTANTE: Removemos qualquer configuração de 'proxy' aqui
  }
})