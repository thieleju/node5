const moment = require("moment")
//
module.exports = {
  verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"]

    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ")
      const bearerToken = bearer[1]
      req.token = bearerToken
      next()
    } else {
      res.sendStatus(401)
    }
  },
  addLogEntry(user, message) {
    let log = module.exports.getTimestamp() + " | " + user + " > " + message
    console.log(log)
  },
  getTimestamp() {
    return moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
  },
  generateID(length) {
    let result = ""
    let characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  },
  generateSalt() {
    let result = ""
    let characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }
}
