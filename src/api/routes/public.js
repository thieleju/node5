var express = require("express")
var router = express.Router()

var pubDSGVO = require("./public/dsgvo")
var pubFavIcon = require("./public/favicon")

router.use("/dsgvo", pubDSGVO).use("/favicon.ico", pubFavIcon)

module.exports = router
