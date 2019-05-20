import Vue from 'vue'
import Home from './Home.vue'
import Login from "./Login"
import Register from "./Register"
import Venues from './Venues.vue'
import App from './App.vue'
import EditUser from './EditUser'
import Vuetify from 'vuetify'
Vue.use(Vuetify, {
  theme: {
    primary: '#4392da',
    secondary: '#000000',
    accent: '#e9e61c'
  }
});
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.emulateJson = true;

const routes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/register",
    component: Register
  },
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/venues",
    name: "venues",
    component: Venues
  },
  {
    path: "/edit-user",
    component: EditUser
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App),

  props: {
    source: String
  }
});
