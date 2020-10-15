<template>
  <v-app id="inspire">
    <v-main class="backgroundImage">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" color="secondary">
              <v-toolbar color="primary" dark>
                <v-toolbar-title>Request a new account</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Username"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="username"
                    v-on:keyup.enter="validateRegister"
                  ></v-text-field>

                  <v-text-field
                    label="E-Mail"
                    name="email"
                    prepend-icon="mdi-email"
                    type="email"
                    v-model="email"
                    v-on:keyup.enter="validateRegister"
                  ></v-text-field>
                  <v-text-field
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                    v-on:keyup.enter="validateRegister"
                  ></v-text-field>
                  <v-text-field
                    label="Confirm Password"
                    name="password2"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password2"
                    v-on:keyup.enter="validateRegister"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="$router.push({ name: 'login' })"
                  >Switch to Login</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="validateRegister"
                  >Send Request</v-btn
                >
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
      email: "",
      password: "",
      password2: ""
    }
  },
  methods: {
    validateRegister() {
      // validate user input
      if (
        this.username != "" &&
        this.email != "" &&
        this.password != "" &&
        this.password == this.password2
      ) {
        this.register()
      } else {
        this.accountRequestFailed()
      }
    },
    register() {
      this.$store
        .dispatch("register", {
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.accountRequestSuccessful()
        })
        .catch(error => {
          this.accountRequestFailed()
        })
    },
    accountRequestSuccessful() {
      Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        padding: "1.3rem",
        timer: 2000,
        timerProgressBar: false,
        onClose: toast => {
          this.$router.push({ name: "login" })
        }
      }).fire({
        icon: "success",
        title: "Account successfully requested"
      })
    },
    accountRequestFailed() {
      Swal.mixin({
        toast: true,
        position: "top",
        padding: "1.3rem",
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: false
        // onClose: (toast) => {}
      }).fire({
        icon: "error",
        title: "Failed to send request!"
      })
    }
  }
}
</script>
