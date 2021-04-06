import Vue from "vue"
import Vuex from "vuex"

// import modules
import auth from "./modules/auth"
import navigation from "./modules/navigation"
import coinbase from "./modules/coinbase"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    navigation,
    coinbase
  }
})
