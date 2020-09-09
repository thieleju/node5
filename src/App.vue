<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      expand-on-hover
      mini-variant
      permanent
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Node5 Dashboard</v-toolbar-title>
    </v-app-bar>

    <app-nav />
    <router-view calss="page" />

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import AppNav from "./components/AppNav"
import axios from "axios"

export default {
  components: {
    AppNav
  },
  data() {
    return {
      drawer: null
    }
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
// @import "./assets/styles/global.scss";
// .page {
//   display: flex;
//   justify-content: center;
//   flex-direction: column;
//   align-items: center;
//   min-height: calc(100vh - 56px);
// }
//
</style>
