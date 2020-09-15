<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid> </v-container>
    </v-main>
  </v-app>
</template>

<script>
import store from "../store"

export default {
  created() {
    if (store.getters["isAuthenticated"]) {
      this.$router.push({ name: "dashboard" })
    } else {
      this.$router.push({ name: "login" })
    }
  }
}
</script>
