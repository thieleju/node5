const axios = require("axios")
const { workerData, parentPort } = require("worker_threads")

const { CandleGranularity } = require("coinbase-pro-node")

const serverHelper = require("./serverHelper")
const workerHelper = require("./workerHelper")
const coinbaseHelper = require("./coinbaseHelper")

var counter = 0
var interval = workerData.timeBetweenChecksInS * 1000
var allAccountsArray = []

// initialize
const client = coinbaseHelper.initClient(workerData.username, true)
if (!client) {
  console.log(workerData)
  stopMe()
} else {
  // worker started correctly
  sendResponse("startup", "Worker started", "", "")
  // get Account list
  // client.rest.account
  //   .listAccounts()
  //   .then(data => {
  //     allAccountsArray = data
  //   })
  //   .catch(() => {
  //     stopMe()
  //   })
}

// set interval with updateWorker() callback
const intervalID = setInterval(() => {
  // increase Counter
  counter++
  // update worker
  updateWorker()
}, interval)

// receive message from parent
parentPort.on("message", data => {
  switch (data.cmd) {
    case "exit":
      stopMe()
      break
    case "getAccountList":
      getAccountList(data)
      break
    case "getMarketPrice":
      getMarketPrice(data)
  }
})

/**
 *  Makes attempts to trade
 *  This function gets called every workerData.timeBetweenChecksInS seconds
 */
function updateWorker() {
  // sendResponse("message", "Hello!", "", "", "")
}

function getAccountList(reqData) {
  // get Account list
  client.rest.account
    .listAccounts()
    .then(data => {
      allAccountsArray = data
      sendResponse(
        "message",
        "Account List",
        "getAccountList",
        reqData.id,
        data
      )
    })
    .catch(error => stopMe("Error get MarketPrice failed"))
}

function getMarketPrice(reqData) {
  const candleGran = CandleGranularity.ONE_MINUTE
  // get candles
  client.rest.product
    .getCandles(reqData.product, {
      granularity: candleGran
    })
    .then(candles => {
      sendResponse(
        "message",
        "Latest OneMinute-Gran MarketPrice",
        "getMarketPrice",
        reqData.id,
        {
          candle: candles[candles.length - 1]
        }
      )
    })
    .catch(error => stopMe("ERROR get MarketPrice failed"))
}

/**
 * This function stops the worker
 */
function stopMe(error) {
  sendResponse("shutdown", "Stopped worker", "", error)
  clearInterval(intervalID)
  parentPort.close()
}
/**
 * Sends a response to the listener in workerlpers
 * @param {String} msg Message you want to send
 */
function sendResponse(type, msg, cmd, id, data) {
  workerData.type = type
  workerData.counter = counter
  workerData.message = msg
  workerData.command = cmd
  workerData.data = data
  workerData.id = id

  parentPort.postMessage(workerData)
}

module.exports = {
  getClientObject() {
    return client
  }
}
