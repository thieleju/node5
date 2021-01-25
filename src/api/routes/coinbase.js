var express = require("express")
var router = express.Router()

// var authLogin = require("./authentication/login")
// var authRegistration = require("./authentication/registration")

router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the coinbase api" })
})
//   .use("/login", authLogin)
//   .use("/registration", authRegistration)

module.exports = router
