const fs = require("fs")

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    // https: {
    //   key: fs.readFileSync("cert/privkey.pem"),
    //   cert: fs.readFileSync("cert/fullchain.pem")
    // }
  }
}
