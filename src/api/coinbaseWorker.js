const axios = require("axios")
const { workerData, parentPort } = require("worker_threads")

var helpers = require("./helpers")
var coinbaseHelpers = require("./coinbaseHelpers")

var counter = 0
var interval = workerData.timeBetweenChecksInS * 1000

// verify worker started correctly
sendResponse("startup", "Worker started")

// set interval with updateWorker() callback
var intervalID = setInterval(() => {
  // increase Counter
  counter++

  updateWorker()
}, interval)

// receive message from parent
parentPort.on("message", message => {
  switch (message) {
    case "exit":
      stopMe()
      break
    default:
      sendResponse("status", workerData.status)
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
 * Sends a response to the listener in coinbaseHelpers
 * @param {String} msg Message you want to send
 */
function sendResponse(type, msg) {
  workerData.type = type
  workerData.message =
    workerData.workerID +
    " | " +
    workerData.status +
    " | Counter: " +
    counter +
    " | " +
    msg

  parentPort.postMessage(workerData)
}
