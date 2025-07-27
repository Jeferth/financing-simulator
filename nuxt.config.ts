import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },

  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['shadcn-nuxt'],

  /**
     * Prefix for all the imported component
     */
  prefix: '',
  
  /**
   * Directory that the component lives in.
   * @default "./components/ui"
   */
  componentDir: './components/ui'

});
