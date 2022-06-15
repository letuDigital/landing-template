import { LANDING_NAME } from './config/appConfig';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const htmlCode = readFileSync(resolve(__dirname, './src', `${LANDING_NAME}.html`));

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: false,
      inject: {
        data: {
          htmlCode,
          cssCode: '',
        },
      },
    }),
  ],
});
