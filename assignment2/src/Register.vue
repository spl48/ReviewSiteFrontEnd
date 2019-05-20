<template>
  <div id="app">

    <v-alert :value=incorrect type="error">
      Username or email already in use.
    </v-alert>

    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Register form</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form v-model="valid">
                    <v-text-field v-model="fName" prepend-icon="person" :rules="requiredRule" label="First Name" required clearable></v-text-field>
                    <v-text-field v-model="lName" prepend-icon="person" :rules="requiredRule" label="Last Name" required clearable></v-text-field>
                    <v-text-field v-model="username" prepend-icon="face" :rules="usernameRules" label="Username" counter="64" required clearable></v-text-field>
                    <v-text-field v-model="email" prepend-icon="mail" :rules="emailRules" label="E-mail" required clearable></v-text-field>
                    <v-text-field v-model="password" prepend-icon="lock" :rules="requiredRule" label="Password" type="password" required clearable></v-text-field>
                    <v-text-field v-model="confirmPassword" prepend-icon="lock" :rules="passwordRules" label="Confirm Password" type="password" required clearable></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" :disabled="!valid" v-on:click="register(fName, lName, username, email, password)"> Register </v-btn>
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
        valid: false,
        incorrect: false,
        error: "",
        errorFlag: false,
        fName: "",
        lName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        requiredRule: [
          v => !!v || 'Required',
        ],
        usernameRules: [
          v => !!v || 'Required',
          v => (v && v.length <= 64) || 'Username must be less than 64 characters'
        ],
        emailRules: [
          value => !!value || 'Required',
          v => /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v) || 'E-mail must be valid'
        ],
        passwordRules: [
          v => !!v || 'Required',
          (v) => (v === this.password) || 'Passwords do not match'
        ]
      }
    },
    methods: {
      // validate () {
      //   if (this.$refs.form.validate()) {
      //
      //   }
      // },
      register: function (fname, lname, username, email, password) {
        this . $http . post ( 'http://localhost:4941/api/v1/users', {
          "username": username,
          "givenName": fname,
          "familyName": lname,
          "email": email,
          "password": password
        })
          .then(function(response) {
            this.login();
          } , function (error) {
            if (error.status === 400) {
              this.incorrect = true;
            }
            this.error = error;
            this.errorFlag = true;
          })
        // this . $http . post ( 'http://localhost:4941/api/v1/users/login', {
        //   "username": usermail,
        //   "password": password
        // })
      },
      login: function () {
        this . $http . post ('http://localhost:4941/api/v1/users/login', {
          "username": this.username,
          "email": this.email,
          "password": this.password
        }) .then(function(response) {
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
