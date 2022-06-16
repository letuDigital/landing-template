import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import liveReload from 'vite-plugin-live-reload';
import availableColors from './scripts/availableColors';
import { LANDING_NAME } from './config/appConfig';

export default defineConfig({
  build: {
    outDir: `build/${LANDING_NAME}`,
    publicDir: 'public',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return `common/img/uploaded/products/${LANDING_NAME}/[name].[ext]`;
          }
          return '[name][extname]';
        },
        manualChunks(id) {
          if (id.includes('content.css')) {
            return 'content';
          }
        },
      },
    },
  },

  plugins: [
    /**
     * We must use handlebars and liveReload to correct working HML after partial change
     * vite-plugin-html isn`t works as expected
     */
    handlebars({
      reloadOnPartialChange: true,
      partialDirectory: resolve(__dirname, './src', LANDING_NAME),
      context: {
        dist: 'public/common/img/uploaded/products',
        colors: availableColors,
      },
    }),
    liveReload(resolve(__dirname, 'src/**/*'), { alwaysReload: true }),
  ],
});
