import axios from "axios"

// set base api URL
if (process.env.VUE_APP_NODE_ENV == "production") {
  axios.defaults.baseURL = process.env.VUE_APP_PRO_API
} else {
  axios.defaults.baseURL =
    process.env.VUE_APP_DEV_API + ":" + process.env.VUE_APP_SERVERPORT
}

// doing something with the request
axios.interceptors.request.use(request => {
  return request
})

// doing something with the response
axios.interceptors.response.use(
  response => {
    // all 2xx/3xx responses will end here

    return response
  },
  error => {
    // all 4xx/5xx responses will end here

    return Promise.reject(error)
  }
)

export default axios
