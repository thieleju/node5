const crypto = require("crypto-js")
const jwt = require("jsonwebtoken")
const fs = require("fs")

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "/.env" })

module.exports = {
  doRegister(req, res) {
    return new Promise((resolve, reject) => {
      if (!req.body) reject({ message: "Failed to receive data" })
      // user array
      const obj = crypto.SHA256(req.body.password)
      const pwd = crypto.enc.Base64.stringify(obj)
      const user = {
        username: req.body.username,
        email: req.body.email,
        password: pwd,
        activated: false
      }

      // read users data
      var d = fs.readFileSync("./db/user.json")
      var userArray = JSON.parse(d)
      // resolve(userArray)
      // reject promise if user already exits
      userArray.forEach(el => {
        if (el.username == user.username || el.email == user.email) {
          reject({ status: "error", message: "User already exits!" })
        }
      })
      // add to array
      userArray.push(user)
      // convert to string
      var data = JSON.stringify(userArray, null, 2)
      // write to file
      fs.writeFile("db/user.json", data, err => {
        if (err) reject({ status: "error", message: "Failed to write to file" })
        // resolve promise
        resolve({ status: "success", message: "Account " + user.username + " requested" })
      })
    })
  },
  doLogin(req, res) {
    return new Promise((resolve, reject) => {
      if (!req.body) reject({status: "error",  message: "Failed to receive data" })
      // user array
      const obj = crypto.SHA256(req.body.password)
      const pwd = crypto.enc.Base64.stringify(obj)
      const user = {
        username: req.body.username,
        password: pwd
      }
      // read users data
      var userArray = JSON.parse(fs.readFileSync("./db/user.json"))
      // loop through users
      userArray.forEach(el => {
        if (el.username === user.username && el.password === user.password) {
          if (el.activated) {
            const token = jwt.sign(
              { username: el.username, email: el.email },
              process.env.VUE_APP_SECRET_KEY
            )
            resolve({status: "success",  message: "Signing in as user "+user.username+" ...", token })
          } else {
            reject({ status: "error", message: "Account not activated" })
          }
        }
      })
      reject({ status: "error", message: "User not found or wrong credentials" })
    })
  },
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
  isTokenUserCurrentUser(decodedToken, username) {
    JSON.parse(fs.readFileSync("./db/user.json")).forEach(user => {
      if(decodedToken.username === username) {
        return true;
      }
    })
    return false;
  },
  getUserConfig(configName, decodedToken) {
    // read user data
    var users = JSON.parse(fs.readFileSync("./db/user.json"))
    // loop through users to check if current signed in user matches
    var userData = null
    users.forEach(user => {
      if(decodedToken.username == user.username) {
        userData = user[configName]
      }
    })

    if(userData) {
      return userData;
    } else {
      return null;
    }
  },
  doSaveSettings(req, res) {
    return new Promise((resolve, reject) => {
      resolve({message: "Shippi hat nen großen Lümmel"})
      //reject({message: "Shippi hat nen kleinen Lümmel"})
    })
  }
}
