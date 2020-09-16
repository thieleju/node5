<template>
  <v-app id="inspire">
    <v-main class="backgroundImage">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" color="background">
              <v-toolbar color="primary" dark>
                <v-toolbar-title>Login to your Account</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Username"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="username"
                    v-on:keyup.enter="login"
                  ></v-text-field>

                  <v-text-field
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                    v-on:keyup.enter="login"
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
                <v-btn color="primary" @click="login">Login</v-btn>
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
  methods: {
    login() {
      this.$store
        .dispatch("login", {
          username: this.username,
          password: this.password
        })
        .then(() => {
          // LOGIN SUCCESSFUL
          let Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 800,
          timerProgressBar: false,
            onClose: (toast) => {
                this.$router.push({ name: "dashboard" })
            }
          })
          Toast.fire({
              icon: "success", 
              title: "Siging in ..."
            })
        }).catch(error => {
          // LOGIN FAILED
          let Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: false,
            // onClose: (toast) => {}
          })
          Toast.fire({
            icon: "error", 
            title: "Failed to login!"
          })
        })
    }
  }
}
</script>

<style lang="scss">


.backgroundImage {
  background-image: url("../assets/wallpaper/legacy_small.jpg");
  background-size: cover;
}

body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif; 
}
</style>
