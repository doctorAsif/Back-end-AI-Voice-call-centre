import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const setupPath = join(__dirname, 'vitest.setup.ts');
export default defineConfig({
  // Note: No Vite plugins required for basic component tests.
  test: {
    include: ['__tests__/**'],
    exclude: ['e2e/**', 'node_modules/**'],
    environment: 'jsdom',
  setupFiles: [setupPath],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 70,
        statements: 70,
        branches: 50,
        functions: 60
      }
    }
  },
  resolve: {
    alias: [
      {
        find: /\.(jpeg|jpg|png|gif|webp|svg)$/,
        replacement: join(__dirname, 'src/fileMock.js'),
      },
    ],
  },
});
