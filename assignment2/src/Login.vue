<template>
  <div id="app">

    <v-alert :value=incorrect type="error">
      Incorrect User or password.
    </v-alert>

    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Login form</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="usermail" prepend-icon="person" name="login" label="Username or Email" type="text" @keyup.enter="login(usermail, password)" clearable></v-text-field>
                    <v-text-field v-model="password" prepend-icon="lock" name="password" label="Password" id="password" type="password" @keyup.enter="login(usermail, password)" clearable></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                    <v-btn color="primary" to="/register"> Register </v-btn>
                    <v-btn color="primary" v-on:click="login(usermail, password)"> Login </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  export  default {
    data() {
      return {
        error: "",
        errorFlag: false,
        usermail: "",
        password: "",
        incorrect: false
      }
    },
    mounted: function () {
      if(sessionStorage.getItem("authTok") !== null) this.$router.push('/venues');
      console.log(sessionStorage.getItem("authTok"));
    },
    methods: {
      login: function (usermail, password) {
        this . $http . post ( 'http://localhost:4941/api/v1/users/login', {
          "username": usermail,
          "email": usermail,
          "password": password
        })
          .then(function(response) {
            sessionStorage.setItem("authTok", response.body['token']);
            sessionStorage.setItem("userId", response.body['userId']);
            this.$router.push('/venues');
            document.location.reload();
            } , function (error) {
              if (error.status === 400) {
                this.incorrect = true;
              }
              this.error = error;
              this.errorFlag = true;
            })
      }
    }
  }
</script>
