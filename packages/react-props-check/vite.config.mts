import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import macrosPlugin from 'vite-plugin-babel-macros';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  plugins: [react(), macrosPlugin(), viteTsconfigPaths()],
  build: {
    minify: false,
    lib: {
      entry: resolve('src', 'index.ts'),
      name: 'react-props-check',
      fileName: (_format, name) => `${name}.js`
    },
    rollupOptions: {
      output: [
        {
          dir: 'dist/esm',
          format: 'esm',
          preserveModules: true,
          preserveModulesRoot: 'src'
        },
        {
          dir: 'dist/cjs',
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: 'src'
        }
      ],
      external: [
        /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!),
        'react/jsx-runtime'
      ]
    }
  }
}));
