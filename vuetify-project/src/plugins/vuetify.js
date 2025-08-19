/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
import { zhHant } from 'vuetify/locale'

// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// export default createVuetify({
//   theme: {
//     defaultTheme: 'light',
//   },
//   locale: {
//     locale: 'zhHant',
//     messages: { zhHant },
//   },
// })

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'myTheme',
    themes: {
      myTheme: {
        dark: false,
        colors: {
          background: '#fffef5ff',
          // surface: '#FFFBE6',
          primary: '#6750A4',
          secondary: '#03DAC6',
        },
      },
    },
  },
  locale: {
    locale: 'zhHant',
    messages: { zhHant },
  },
})
