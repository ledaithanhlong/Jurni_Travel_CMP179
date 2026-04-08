import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig(async () => {
  let reactPlugin = null;
  try {
    const mod = await import('@vitejs/plugin-react');
    reactPlugin = mod.default;
  } catch (e) {
    // plugin not installed; start without it
  }
  return {
    plugins: reactPlugin ? [reactPlugin()] : [],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: { port: 5173 }
  };
});

