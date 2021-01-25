var mysql = require("mysql")

var general = require("./general")

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "/.env" })

const auth = {
  host: process.env.VUE_APP_HOST,
  user: process.env.VUE_APP_USER,
  password: process.env.VUE_APP_PASSWORD,
  database: process.env.VUE_APP_DATABASE
}

class SQL_Database {
  constructor(username, debug) {
    this.username = username
    this.debug = debug
    this.queriesExecuted = 0
    this.connection = mysql.createConnection(auth)
    this.connection.connect(err => {
      if (err) {
        throw new Error(err)
      } else {
        if (debug)
          general.addLogEntry(username, "OPENED connection to database")
      }
    })
  }

  executeQuery(query, params) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          this.queriesExecuted += 1
          if (this.debug)
            general.addLogEntry(
              this.username,
              this.queriesExecuted + ". Query executed: " + query
            )
          resolve(rows)
        }
      })
    })
  }

  closeConnection() {
    this.connection.end(err => {
      if (err) throw new Error(err)
      else if (this.debug)
        general.addLogEntry(
          this.username,
          "CLOSED connection with " + this.queriesExecuted + " executed queries"
        )
    })
  }
}

module.exports = SQL_Database
