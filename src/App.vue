<template>
  <v-app id="inspire">
    <router-view />
  </v-app>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {}
  },
  created() {
    // autologin if userdata is still in local Storage
    const userString = localStorage.getItem("user")
    if (userString) {
      const userData = JSON.parse(userString)
      this.$store.commit("SET_USER_DATA", userData)
    }

    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401) {
          this.$store.dispatch("logout")
        }
        return Promise.reject(error)
      }
    )
  }
}
</script>
