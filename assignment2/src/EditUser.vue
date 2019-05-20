<template>
  <div id="app">
    <v-alert :value=incorrect type="error">
      Old Password is Incorrect.
    </v-alert>

    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Edit Details</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form v-model="valid">
                    <v-text-field v-model="givenName" prepend-icon="person" name="givenName" label="Given Name" type="text" @keyup.enter="edit()" clearable></v-text-field>
                    <v-text-field v-model="familyName" prepend-icon="person" name="familyName" label="Family name" type="text" @keyup.enter="edit()" clearable></v-text-field>
                    <v-divider v-show="show"></v-divider>
                    <v-text-field :disabled="!show" v-show="show" v-model="oldPassword" prepend-icon="lock" :rules="requiredRule" name="password" label="Old Password" id="password" type="password" clearable></v-text-field>
                    <v-text-field :disabled="!show" v-show="show" v-model="newPassword" prepend-icon="lock" :rules="requiredRule" label="New Password" type="password" required clearable></v-text-field>
                    <v-text-field :disabled="!show" v-show="show" v-model="confirmPassword" prepend-icon="lock" :rules="passwordRules" label="Confirm New Password" type="password" required clearable></v-text-field>

                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" v-on:click="show=!show">Edit Password<v-icon>{{ show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" :disabled="show ? !valid : false" v-on:click="edit"> Edit </v-btn>
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
        incorrect: false,
        valid: false,
        error: "",
        errorFlag: false,
        username: "",
        givenName: "",
        familyName: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        show: false,
        requiredRule: [
          v => !!v || 'Required',
        ],
        passwordRules: [
          v => !!v || 'Required',
          (v) => (v === this.newPassword) || 'Passwords do not match'
        ],
        userId: null
      }
    },
    mounted: function () {
      this.getUserDetails();
    },
    methods: {
      getUserDetails: function () {
        let authTok = sessionStorage.getItem("authTok");
        this.userId = sessionStorage.getItem("userId");
        this.$http.get("http://localhost:4941/api/v1/users/" + this.userId, {headers: {"X-Authorization": authTok}})
          .then(function(response) {
            this.givenName = response.body['givenName'];
            this.familyName = response.body['familyName'];
            this.oldPassword = response.body['password'];
            this.username = response.body['username'];
          } , function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },
      edit: function () {
        let authTok = sessionStorage.getItem("authTok");
        if(this.show) {
          //-------------------------------------------------------- checkOldPassword
          this . $http . post ( 'http://localhost:4941/api/v1/users/login', {
            "username": this.username,
            "password": this.oldPassword
          })
            .then(function(response) {
              sessionStorage.setItem("authTok", response.body['token']);
              //-------------------------------------------- Edit
              this . $http . patch ( 'http://localhost:4941/api/v1/users/' + this.userId, {
                "givenName": this.givenName,
                "familyName": this.familyName,
                "password": this.newPassword
              }, {headers: {"X-Authorization": response.body['token']}})
                .then(function(response) {
                  this.$router.push('/venues');
                  document.location.reload();
                } , function (error) {
                  console.log(error);
                  this.error = error;
                  this.errorFlag = true;
                })
              //------------------------------------------------
            } , function (error) {
              if (error.status === 400) {
                this.incorrect = true;
              }
              this.error = error;
              this.errorFlag = true;
              return error;
            });
          //--------------------------------------------------------------------------
        } else {
          this . $http . patch ( 'http://localhost:4941/api/v1/users/' + this.userId, {
            "givenName": this.givenName,
            "familyName": this.familyName
          }, {headers: {"X-Authorization": authTok}})
            .then(function(response) {
              this.$router.push('/venues');
              document.location.reload();
            } , function (error) {
              this.error = error;
              this.errorFlag = true;
            })
        }

      },
      // checkOldPassword: function(pswrd) {
      //   this . $http . post ( 'http://localhost:4941/api/v1/users/login', {
      //     "username": this.username,
      //     "password": pswrd
      //   })
      //     .then(function(response) {
      //       sessionStorage.setItem("authTok", response.body['token']);
      //       // this.incorrect = false;
      //       return response;
      //     } , function (error) {
      //       if (error.status === 400) {
      //         this.incorrect = true;
      //       }
      //       this.error = error;
      //       this.errorFlag = true;
      //       return error;
      //     });
      // }
    }
  }
</script>
