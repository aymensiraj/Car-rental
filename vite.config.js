import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    viteSingleFile()
  ],
  resolve: {
    alias: {
      // had '@' kat-khallik t-importi b7al: import X from '@/components/X'
      "@": path.resolve(new URL('./src', import.meta.url).pathname),
    },
  },
});