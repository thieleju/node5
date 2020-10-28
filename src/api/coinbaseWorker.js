const axios = require("axios")
const { workerData, parentPort } = require("worker_threads")

var serverHelper = require("./serverHelper")
var workerHelper = require("./workerHelper")

var counter = 0
var interval = workerData.timeBetweenChecksInS * 1000

// initialize
const client = workerHelper.initClient(workerData.username)
if (!client) {
  console.log(workerData)
  stopMe()
}

// verify worker started correctly
sendResponse("startup", "Worker started")

// set interval with updateWorker() callback
var intervalID = setInterval(() => {
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
