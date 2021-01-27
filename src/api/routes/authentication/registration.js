const crypto = require("crypto-js")
const moment = require("moment")

var express = require("express")
var router = express.Router()

var general = require("../../general")

router.post("/", async (req, res) => {
  try {
    if (!req.body || !req.body.password || !req.body.username)
      throw "Missing password or username"

    // check if user already exists
    let data = await general.executeSQLQuery(
      req.body.username,
      "select username from users where username = ?",
      [req.body.username]
    )

    if (data.length != 0) throw "Username already taken!"

    let email = ""
    if (req.body.email) email = req.body.email
    else email = ""

    // generate password hash => sha256(password + salt)
    const salt = general.generateSalt()
    const hash = crypto.enc.Base64.stringify(
      crypto.SHA256(req.body.password + salt)
    )

    // create new deactivated user
    data = await general.executeSQLQuery(
      req.body.username,
      "insert into users ( activated, username, email, password, salt, lastLogin) values (?,?,?,?,?,?);",
      [
        "0",
        req.body.username,
        email,
        hash,
        salt,
        moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      ]
    )
    general.addLogEntry(
      req.body.username,
      "Registered new account successfully!"
    )
    // return jwt token
    res.status(200).json({
      status: "success",
      message: "Requested account " + req.body.username
    })
  } catch (error) {
    general.addLogEntry(req.body.username, error)
    res.status(200).json({ status: "error", message: error })
  }
})

module.exports = router
