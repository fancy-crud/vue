import { defineConfig } from "vite";
import path from "path";

import domJsx from 'vite-plugin-vue-jsx'

export default defineConfig({
  plugins: [
    domJsx({
      // pragma: string, // jsxFactory function
      // include: RegExp[] // include file
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
