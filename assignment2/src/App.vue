<template>
  <div id="app">
    <v-app>
    <Navigation v-if='this.$route.path !== "login" || this.$route.path !== "register"'></Navigation>
      <v-content>
    <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import Navigation from './Nav'
  export  default {
    name: 'app',
    components: {
      'Navigation': Navigation
    }
  }
</script>
