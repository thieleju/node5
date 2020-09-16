import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"

import router from "../router/index.js"

Vue.use(Vuex)

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "/.env" })

let rootUrl = null
if (process.env.VUE_APP_NODE_ENV === "production") {
  rootUrl =
    process.env.VUE_APP_ROOT + ":" + process.env.VUE_APP_PRO_SERVERPORT
} else {
  rootUrl =
    process.env.VUE_APP_ROOT + ":" + process.env.VUE_APP_DEV_SERVERPORT
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
    },
    REQUEST_USER(state, data) {
      console.log(data)
    }
  },
  actions: {
    register({ commit }, credentials) {
      return axios
        .post(rootUrl + "/api/register", credentials)
        .then(({ data }) => {
          commit("REQUEST_USER", data)
        })
    },
    login({ commit }, credentials) {
      return axios
        .post(rootUrl + "/api/login", credentials)
        .then(({ data }) => {
          commit("SET_USER_DATA", data)
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
    }
  },
  modules: {}
})
