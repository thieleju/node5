const jwt = require("jsonwebtoken")
const fs = require("fs")

var express = require("express")
var router = express.Router()

var general = require("../../general")

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "/.env" })

router.get("/", general.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, err => {
    if (err) {
      res.json(err)
    } else {
      let apps = JSON.parse(fs.readFileSync("./db/apps.json"))
      res.json(apps)
    }
  })
})

module.exports = router
