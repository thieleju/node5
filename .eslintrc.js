module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "plugin:prettier/recommended", // we added this line
    "@vue/prettier"
  ],
  rules: {
    "no-console": process.env.VUE_APP_NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.VUE_APP_NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
}
