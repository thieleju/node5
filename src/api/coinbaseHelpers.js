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

var helpers = require("./helpers")

var allWorkers = []
var workerIDLength = 12

module.exports = {
  /**
   * This function gets only called from the server
   * @param {JSON} decodedToken jwt.verify decoded Token Object
   * @return {Promise} returns promise, which resolves/rejects JSON
   */
  checkWorker(decodedToken) {
    return new Promise((resolve, reject) => {
      var helpers = require("./helpers") // why do I need this?

      // get worker data and status
      let workerData = helpers.getUserConfig("workerData", decodedToken)

      if (!workerData)
        throw new Error({
          status: "error",
          message: "Could not read worker Data"
        })

      // check if worker is running => 1 worker per user
      if (
        module.exports.checkIfWorkerIsAlreadyRunning(
          decodedToken,
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
        var worker = module.exports.startWorker(decodedToken, workerData)

        // add workerdata to allWorkers array to keep track of everything
        allWorkers.push(worker)

        // resolve starting message
        resolve({
          status: workerData.status,
          message: "Worker with ID " + workerData.workerID + "is starting ...",
          workerData
        })
      }
    })
  },
  startWorker(decodedToken, workerData) {
    var helpers = require("./helpers") // why do I need this?
    // create new worker Data Object
    let newWorkerData = {
      username: decodedToken.username,
      workerData
    }

    // create worker object
    const worker = new Worker("./src/api/coinbaseWorker.js", newWorkerData)

    // worker listeners
    worker.on("message", data => {
      // worker gives feedback

      if (data.type == "startup") {
        // change status to online and save
        workerData.status = "online"
        helpers.saveConfig(decodedToken, "workerData", workerData)
      }

      console.log(data)
    })

    worker.on("error", error => {
      // worker threw an error
      console.log(error)
    })

    worker.on("exit", exitCode => {
      // worker exited
      console.log("Exited with code " + exitCode)
    })

    // add workerdata to allWorkers array to keep track
    return newWorkerData
  },
  /**
   * Initialize client with userspecific config
   * @param {JSON} decodedToken decoded jwt token with username and token property
   * @return {CoinbasePro} client
   */
  initClient(decodedToken) {
    helpers.addLogEntry("Initializing Coinbase PRO ...")

    var config = helpers.getUserConfig("coinbaseconfig", decodedToken)

    if (!config) {
      throw new Error({
        status: "error",
        message: "could not initialize config"
      })
    }

    if (config.useSandbox === true) {
      helpers.addLogEntry("Initialized Coinbase Pro SANDBOX")
      return new CoinbasePro({
        apiKey: config.sandbox.apiKey,
        apiSecret: config.sandbox.secret,
        passphrase: config.sandbox.passphrase,
        useSandbox: true
      })
    } else if (config.useSandbox === false) {
      helpers.addLogEntry("Initialized Coinbase Pro LIVE TRADING")
      return new CoinbasePro({
        apiKey: config.production.apiKey,
        apiSecret: config.production.secret,
        passphrase: config.production.passphrase,
        useSandbox: false
      })
    } else {
      throw new Error({
        status: "error",
        message: "could not read sandbox property"
      })
    }
  },
  getWorkerIDLength() {
    return this.workerIDLength
  },
  checkIfWorkerIsAlreadyRunning(decodedToken, workerID) {
    let matchingWorkerFound = false
    if (!allWorkers.length < 1) {
      allWorkers.forEach(el => {
        if (
          el.username == decodedToken.username &&
          workerID == el.workerData.workerID
        ) {
          matchingWorkerFound = true
        }
      })
    }
    return matchingWorkerFound
  }
}
