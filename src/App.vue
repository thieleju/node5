<template>
  <div id="app">
    <app-nav />
    <router-view calss="page" />
  </div>
</template>

<script>
import AppNav from "./components/AppNav"
import axios from "axios"

export default {
  components: {
    AppNav
  },
  created() {
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

<style lang="scss">
@import "./assets/styles/global.scss";
.page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 56px);
}
</style>
