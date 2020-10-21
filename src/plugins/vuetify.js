import Vue from "vue"
import Vuetify from "vuetify/lib"

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  theme: {
    // https://colorhunt.co/palette/117601
    dark: true,
    themes: {
      dark: {
        primary: "#4ecca3",
        secondary: "#363636",
        background: "#121212",
        text: "#eeeeee",
        accent: "#4ECCA3"
        // error: ""
      }
    },
    options: {
      customProperties: true
    }
  }
})
