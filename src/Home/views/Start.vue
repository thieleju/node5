<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center>
      <v-flex class="cont">
        <v-card color="secondary" elevation="3" dark>
          <v-card-title class="headline textColor">
            Chart
          </v-card-title>

          <v-card-subtitle>
            Vue Apex Chart
          </v-card-subtitle>

          <div id="chart">
            <apexchart
              class=""
              :type="mainchart.options.chart.type"
              :height="mainchart.options.chart.height"
              :options="mainchart.options"
              :series="mainchart.series"
            ></apexchart>
          </div>
          <v-card-actions>
            <v-menu open-on-hover top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text color="accent" v-bind="attrs" v-on="on">
                  {{ footer.pair.selected }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in footer.pair.items"
                  :key="index"
                  link
                  @click="updatefooterPair(item)"
                >
                  <v-list-item-title>
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu open-on-hover top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text color="accent" v-bind="attrs" v-on="on">
                  {{ footer.candles.selected }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in footer.candles.items"
                  :key="index"
                  link
                  @click="updatefooterCandle(item, index)"
                >
                  <v-list-item-title>
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu open-on-hover top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text color="accent" v-bind="attrs" v-on="on">
                  {{ footer.candleCount.selected }}
                  {{ footer.candleCount.postfix }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in footer.candleCount.items"
                  :key="index"
                  link
                  @click="updatefooterCandleCount(item, index)"
                >
                  <v-list-item-title>
                    {{ item.value }} {{ footer.candleCount.postfix }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios"
import VueApexCharts from "vue-apexcharts"

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      accountListData: null,
      mainchart: {
        series: [{}],
        options: {
          chart: {
            type: "candlestick",
            height: "600",
            background: "#363636",
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false
              }
            }
          },
          legend: {
            show: false
          },
          theme: {
            mode: "dark"
          },
          plotOptions: {
            candlestick: {
              colors: {
                upward: "#4ecca3",
                downward: "#121212"
              },
              wick: {
                useFillColor: true
              }
            }
          },
          xaxis: {
            type: "datetime"
          },
          yaxis: {
            tooltip: {
              enabled: true
            }
          }
        }
      },
      footer: {
        pair: {
          selected: "BTC-EUR",
          mainCurrency: "EUR",
          items: []
        },
        candles: {
          selected: "1 day",
          selectedValue: "ONE_DAY",
          items: [
            {
              title: "1 day",
              value: "ONE_DAY"
            },
            {
              title: "6 hours",
              value: "SIX_HOURS"
            },
            {
              title: "1 hour",
              value: "ONE_HOUR"
            },
            {
              title: "15 minutes",
              value: "FIFTEEN_MINUTES"
            },
            {
              title: "5 minutes",
              value: "FIVE_MINUTES"
            },
            {
              title: "1 minute",
              value: "ONE_MINUTE"
            }
          ]
        },
        candleCount: {
          selected: "100",
          postfix: "candles",
          items: [
            {
              value: "20"
            },
            {
              value: "50"
            },
            {
              value: "100"
            },
            {
              value: "150"
            },
            {
              value: "200"
            }
          ]
        }
      }
    }
  },
  async created() {
    // init account list
    this.initAccountList()
    // init graph
    this.initGraph()
  },
  methods: {
    updatefooterCandle(item, index) {
      this.footer.candles.selected = item.title
      this.footer.candles.selectedValue = this.footer.candles.items[index].value
      // reload graph
      this.initGraph()
    },
    updatefooterCandleCount(item) {
      this.footer.candleCount.selected = item.value
      // reload graph
      this.initGraph()
    },
    updatefooterPair(item) {
      this.footer.pair.selected = item.title
      // reload graph
      this.initGraph()
    },
    initGraph() {
      let series = []
      let arr = []

      let payload = {
        pair: this.footer.pair.selected,
        granularity: this.footer.candles.selectedValue,
        amount: this.footer.candleCount.selected
      }
      this.$store
        .dispatch("getCandles", payload)
        .then(candles => {
          // Candels received successully
          for (let i = 0; i < candles.data.candles.length; i++) {
            let candle = candles.data.candles[i]
            arr.push({
              x: new Date(candle.openTimeInISO),
              y: [candle.open, candle.high, candle.low, candle.close]
            })
          }
          series.push({ data: arr })
        })
        .catch(error => console.log(error))

      // give data to chart
      this.mainchart.series = series
    },
    initAccountList() {
      this.$store.dispatch("getProductTypes").then(data => {
        let products = data.data.products
        products.forEach(element => {
          if (element.enabled) {
            this.footer.pair.items.push({
              title: element.name,
              value: element.name
            })
          }
        })
      })
    }
  }
}
</script>
