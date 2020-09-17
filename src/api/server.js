const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require("fs")
const https = require("https")
const app = express()

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "../../../.env" })

// helper functions
var hf = require("./helpers")

app.use(cors())
app.use(bodyParser.json())

app.get("/api/", (req, res) => {
  // var userArray = JSON.parse(fs.readFileSync("./db/user.json"))
  // const pwd = crypto.SHA256("asdf")
  // var msg = crypto.enc.Base64.stringify(pwd)
  res.json({
    message: "Go away!"
  })
})

app.get("/api/dashboard", hf.verifyToken, (req, res) => {
  jwt.verify(req.token, "the_secret_key", err => {
    if (err) {
      res.sendStatus(401)
    } else {
      res.json({
        message: "You're a good person"
      })
    }
  })
})

app.get("/api/dsgvo.html", (req, res) => {
  try {
    var dsgvo = fs.readFileSync("./src/assets/dsgvo.html")
    res.send(dsgvo)
  } catch (error) {
    res.status(400)
    res.json(error)
  }
})

app.post("/api/register", (req, res) => {
  hf.doRegister(req, res)
    .then(data => {
      res.status(200)
      res.json({
        status: "success",
        message: data
      })
    })
    .catch(err => {
      res.status(401)
      res.json({
        status: "failed",
        message: err
      })
    })
})

app.post("/api/login", (req, res) => {
  hf.doLogin(req, res)
    .then(token => {
      res.status(200)
      res.json({
        token,
        email: req.body.email,
        username: req.body.username,
        message: "Login Successful"
      })
    })
    .catch(error => {
      res.status(401)
      res.json({
        status: "error",
        message: error
      })
    })
})

let serverPort = null

if (process.env.VUE_APP_NODE_ENV === "production") {
  serverPort = process.env.VUE_APP_PRO_SERVERPORT
} else {
  serverPort = process.env.VUE_APP_DEV_SERVERPORT
}

app.listen(serverPort, () => {
  console.log("Server started on port " + serverPort)
})
