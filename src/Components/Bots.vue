<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex class="leftCont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline textColor">
            {{ pairs.selected }}
          </v-card-title>
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

          <v-list nav dark class="textColor secondaryBackground">
            <v-list-item-group mandatory>
              <v-list-item
                v-for="account in pairs.accounts"
                :key="account.id"
                @click="tradingPairClicked(account.currency)"
              >
                <v-list-item-icon>
                  <v-icon>
                    mdi-currency-{{
                      account.currency.split("-")[0].toLowerCase()
                    }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    v-text="account.currency"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios"
import { GChart } from "vue-google-charts"

export default {
  components: {
    // GChart
  },
  data() {
    return {
      pairs: {
        accounts: null,
        mainCurrency: "EUR",
        selected: ""
      }
    }
  },
  created() {
    // init account list
    axios.get(this.$store.getters.getAPIUrl + "/getAccountList").then(data => {
      if (data.data.status == "success") {
        var newData = data.data.accounts.filter(
          el => el.available > 0 && el.currency != this.pairs.mainCurrency
        )
        newData.forEach(el => {
          el.currency += "-" + this.pairs.mainCurrency
        })
        this.pairs.accounts = newData
        this.pairs.selected = newData[0].currency
      }
    })
  },
  methods: {
    tradingPairClicked(pair) {
      this.pairs.selected = pair
    }
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
.secondaryBackground {
  background: var(--v-secondary-base);
}
</style>
