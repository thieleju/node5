<template>
  <v-app id="inspire">
    <v-app-bar app dark color="primary">
      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon>{{ chevron }}</v-icon>
      </v-btn>
      <v-toolbar-title>{{ component.currentTitle }}</v-toolbar-title>
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
        <v-list-item
          link
          v-for="app in apps"
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
              <keep-alive max="5">
                <component :is="component.currentComponent"></component>
              </keep-alive>
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
    home: () => import("../components/Home"),
    portfolio: () => import("../components/Portfolio"),
    bots: () => import("../components/Bots"),
    settings: () => import("../components/Settings")
  },
  data() {
    return {
      user: {
        username: null,
        email: null
      },
      component: {
        currentTitle: null,
        currentComponent: null
      },
      drawer: true,
      apps: null,
      chevron: "mdi-chevron-left"
    }
  },
  created() {
    // init user
    let user = this.$store.getters.getUser
    this.user.username = user.username
    this.user.email = user.email

    // init apps
    axios.get(this.$store.getters.getAPIUrl + "/apps").then(data => {
      this.apps = data.data
      // init component
      this.setComponent(data.data[0].component, data.data[0].title)
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
