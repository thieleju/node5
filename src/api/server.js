const jwt = require("jsonwebtoken")
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require("fs")
const https = require("https")
const express = require("express")
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

app.get("/api/apps", hf.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, err => {
    if(err) {
      res.json(err)
    } else {
      res.json({apps:fs.readFileSync("./db/apps.json")})
    }
  })
})

app.get("/api/dashboard", hf.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, err => {
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
    res.status(400).json(error)
  }
})

app.post("/api/register", (req, res) => {
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

app.post("/api/login", (req, res) => {
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

if (process.env.VUE_APP_NODE_ENV === "production") {
  const credentials = {
    key: fs.readFileSync("cert/privkey.pem", "utf8"),
    cert: fs.readFileSync("cert/fullchain.pem", "utf8")
  }
  https
    .createServer(credentials, app)
    .listen(process.env.VUE_APP_PRO_SERVERPORT, () => {
      console.log(
        "HTTPS: Server started on port: " + process.env.VUE_APP_PRO_SERVERPORT
      )
    })
} else {
  app.listen(process.env.VUE_APP_DEV_SERVERPORT, () => {
    console.log(
      "HTTP: Server started on port:" + process.env.VUE_APP_DEV_SERVERPORT
    )
  })
}

//DAITdZsmQK3rnwThTlJj45Ycnblvh5bX4SAdxHnntk9rhB5PhvkCx6h6S0uwGU4B4TIvJp94pZoeV1cvm3LQFMNLQ6FomAkHoqZzRUCbDiJvKK2B5HeFUrGrhwtxwUDyg12DovkANDpxnnMtIfbk3UxSUo8fQt6ohoRxlufBx25I3bFi5BUQXeUNWRu4t6MtvXOpr7E1TJyo27uDpCIYTmJJNSBUAZKVJVjb8Cw9pdw4QGz5X5mWhsDjyboPqMMIBAPMNTbJtWoVtwMmXb7Ks8CO2BaOvSGQngpe1BH4WRxz9bLAdkkeMCV2QP9Lsbe2h6YYHjedAVcsazyEIFlBgvIWPdU83RpgdzhDbM105M5X8NUdo90ldWr6I6rUhbGcRvPREfuRXlphoKqkQp5oPcKUina67tdyj3bFHHdRCKBx7emMCBB9J8Ra32RpRijJ40r2sdF6up7316PgTObqSp46BTZwcZhzQUEJYcD8nPacrOWKUC66zhcCYl2DJa8JyhwwnUIBfmJixhaRWVm