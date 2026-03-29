import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({ 
  plugins: [
    tailwindcss(), 
    sveltekit(),
    SvelteKitPWA({
      registerType: "autoUpdate",
      manifest: {
        name: "CostCompare",
        short_name: "CostCompare",
        description: "Compare prices in warehouses easily",
        theme_color: "#2B4162",
        background_color: "#F9F9F7",
        display: "standalone",
        icons: []
      }
    })
  ] 
});
