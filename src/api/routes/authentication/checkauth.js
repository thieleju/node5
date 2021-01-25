var express = require("express")
var router = express.Router()

var general = require("../../general")

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "/.env" })

router.get("/", general.verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.VUE_APP_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.sendStatus(401)
    } else {
      res.json({
        username: decoded.username,
        message: "You are currently logged in"
      })
    }
  })
})

module.exports = router
