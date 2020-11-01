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
        <v-list nav dark>
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
  // TODO add tabs to show Candlestick graph / BOTS
  data() {
    return {
      selectedAccount: null,
      accounts: null,
      loading: true,
      mainCurrency: "EUR",
      selectedPair: null
    }
  },
  created() {
    // start worker / get update
    axios.get(this.$store.getters.getAPIUrl + "/coinbaseWorker").then(data => {
      console.log(data.data)
      // TODO v-alert with status message?
    })
    // init account list
    axios.get(this.$store.getters.getAPIUrl + "/getAccountList").then(data => {
      if (data.data.status == "success") {
        var newData = data.data.accounts.filter(
          el => el.available > 0 && el.currency != this.mainCurrency
        )
        newData.forEach(el => {
          el.currency += "-" + this.mainCurrency
        })
        this.accounts = newData
      }
      this.loading = false
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
  max-width: 30vh;
}
.textColor {
  color: var(--v-primary-base);
  word-break: break-word;
}
</style>
