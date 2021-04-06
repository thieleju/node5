<template>
  <v-app id="inspire">
    <v-main class="backgroundImage">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" color="secondary">
              <v-toolbar color="primary" dark>
                <v-toolbar-title>Login to your Node 5 account</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Username"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="username"
                    v-on:keyup.enter="validateLogin"
                  ></v-text-field>

                  <v-text-field
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                    v-on:keyup.enter="validateLogin"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  @click="$router.push({ name: 'register' })"
                  >Request Account</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="validateLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Swal from "sweetalert2"

export default {
  data() {
    return {
      username: "",
      password: ""
    }
  },
  created() {
    // redirect to dashboard if logged in
    if (this.$store.getters["isAuthenticated"]) {
      this.$router.push({ name: "home.start" })
    }
  },
  methods: {
    validateLogin() {
      if (this.username != "" && this.password != "") {
        this.login()
      } else {
        this.loginFailed("Empty username or password!")
      }
    },
    login() {
      this.$store
        .dispatch("login", {
          username: this.username,
          password: this.password
        })
        .then(data => {
          this.loginSuccessful(data.message)
        })
        .catch(error => {
          this.loginFailed(error)
        })
    },
    loginSuccessful(message) {
      Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        padding: "1.3rem",
        timer: 800,
        timerProgressBar: false,
        willClose: toast => {
          this.$router.push({ name: "home.start" })
        }
      }).fire({
        icon: "success",
        title: message
      })
    },
    loginFailed(message) {
      Swal.mixin({
        toast: true,
        position: "top",
        padding: "1.3rem",
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: false
        // willClose: (toast) => {}
      }).fire({
        icon: "error",
        title: message
      })
    }
  }
}
</script>

<style lang="scss">
.backgroundImage {
  background-image: url("../../assets/wallpaper/legacy_small.jpg");
  background-size: cover;
}

body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial,
    sans-serif;
}
</style>
