const jwt = require("jsonwebtoken")
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require("fs")
const express = require("express")
const app = express()

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "../../../.env" })

// helper functions
var serverHelper = require("./serverHelper")
var workerHelper = require("./workerHelper")

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.json({
    message: "Hello from the node5 API!"
  })
})

app.get("/apps", serverHelper.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, err => {
    if (err) {
      res.json(err)
    } else {
      let apps = JSON.parse(fs.readFileSync("./db/apps.json"))
      res.json(apps)
    }
  })
})

app.get("/config/:configname", serverHelper.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.json(err)
    } else {
      const config = serverHelper.getUserConfig(
        req.params.configname,
        decoded.username
      )
      if (config) {
        res.json(config)
      } else {
        res.sendStatus(401)
      }
    }
  })
})

app.get("/checkauth", serverHelper.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.sendStatus(401)
    } else {
      res.json({
        message: "You are currently logged in as " + decoded.username
      })
    }
  })
})

app.get("/dsgvo", (req, res) => {
  try {
    var dsgvo = fs.readFileSync("./src/assets/dsgvo.html")
    res.send(dsgvo)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.get("/favicon.ico", (req, res) => {
  try {
    var ico = fs.readFileSync("./public/favicon.ico")
    res.send(ico)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post("/saveSettings", serverHelper.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.sendStatus(401)
    } else {
      serverHelper
        .doSaveConfig(req, res, decoded.username, "coinbaseconfig")
        .then(data => {
          res.status(200).json({
            status: data.status,
            message: data.message
          })
        })
        .catch(error => {
          res.status(200).json({
            status: error.status,
            message: error.message
          })
        })
    }
  })
})

app.post("/register", (req, res) => {
  serverHelper
    .doRegister(req, res)
    .then(data => {
      res.status(200).json({
        status: data.status,
        message: data.message
      })
    })
    .catch(error => {
      res.status(200).json({
        status: error.status,
        message: error.message
      })
    })
})

app.post("/login", (req, res) => {
  serverHelper
    .doLogin(req, res)
    .then(data => {
      res.status(200).json({
        token: data.token,
        email: req.body.email,
        username: req.body.username,
        message: data.message,
        status: data.status
      })
    })
    .catch(error => {
      res.status(200).json({
        status: error.status,
        message: error.message
      })
    })
})

app.get("/coinbaseWorker", serverHelper.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.sendStatus(401)
    } else {
      workerHelper
        .checkWorker(decoded.username)
        .then(data => {
          res.status(200).json({
            status: data.status,
            message: data.message,
            workerData: data.workerData
          })
        })
        .catch(error => {
          res.status(200).json({
            status: error.status,
            message: error.message
          })
        })
    }
  })
})

// start server
app.listen(process.env.VUE_APP_SERVERPORT, () => {
  console.log("HTTP Server started on Port " + process.env.VUE_APP_SERVERPORT)
})
