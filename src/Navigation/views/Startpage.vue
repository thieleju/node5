<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid> </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  created() {
    if (this.$store.getters["isAuthenticated"]) {
      this.$router.push({ name: "home.start" })
    } else {
      this.$router.push({ name: "login" })
    }
  }
}
</script>
