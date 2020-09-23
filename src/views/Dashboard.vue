<template>
  <v-app id="inspire">
    <v-app-bar app dark color="primary">
      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon>{{ chevron }}</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon @click="logout">mdi-logout-variant</v-icon>
    </v-app-bar>
    <v-navigation-drawer app floating v-model="drawer">
      <v-list color="primary">
        <v-list-item>
          <v-icon>mdi-account</v-icon>
          <v-toolbar-title class="px-2">{{ user.username }}</v-toolbar-title>
        </v-list-item>
      </v-list>
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
    <v-main>
      <v-container class="px-4 py-0 fill-height" fluid>
        <v-row class="fill-height">
          <v-col>
            <transition name="fade"> 
              
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      user: {
        username: null,
        email: null
      },
      drawer: true,
      chevron: "mdi-chevron-left",
      title: "Dashboard"
    }
  },
  created() {
    let user = this.$store.getters.getUser
    this.user.username = user.username
    this.user.email = user.email
  },
  methods: {
    logout() {
      this.$store.dispatch("logout")
    },
    setChevron(state) {
      if (state === "left") {
        this.chevron = "mdi-chevron-left"
      } else if (state === "right") {
        this.chevron = "mdi-chevron-right"
      }
    }
  },
  watch: {
    drawer: function(state) {
      if (state) {
        this.setChevron("left")
      } else {
        this.setChevron("right")
      }
    }
  }
}
</script>
