<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="topnav">
      <v-toolbar color="primary">
        <img src="./assets/reviewlogo.png" alt="" style="cursor: pointer" @click="toVenues">
        <v-spacer></v-spacer>
        <v-toolbar-items>

          <template v-if="user['userId'] != null">
            <v-btn flat color="secondary" :to="'/users/' + user['userId'] + '/venues'" @click="reload">View My Venues</v-btn>
          </template>

          <template v-if="user['userId'] != null">
            <v-btn flat color="secondary" to="/add-venue">Add Venue</v-btn>
          </template>
          <!--<UserDetails></UserDetails>-->


          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="300"
            offset-x
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                v-on="on"
                icon
              >
                <v-avatar color="accent" size="40">
                  <v-img :src="getProfilePic()" v-on:error="imgError"></v-img>
                </v-avatar>
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-list-tile avatar>
                  <v-list-tile-avatar size="80px">
                    <v-img :src="getProfilePic()" v-on:error="imgError"></v-img>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="user.givenName + ' ' + user.familyName"></v-list-tile-title>
                    <v-list-tile-sub-title v-text="user.username"></v-list-tile-sub-title>
                    <v-list-tile-sub-title v-text="user.email"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <v-list></v-list>
              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn flat to="/edit-user">Edit User</v-btn>
                <v-btn flat @click="loginOrOut" v-text="loginout"></v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

        </v-toolbar-items>
      </v-toolbar>
  </div>
</template>

<script>
  import UserDetails from './User';
  export default {
    data() {
      return {
        name: "Navbar",
        loginout: "Login",
        components: {
          'UserDetails': UserDetails
        },
        user: {
          userId: null,
          username: "",
          givenName: "NOT",
          familyName: "LOGGED IN",
          email: null
        },
        fav: true,
        menu: false,
        message: false,
        hints: true,
        imgErr: false
      }
    },
    mounted: function () {
      this.getUserDetails();
      this.checkLoggedIn();
    },
    methods: {
      checkLoggedIn: function () {
        let authTok = sessionStorage.getItem("authTok");
        console.log(authTok);
        if (authTok !== null) this.loginout = "Logout";
      },
      loginOrOut: function () {
        let authTok = sessionStorage.getItem("authTok");
        if (authTok !== null) {
          this.$http.post("http://localhost:4941/api/v1/users/logout", {}, {headers: {"X-Authorization": authTok}})
            .then(function(response) {
              sessionStorage.removeItem("authTok");
              sessionStorage.removeItem("userId");
          } , function(error) {
              this.error = error;
              this.errorFlag = true;
            });
          this.loginout = "Login";
          document.location.reload();
        } else {
          this.$router.push('/login');
        }
      },
      
      
      getUserDetails: function () {
        let authTok = sessionStorage.getItem("authTok");
        this.user.userId = sessionStorage.getItem("userId");
        this.$http.get("http://localhost:4941/api/v1/users/" + this.user.userId, {headers: {"X-Authorization": authTok}})
          .then(function(response) {
            this.user.username = response.body['username'];
            this.user.givenName = response.body['givenName'];
            this.user.familyName = response.body['familyName'];
            this.user.email = response.body['email'];
          } , function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },
      getProfilePic: function () {
        if (!this.imgErr && this.user.userId !== null) {
          return "http://localhost:4941/api/v1/users/" + this.user.userId + "/photo"
        }
        return require('./assets/defaultProfilePic.png');
      },
      imgError: function () {
        if (this.userId !== null) this.imgErr = true;
      },
      toVenues: function () {
        this.$router.push("/venues");
        document.location.reload();
      },
      reload: function () {
        document.location.reload();
      }
    }
  };
</script>

