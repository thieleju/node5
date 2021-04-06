import axios from "../../plugins/axios"

export default {
  state: {
    apps: null
  },
  mutations: {
    SET_APPS(state, apps) {
      state.apps = apps
    }
  },
  actions: {
    async apps({ commit }, apps) {
      if (this.getters.getApps) return this.getters.getApps
      else {
        try {
          let apps = await axios.get("/navigation/apps")
          commit("SET_APPS", apps.data.data)
          return apps.data.data
        } catch (error) {
          console.error(error)
          return null
        }
      }
    }
  },
  getters: {
    getApps(state) {
      return state.apps
    }
  }
}
