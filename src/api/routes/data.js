var express = require("express")
var router = express.Router()

var dataApps = require("./data/apps")

router.use("/apps", dataApps)

module.exports = router
