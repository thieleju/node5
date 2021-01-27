const moment = require("moment")
const mysql = require("mysql")

const mySQLauth = {
  host: process.env.VUE_APP_HOST,
  user: process.env.VUE_APP_USER,
  password: process.env.VUE_APP_PASSWORD,
  database: process.env.VUE_APP_DATABASE
}

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "/.env" })

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
  },
  executeSQLQuery(username, query, params) {
    return new Promise((resolve, reject) => {
      // create new connection
      let con = mysql.createConnection(mySQLauth)
      // start handshake sequence
      con.connect(err => {
        if (err) reject(err)
        // execute query
        con.query(query, params, (err, rows) => {
          if (err) reject(err)
          else {
            // close connection when query is done
            con.end(err => reject(err))
            // log query and resolve promise
            module.exports.addLogEntry(username, "[QUERY] " + query)
            resolve(rows)
          }
        })
      })
    })
  }
}
