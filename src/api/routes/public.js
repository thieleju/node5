var express = require("express")
var router = express.Router()

var pubDSGVO = require("./public/dsgvo")
var pubApps = require("./public/apps")
var pubFavIcon = require("./public/favicon")

router
  .get("/", (req, res) => {
    res.status(200).json({ message: "Hello from the public api" })
  })
  .use("/dsgvo", pubDSGVO)
  .use("/apps", pubApps)
  .use("/favicon.ico", pubFavIcon)

module.exports = router
