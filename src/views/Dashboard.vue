<template>
  <v-app id="inspire">
    <v-app-bar app dark color="primary">
      <v-toolbar-title>Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon>mdi-account</v-icon>
    </v-app-bar>
    <v-navigation-drawer app floating>
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
            <transition name="fade"> </transition>
          </v-col>
        </v-row>
      </v-container>
      <v-footer app color="grey darken-4" class="py-1">
        <span class="mr-auto overline">Node 5 &copy;2020</span>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      user: {
        username: JSON.parse(localStorage.getItem("user")).username,
        email: JSON.parse(localStorage.getItem("user")).email
      }
    }
  },
  created() {
    axios.get("//localhost:3000/dashboard").then(({ data }) => {})
  }
}
</script>
