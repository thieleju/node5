import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"

import router from "../router/index.js"

Vue.use(Vuex)

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "/.env" })

// set api URL
let apiURL = ""
if (process.env.VUE_APP_NODE_ENV == "production") {
  apiURL = process.env.VUE_APP_PRO_API
} else {
  apiURL = process.env.VUE_APP_DEV_API + ":" + process.env.VUE_APP_SERVERPORT
}

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData
      localStorage.setItem("user", JSON.stringify(userData))
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.token}`
    },
    CLEAR_USER_DATA() {
      localStorage.removeItem("user")
      location.reload()
    }
  },
  actions: {
    register({ commit }, credentials) {
      return axios.post(apiURL + "/register", credentials)
    },
    login({ commit }, credentials) {
      return axios.post(apiURL + "/login", credentials).then(({ data }) => {
        // console.log(data)
        commit("SET_USER_DATA", data)
        return data
      })
    },
    logout({ commit }) {
      commit("CLEAR_USER_DATA")
      router.push({ name: "start" })
    }
  },
  getters: {
    isAuthenticated(state) {
      return state.user !== null && state.user !== undefined
    },
    getUser(state) {
      return state.user
    },
    getAPIUrl() {
      if (process.env.VUE_APP_NODE_ENV == "production") {
        return process.env.VUE_APP_PRO_API
      } else {
        return (
          process.env.VUE_APP_DEV_API + ":" + process.env.VUE_APP_SERVERPORT
        )
      }
    }
  },
  modules: {}
})
