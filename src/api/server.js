const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require("fs")
const https = require("https")

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "../../../.env" })

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get("/api/", (req, res) => {
  res.json({
    message: "Welcome to the API."
  })
})

app.get("/api/dashboard", verifyToken, (req, res) => {
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

app.post("/api/register", (req, res) => {
  if (req.body) {
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      activated: false
      // You'll want to encrypt the password in a live app
    }

    // read users data
    var userDB = fs.readFileSync("./db/user.json")
    var userInfo = JSON.parse(userDB)

    var userAlreadyExits = false
    userInfo.forEach(el => {
      if (el.username == user.username || el.email == user.email) {
        userAlreadyExits = true
      }
    })

    // user already exits -> exit
    if (userAlreadyExits) {
      res.json({
        status: "error",
        message: "Account " + user.username + " already exits"
      })
    }

    // add to array
    userInfo.push(user)
    // convert and write to file
    var data = JSON.stringify(userInfo, null, 2)

    fs.writeFile("db/user.json", data, err => {
      if (err) res.json(err)

      res.json({
        status: "success",
        message: "Account " + user.username + " has been requested!"
      })
    })

    // const token = jwt.sign({ user }, process.env.VUE_APP_SECRET_KEY)
    // res.json({
    //   token,
    //   email: user.email,
    //   username: user.username
    // })
  } else {
    res.sendStatus(401)
  }
})

app.post("/api/login", (req, res) => {
  var userDB = fs.readFileSync("./db/user.json")
  var userInfo = JSON.parse(userDB)

  var foundSomeone = false

  if (req.body) {
    userInfo.forEach(user => {
      if (
        user.username === req.body.username &&
        user.password === req.body.password &&
        user.activated
      ) {
        foundSomeone = true
        const token = jwt.sign({ userInfo }, process.env.VUE_APP_SECRET_KEY)
        res.json({
          token,
          email: user.email,
          username: user.username
        })
      }
    })
    if (!foundSomeone) {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(401)
  }
})

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"]

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ")
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(401)
  }
}

let serverPort = null

if (process.env.VUE_APP_NODE_ENV === "production") {
  serverPort = process.env.VUE_APP_PRO_SERVERPORT
} else {
  serverPort = process.env.VUE_APP_DEV_SERVERPORT
}

app.listen(serverPort, () => {
  console.log("Server started on port " + serverPort)
})
