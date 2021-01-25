var express = require("express")
var router = express.Router()

router.get("/", (req, res) => {
  res.status(200).json({ message: "This is the registration route" })
})

module.exports = router
