import router from "../../router/index.js"
import axios from "../../plugins/axios"

export default {
  state: {
    user: null
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      let userObj = { token: userData.token, username: userData.username }
      state.user = userObj
      localStorage.setItem("user", JSON.stringify(userObj))
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
      return axios.post("/auth/registration", credentials).then(data => {
        console.log(data)
        if (data.status == "success") {
          return data
        } else {
          throw data.message
        }
      })
    },
    login({ commit }, credentials) {
      return axios.post("/auth/login", credentials).then(data => {
        if (data.data.status == "success") {
          commit("SET_USER_DATA", data.data)
          return data.data
        } else {
          throw data.data.message
        }
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
  }
}
