// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // Configuración Importante para Supabase
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/login',
      exclude: ["/*"],
    },
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
});