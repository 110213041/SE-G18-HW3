import { defineConfig } from "vite";
import vue from "npm:@vitejs/plugin-vue@^4.2.3";

import "vue";
import "vue-router";

export default defineConfig({
  plugins: [vue()],
  root: "./src/client",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    host: "127.0.0.1",
  },
});
