<template>
  <div id="app">
    <v-app>
    <Navigation></Navigation>
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
