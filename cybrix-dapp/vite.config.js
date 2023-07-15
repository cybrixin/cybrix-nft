import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

const manifestForPlugin = {
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{ico,png,svg}'],
    cleanupOutdatedCaches: true,
    navigateFallback: null,
  },
  manifest: {
    "name": "Cybrix Punks NFT",
    "short_name": "CYPNFT",
    "theme_color": "#0aad0a",
    "background_color": "#0aad0a",
    "display": "minimal-ui",
    "scope": "/",
    "start_url": "/",
    "lang": "en",
    "categories": [
      "education"
    ],
    "icons": [
      {
        "src": "/icons/manifest-icon-192.maskable.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/icons/manifest-icon-192.maskable.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/icons/manifest-icon-512.maskable.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/icons/manifest-icon-512.maskable.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ]
  }
}

export default defineConfig({
  plugins: [react(), svgr(), VitePWA(manifestForPlugin)],
  envPrefix: "PUBLIC_",
  build: {
    outDir: "build"
  }
})
