<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <router-link v-if="loggedIn" to="/dashboard">Dashboard</router-link>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { authComputed } from "../store/helpers.js"

export default {
  computed: {
    ...authComputed
  },
  created() {
    if (this.loggedIn) {
      this.$router.push({ name: "dashboard" })
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout")
    }
  }
}
</script>
