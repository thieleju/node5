var moment = require("moment")
var axios = require("axios")
const { Worker } = require("worker_threads")

const {
  CoinbasePro,
  CandleGranularity,
  FeeUtil,
  OrderSide,
  OrderType
} = require("coinbase-pro-node")

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "/.env" })

var serverHelper = require("./serverHelper")

var allWorkers = []
var workerIDLength = 12

module.exports = {
  /**
   * This function gets only called from the server
   * @param {String} username jwt.verify decoded Token username
   * @return {Promise} returns promise, which resolves/rejects JSON
   */
  checkWorker(username) {
    return new Promise((resolve, reject) => {
      var serverHelper = require("./serverHelper") // why do I need this?

      // get worker data and status
      let workerData = serverHelper.getUserConfig("workerData", username)

      if (!workerData)
        throw new Error({
          status: "error",
          message: "Could not read worker Data"
        })

      // add username to workerData
      workerData.username = username

      // check if worker is running => 1 worker per user
      if (
        module.exports.checkIfWorkerIsAlreadyRunning(
          username,
          workerData.workerID
        )
      ) {
        // worker online
        resolve({
          status: workerData.status,
          message: "Worker is online!",
          workerData
        })
      } else {
        // worker offline

        // initialize worker
        module.exports.startWorker(username, workerData)

        // resolve starting message
        resolve({
          status: workerData.status,
          message: "Worker with ID " + workerData.workerID + "is starting ...",
          workerData
        })
      }
    })
  },
  startWorker(username, workerData) {
    var serverHelper = require("./serverHelper") // why do I need this?

    // create worker object
    const worker = new Worker("./src/api/coinbaseWorker.js", { workerData })

    // worker listeners
    worker.on("message", data => {
      // worker gives feedback

      switch (data.type) {
        case "startup":
          // change status to online and save
          workerData.status = "online"
          serverHelper.saveConfig(data.username, "workerData", workerData)
          serverHelper.addLogEntry(username, "Started worker " + data.workerID)
          break
        case "shutdown":
          // shuts down worker
          serverHelper.addLogEntry(
            data.username,
            "Stopped worker " + data.workerID
          )
          break
        default:
          console.log(data)
      }
    })

    worker.on("error", error => {
      // worker threw an error
      console.log(error)
    })

    worker.on("exit", exitCode => {
      // worker exited
      console.log("Exited with code " + exitCode)
    })

    // add workerdata to allWorkers array to keep track of everything
    allWorkers.push(workerData)
  },
  /**
   * Initialize client with userspecific config
   * @param {String} username decoded jwt token with username and token property
   * @return {CoinbasePro} client
   */
  initClient(username) {
    var serverHelper = require("./serverHelper")
    var config = serverHelper.getUserConfig("coinbaseconfig", username)

    if (!config) {
      return null
    }

    if (config.useSandbox === true) {
      serverHelper.addLogEntry(username, "Initialized Coinbase Pro SANDBOX")
      return new CoinbasePro({
        apiKey: config.sandbox.apiKey,
        apiSecret: config.sandbox.secret,
        passphrase: config.sandbox.passphrase,
        useSandbox: true
      })
    } else if (config.useSandbox === false) {
      serverHelper.addLogEntry(
        username,
        "Initialized Coinbase Pro LIVE TRADING"
      )
      return new CoinbasePro({
        apiKey: config.production.apiKey,
        apiSecret: config.production.secret,
        passphrase: config.production.passphrase,
        useSandbox: false
      })
    } else {
      return null
    }
  },
  getWorkerIDLength() {
    return this.workerIDLength
  },
  checkIfWorkerIsAlreadyRunning(username, workerID) {
    let matchingWorkerFound = false
    if (allWorkers.length >= 1) {
      allWorkers.forEach(el => {
        if (el.username == username && workerID == el.workerID) {
          matchingWorkerFound = true
        }
      })
    }
    return matchingWorkerFound
  }
}
