<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex class="leftCont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline textColor">
            Node5 App
          </v-card-title>

          <v-card-subtitle>
            Subtitle
          </v-card-subtitle>

          <v-card-text>
            This is Card Text
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex class="rightCont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline textColor">
            Trading Pair
          </v-card-title>

          <v-card-subtitle>
            Switch between your trading pairs
          </v-card-subtitle>
        </v-card>
        <v-list>
          <v-list-item-group>
            <v-list-item v-for="account in accounts" :key="account.id">
              <v-list-item-icon>
                <v-icon></v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  v-text="account.currency"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      selectedAccount: null,
      accounts: null
    }
  },
  created() {
    axios
      .get(this.$store.getters.getAPIUrl + "/coinbaseWorker")
      .then(data => {})

    // init account list
    axios.get(this.$store.getters.getAPIUrl + "/getAccountList").then(data => {
      this.accounts = data.data.filter(account => account.balance > 0)
    })
  }
}
</script>

<style lang="css" scoped>
.leftCont {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  max-width: 150vh;
}
.rightCont {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  max-width: 40vh;
}
.textColor {
  color: var(--v-primary-base);
  word-break: break-word;
}
</style>
