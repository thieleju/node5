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
        <v-list-item link v-for="app in apps" :key="app.id" :to="app.name">
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
            <transition name="fade" mode="out-in">
              <keep-alive max="5">
                <router-view></router-view>
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
  data() {
    return {
      user: {
        username: null
      },
      component: {
        currentTitle: "Loading ... "
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

    // init apps
    this.$store.dispatch("apps").then(data => {
      this.apps = data
    })

    // init accounts
    this.$store.dispatch("accounts").then(data => {
      this.propData = data
    })

    // init account list and assign it to prop
    // axios
    //   .get("/coinbase/pri/accountlist")
    //   .then(data => {
    //     if (data.data.status == "success") {
    //       var newData = data.data.accounts.filter(el => el.available > 0)
    //       // assign prop variable
    //       this.component.propData = newData
    //       // show component
    //       this.setComponent(this.apps[0].component, this.apps[0].title)
    //     } else {
    //       this.component.propData = ["error"]
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })

    // // start worker / get update
    // this.updateAlert()
    // setInterval(() => this.updateAlert(), this.alert.timerIntervalInS * 1000)
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

<style lang="css">
.cont {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  max-width: 100%;
  max-height: 100%;
}
.textColor {
  color: var(--v-primary-base);
  word-break: break-word;
}
</style>
