<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex class="leftCont">
        <v-card color="secondary" elevation="3">
          <v-card-title class="headline textColor">
            Portfolio
          </v-card-title>

          <v-card-subtitle>
            Watch your accounts balances
          </v-card-subtitle>

          <v-card-title class="text-xl-h4 textColor">
            ~ {{ portfolioSum }}
          </v-card-title>

          <!-- <v-card-text color="primary"> -->
          <v-tabs v-model="tab" background-color="secondary">
            <v-tabs-slider color="accent"></v-tabs-slider>
            <v-tab>
              Balances
            </v-tab>
            <v-tab>
              Trades
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-data-table
                class="elevation-5 secondary"
                :headers="tableData.headers"
                :items="tableData.items"
                :items-per-page="10"
                :sort-by.sync="tableData.sortBy"
                :sort-desc.sync="tableData.sortDesc"
                :loading="loading"
                loading-text="Loading items ..."
              >
                <template v-slot:item.icon="{ item }">
                  <v-icon>{{ item.icon }}</v-icon>
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab-item> </v-tab-item>
          </v-tabs-items>
          <!-- </v-card-text> -->
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      tab: null,
      selectedAccount: null,
      accounts: null,
      loading: true,
      portfolioSum: "loading ...",
      tableData: {
        sortBy: "holdings",
        sortDesc: true,
        headers: [
          {
            text: "icon",
            align: "start",
            sortable: false,
            value: "icon"
          },
          {
            text: "Currency",
            align: "start",
            sortable: false,
            value: "currency"
          },
          {
            text: "Holdings in %",
            value: "holdings"
          },
          {
            text: "Balance in €",
            value: "balance"
          },
          {
            text: "Available Qty.",
            value: "available"
          },
          {
            text: "Price in €",
            value: "lastClosingPrice"
          }
        ],
        items: []
      }
    }
  },
  created() {
    // init account list
    axios.get(this.$store.getters.getAPIUrl + "/getAccountList").then(data => {
      if (data.data.status == "success") {
        // build tableData object and
        this.tableData.items = this.buildDataTablesData(data.data.accounts)
      } else {
        this.loading = false
        this.portfolioSum = "Not connected to coinbase!"
      }
    })
  },
  methods: {
    buildDataTablesData(accounts) {
      let promisesArray = []
      let roundToDigits = 6
      let mainCurrency = "EUR"
      let mainCurrencyBalance = 0

      accounts.forEach(el => {
        if (el.currency == mainCurrency) {
          mainCurrencyBalance = el.balance
        }
      })
      let accountsOver0 = accounts.filter(
        acc => acc.available > 0 && acc.currency != mainCurrency
      )
      let accountsAt0 = accounts.filter(
        acc => acc.available == 0 && acc.currency != mainCurrency
      )

      //  get all promises for holdings calculation
      accountsOver0.forEach(acc => {
        // add promise to promises array if not main currency
        promisesArray.push(
          axios.get(
            this.$store.getters.getAPIUrl +
              "/getMarketPrice/" +
              acc.currency +
              "-" +
              mainCurrency
          )
        )
      })
      // resolve all promises
      Promise.all(promisesArray).then(data => {
        // get lastClosingPrice from data and build new data array
        let newData = []
        data.forEach(data => {
          newData.push({
            currency: data.data.product.split("-")[0],
            lastClosingPrice: data.data.lastClosingPrice
          })
        })
        // sum of balances
        let sumOfBalances = Number(mainCurrencyBalance)

        // loop through currencies in newData and assign values
        for (let i = 0; i < newData.length; i++) {
          // icon
          newData[i]["icon"] =
            "mdi-currency-" + newData[i]["currency"].toLowerCase()
          newData[i]["available"] = accountsOver0[i].available
          // calculate balance
          let balance =
            Number(accountsOver0[i].balance) *
            Number(newData[i].lastClosingPrice)
          newData[i]["balance"] = balance.toFixed(roundToDigits)
          // add to sum of all Balances used to calculate holdings in %
          sumOfBalances += balance
        }
        // since sumOfBalances is calculated, assign holdings in %
        for (let i = 0; i < newData.length; i++) {
          newData[i]["holdings"] = (
            (newData[i].balance / sumOfBalances) *
            100
          ).toFixed(roundToDigits)
        }
        // add main currency
        newData.push({
          icon: "mdi-currency-" + mainCurrency.toLowerCase(),
          currency: mainCurrency,
          available: mainCurrencyBalance,
          lastClosingPrice: "---",
          balance: Number(mainCurrencyBalance).toFixed(roundToDigits),
          holdings: (
            (Number(mainCurrencyBalance) / sumOfBalances) *
            100
          ).toFixed(roundToDigits)
        })
        // finally set items
        this.tableData.items = newData
        this.portfolioSum = sumOfBalances.toFixed(2) + "€"
        // disable loading bar
        this.loading = false
        // console.log(accountsAt0)
      })
    }
  }
}
</script>

<style lang="css" scoped>
.leftCont {
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  /* max-width: 150vh; */
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
