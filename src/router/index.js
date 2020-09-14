import Vue from "vue"
import VueRouter from "vue-router"
import Dashboard from "../views/Dashboard.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Startpage from "../views/Startpage.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "startpage",
    component: Startpage
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  }
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
