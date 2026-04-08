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
    server: { port: 5173 }
  };
});

