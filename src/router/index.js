import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Dashboard from "../views/Dashboard.vue"
import Startpage from "../views/Startpage.vue"

import store from "../store"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "start",
    component: Startpage
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
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  // {
  //   path: "/admin",
  //   name: "admin",
  //   component: Admin,
  //   meta: {
  //     requiresAuth: true,
  //     is_admin: true
  //   }
  // }
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
  {
    path: "*",
    redirect: "/"
  }
]

const router = new VueRouter({
  mode: "history",
  // base: process.env.VUE_APP_ROOT,
  routes
})

router.beforeEach((to, from, next) => {
  // autologin
  const userString = localStorage.getItem("user")
  if (userString) {
    const userData = JSON.parse(userString)
    store.commit("SET_USER_DATA", userData)
  }
  // check authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters["isAuthenticated"]) {
      next({ name: "start" })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
