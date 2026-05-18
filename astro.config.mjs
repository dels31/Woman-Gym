import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// Cek apakah sedang dijalankan di environment Vercel
const isVercel = process.env.VERCEL === "1";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: isVercel
    ? vercel()
    : node({
        mode: "standalone",
      }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["**/.env.example", "**/README.md"],
      },
    },
  },
});
