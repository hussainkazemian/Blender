import { defineConfig } from 'vite';

// Vite config with correct base handling for subfolder deploys
// Set base to the public path you serve the app from in production.
// Example: if deployed at https://example.com/~hussaink/blender/ then base should be '/~hussaink/blender/'.
export default defineConfig(({ command }) => {
  const isProd = command === 'build';
  return {
    // here you can change all root/build destinations. NOTE the base needed!
    root: '',
    base: isProd ? '/~hussaink/blender/' : '/',
    build: {
      outDir: 'dist',
      target: 'esnext',
    },
  };
});
