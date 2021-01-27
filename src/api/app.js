const cors = require("cors")
const bodyParser = require("body-parser")

var express = require("express")
var app = express()

app.use(cors())
// check if provided data is a valid json to catch unhandled errors
app.use((req, res, next) => {
  bodyParser.json()(req, res, err => {
    if (err) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid json provided" })
    }
    next()
  })
})

// get secret information from .env
const { config } = require("dotenv")
config({ path: __dirname + "../../../.env" })

var routesAuth = require("./routes/authentication")
var routesCoinbase = require("./routes/coinbase")
var routesPublic = require("./routes/public")
var routesData = require("./routes/data")

app.use("/auth", routesAuth)
app.use("/coinbase", routesCoinbase)
app.use("/public", routesPublic)
app.use("/data", routesData)

// catch every other route
app.get("*", (req, res) => {
  res.status(404).json({ message: "Not found!" })
})

// start server
app.listen(process.env.VUE_APP_SERVERPORT, () => {
  console.log("HTTP Server started on Port " + process.env.VUE_APP_SERVERPORT)
})
