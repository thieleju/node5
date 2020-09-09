<template>
  <login v-if="showlogin" />
  <register v-else />
</template>

<script>
import Login from "../components/Login"
import Register from "../components/Register"

export default {
  components: {
    Login,
    Register
  },
  data() {
    return {
      showlogin: true
    }
  }
}
</script>
<style></style>
