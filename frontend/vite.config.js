import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const clerkKey = env.VITE_CLERK_PUBLISHABLE_KEY;
  const hasClerk = Boolean(clerkKey && clerkKey !== 'your_clerk_publishable_key');

  let reactPlugin = null;
  try {
    const mod = await import('@vitejs/plugin-react');
    reactPlugin = mod.default;
  } catch (e) {
    // plugin not installed; start without it
  }
  
  const alias = {};
  if (!hasClerk) {
    alias['@clerk/clerk-react'] = path.resolve(__dirname, './src/lib/clerkShim.jsx');
  }

  return {
    plugins: reactPlugin ? [reactPlugin()] : [],
    server: { port: 5173 },
    resolve: { alias }
  };
});

