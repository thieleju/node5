import Vue from "vue"
import VueRouter from "vue-router"
import store from "../store"
// # Navigation
// views
import Startpage from "../Navigation/views/Startpage.vue"
import Login from "../Navigation/views/Login.vue"
import Register from "../Navigation/views/Register.vue"
// # Home
// views
import Home from "../Home/Home.vue"
// children
import Start from "../Home/views/Start.vue"
import Dashboard from "../Home/views/Dashboard.vue"
import Portfolio from "../Home/views/Portfolio.vue"
import Bots from "../Home/views/Bots.vue"
import Settings from "../Home/views/Settings.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "startpage",
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
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true
    },
    children: [
      { path: "", redirect: { name: "home.start" } },
      {
        path: "/home/start",
        name: "home.start",
        component: Start
      },
      {
        path: "/home/dashboard",
        name: "home.dashboard",
        component: Dashboard
      },
      {
        path: "/home/portfolio",
        name: "home.portfolio",
        component: Portfolio
      },
      {
        path: "/home/bots",
        name: "home.bots",
        component: Bots
      },
      {
        path: "/home/settings",
        name: "home.settings",
        component: Settings
      }
    ]
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
      next({ name: "startpage" })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
