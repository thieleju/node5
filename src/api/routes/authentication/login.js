const crypto = require("crypto-js")
const jwt = require("jsonwebtoken")
const moment = require("moment")

var express = require("express")
var router = express.Router()

var general = require("../../general")

const token_expire = "1d"

const SQL_Database = require("../../sql_database")

router.post("/", async (req, res) => {
  try {
    if (!req.body || !req.body.password || !req.body.username)
      throw "Missing password or username"

    let sqldb = new SQL_Database(req.body.username, true)

    function throwError(error) {
      // close db connection
      sqldb.closeConnection()
      throw error
    }

    let data = await sqldb.executeQuery(
      "select username, salt from users where username = ?;",
      [req.body.username]
    )

    if (data.length == 0) throwError("User could not be found!")
    if (data.length > 1) throwError("Multiple users found!")
    if (!data[0].salt) throwError("Salt could not be found!")

    // generate password hash => sha256(password + salt)
    const hash = crypto.enc.Base64.stringify(
      crypto.SHA256(req.body.password + data[0].salt)
    )

    // check if user is valid
    data = await sqldb.executeQuery(
      "select activated, username, password from users where username = ? and password = ?;",
      [req.body.username, hash]
    )

    if (data.length == 0) throwError("Invalid password!")
    if (data.length > 1) throwError("Identical users found!")
    if (data[0].activated == 0) throwError("Account deactivated!")

    // set users last login date
    await sqldb.executeQuery(
      "update users set lastLogin = ? where username = ?;",
      [moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), req.body.username]
    )

    // close db connection
    sqldb.closeConnection()

    // generate jwt token
    const token = jwt.sign(
      { username: req.body.username },
      process.env.VUE_APP_SECRET_KEY,
      { expiresIn: token_expire }
    )
    // return jwt token
    res.status(200).json({
      status: "success",
      message: "Signed in as user " + req.body.username,
      token
    })
  } catch (error) {
    general.addLogEntry(req.body.username, error)
    res.status(400).json({ status: "error", message: error })
  }
})

module.exports = router
