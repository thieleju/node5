var express = require("express")
var router = express.Router()

var authLogin = require("./authentication/login")
var authRegistration = require("./authentication/registration")
var authCheckAuth = require("./authentication/checkauth")

router
  .get("/", (req, res) => {
    res.status(200).json({ message: "Hello from the authentication api" })
  })
  .use("/login", authLogin)
  .use("/registration", authRegistration)
  .use("/checkauth", authCheckAuth)

module.exports = router
