import axios from "../../plugins/axios"

export default {
  state: {
    accounts: null
  },
  mutations: {
    SET_ACCOUNTS(state, accounts) {
      state.accounts = accounts
    }
  },
  actions: {
    async accounts({ commit }) {
      if (
        this.getters.getAccounts != null &&
        this.getters.getAccounts != undefined
      ) {
        return this.getters.getAccounts
      } else {
        try {
          let data = await axios.get("/coinbase/pri/accountlist")
          let accounts = data.data.accounts.filter(el => el.available > 0)
          commit("SET_ACCOUNTS", accounts)
          return accounts
        } catch (error) {
          console.error(error)
          return null
        }
      }
    },
    getCandles({ commit }, payload) {
      return axios.post("/coinbase/pub/candles", payload)
    },
    getProductTypes({ commit }) {
      return axios.get("coinbase/pub/productTypes")
    }
  },
  getters: {
    getAccounts(state) {
      return state.accounts
    }
  }
}
