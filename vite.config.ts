import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: ((): PluginOption[] => {
        const base: PluginOption[] = [react()];
        if (process.env['ANALYZE']) {
          base.push(visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, open: false }) as unknown as PluginOption);
        }
        return base;
      })(),
      define: {
        'process.env.API_KEY': JSON.stringify(env['GEMINI_API_KEY']),
        'process.env.GEMINI_API_KEY': JSON.stringify(env['GEMINI_API_KEY'])
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
