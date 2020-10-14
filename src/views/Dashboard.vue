<template>
  <v-app id="inspire">
    <v-app-bar app dark color="primary">
      <v-btn icon @click.stop="component.drawer = !component.drawer">
        <v-icon>{{ navigator.chevron }}</v-icon>
      </v-btn>
      <v-toolbar-title>{{ component.currentTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon @click="logout">mdi-logout-variant</v-icon>
    </v-app-bar>
    <v-navigation-drawer app floating v-model="component.drawer">
      <v-list color="primary">
        <v-list-item>
          <v-icon>mdi-account</v-icon>
          <v-toolbar-title class="px-2">{{ user.username }}</v-toolbar-title>
        </v-list-item>
      </v-list>
      <v-list dense>
        <v-list-item
          link
          v-for="app in navigator.apps"
          :key="app.id"
          @click="setComponent(app.component, app.title)"
        >
          <v-list-item-action>
            <v-icon>{{ app.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ app.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container class="px-4 py-0 fill-height" fluid>
        <v-row class="fill-height">
          <v-col>
            <transition name="fade">
              <component :is="component.currentComponent"></component>
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
  components: {
    home: () => import("../Components/Home"),
    bots: () => import("../Components/Bots"),
    settings: () => import("../Components/Settings")
  },
  data() {
    return {
      user: {
        username: null,
        email: null
      },
      component: {
        currentTitle: "Dashboard",
        currentComponent: null
      },
      navigator: {
        apps: null,
        drawer: true,
        chevron: "mdi-chevron-left"
      }
    }
  },
  created() {
    // init user
    let user = this.$store.getters.getUser
    this.user.username = user.username
    this.user.email = user.email

    // init component
    this.setComponent("home", "Home")

    // init apps
    axios.get(this.$store.getters.getAPIUrl + "/apps").then(data => {
      this.navigator.apps = data.data.apps
    })
  },
  methods: {
    setComponent(comp, title) {
      // change current title
      this.component.currentTitle = title
      // change current component
      this.component.currentComponent = comp
    },
    logout() {
      this.$store.dispatch("logout")
    },
    setChevron(state) {
      if (state === "left") {
        this.navigator.chevron = "mdi-chevron-left"
      } else if (state === "right") {
        this.navigator.chevron = "mdi-chevron-right"
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
