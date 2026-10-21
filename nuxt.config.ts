// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss'
  ],

  postcss: {
    plugins: {
      'tailwindcss/nesting': false
    }
  },

  css: [
    'maplibre-gl/dist/maplibre-gl.css'
  ],

  runtimeConfig: {
    // Cloudflare Radar / API Token (server-side only)
    cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN || '',
    public: {
      appName: 'i2m2 - Indonesia Internet Metric Monitor'
    }
  }
})
