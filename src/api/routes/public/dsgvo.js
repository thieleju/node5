const fs = require("fs")

var express = require("express")
var router = express.Router()

router.get("/", (req, res) => {
  try {
    var dsgvo = fs.readFileSync("./src/assets/dsgvo.html")
    res.send(dsgvo)
  } catch (error) {
    res.status(400).json(error)
  }
})

module.exports = router
