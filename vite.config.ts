import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';
import { imagetools } from 'vite-imagetools';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          sourcemap: mode === 'production' ? 'hidden' : true,
        },
      },
    },
    optimizeDeps: {
      exclude: ['oslo'],
    },
    plugins: [
      ...(env.SENTRY_AUTH_TOKEN
        ? [
            sentrySvelteKit({
              sourceMapsUploadOptions: {
                org: env.SENTRY_ORG,
                project: env.SENTRY_PROJECT,
                authToken: env.SENTRY_AUTH_TOKEN,
              },
            }),
          ]
        : []),
      sveltekit(),
      mkcert(),
      Icons({
        compiler: 'svelte',
        autoInstall: true,
      }),
      imagetools({
        removeMetadata: true,
      }),
    ],
    test: {
      include: ['src/**/*.{test,spec}.{js,ts}'],
    },
  };
});
