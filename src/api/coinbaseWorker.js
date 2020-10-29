const axios = require("axios")
const { workerData, parentPort } = require("worker_threads")

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
  // verify worker started correctly
  sendResponse("startup", "Worker started")
  // get Account list
  client.rest.account
    .listAccounts()
    .then(data => {
      allAccountsArray = data
    })
    .catch(error => {
      stopMe()
    })
}

// set interval with updateWorker() callback
const intervalID = setInterval(() => {
  // increase Counter
  counter++
  // update worker
  updateWorker()
}, interval)

// receive message from parent
parentPort.on("message", message => {
  switch (message) {
    case "exit":
      stopMe()
      break
    default:
      sendResponse("status", "online")
  }
})

/**
 *  Makes attempts to trade
 *  This function gets called every workerData.timeBetweenChecksInS seconds
 */
function updateWorker() {
  sendResponse("message", "Hello!")
}
/**
 * This function stops the worker
 */
function stopMe() {
  sendResponse("shutdown", "Stopped worker")
  clearInterval(intervalID)
  parentPort.close()
}
/**
 * Sends a response to the listener in workerlpers
 * @param {String} msg Message you want to send
 */
function sendResponse(type, msg) {
  workerData.type = type
  workerData.counter = counter
  workerData.message = msg

  parentPort.postMessage(workerData)
}

module.exports = {
  getClientObject() {
    return client
  }
}
