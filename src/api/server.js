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
var hf = require("./helpers")

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.json({
    message: "Hello from the node5 API!"
  })
})

app.get("/apps", hf.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, err => {
    if (err) {
      res.json(err)
    } else {
      let apps = JSON.parse(fs.readFileSync("./db/apps.json"))
      res.json(apps)
    }
  })
})

app.get("/coinbaseconfig/:username", hf.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, err => {
    if (err) {
      res.json(err)
    } else {
      let username = req.params.username.split(":")[1]
      let config = null
      // read userdata and return coinbaseconfig
      JSON.parse(fs.readFileSync("./db/user.json")).forEach(user => {
        if (user.username == username) {
          config = user.coinbaseconfig
        }
      })
      // check if config was found
      if (config) {
        res.json(config)
      } else {
        res.sendStatus(401)
      }
    }
  })
})

app.get("/checkauth", hf.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, err => {
    if (err) {
      res.sendStatus(401)
    } else {
      res.json({
        message: "You are currently logged in!"
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

app.post("/register", (req, res) => {
  hf.doRegister(req, res)
    .then(data => {
      res.status(200).json({
        status: "success",
        message: data.message
      })
    })
    .catch(error => {
      res.status(401).json({
        status: "failed",
        message: error.message
      })
    })
})

app.post("/login", (req, res) => {
  hf.doLogin(req, res)
    .then(data => {
      res.status(200).json({
        token: data.token,
        email: req.body.email,
        username: req.body.username,
        message: data.message
      })
    })
    .catch(error => {
      res.status(401).json({
        status: "error",
        message: error.message
      })
    })
})

// start server
app.listen(process.env.VUE_APP_SERVERPORT, () => {
  console.log("HTTP Server started on Port " + process.env.VUE_APP_SERVERPORT)
})
