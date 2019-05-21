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

          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="400"
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
              <v-card-title>
              <v-list>
                <v-list-tile avatar>
                  <v-list-tile-avatar size="90px">
                    <template v-if="user['userId'] != null"><v-img :src="getProfilePic()" v-on:error="imgError" v-on:click="changePhoto = true" style="cursor: pointer"></v-img></template>
                    <template v-else><v-img :src="getProfilePic()" v-on:error="imgError"></v-img></template>

                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="user.givenName + ' ' + user.familyName"></v-list-tile-title>
                    <v-list-tile-sub-title v-text="user.username"></v-list-tile-sub-title>
                    <v-list-tile-sub-title v-text="user.email"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <v-list></v-list>
              </v-card-title>
              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <div v-if="!imgErr">
                  <v-btn v-if="user['userId'] != null" flat color="accent" v-on:click="changePhoto = true">Change/Delete Picture</v-btn>
                </div>
                <div v-else>
                  <v-btn v-if="user['userId'] != null" flat color="accent" v-on:click="changePhoto = true">Upload Picture</v-btn>
                </div>
                <v-btn v-if="user['userId'] != null" flat to="/edit-user" flat color="accent">Edit User</v-btn>
                <v-btn flat @click="loginOrOut" v-text="loginout" flat color="accent"></v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-dialog v-model="changePhoto" width="420px">
            <v-card>
              <v-card-text style="text-align:center; color:#f3884a; font-size:20px;">
                Select New Profile Picture
              </v-card-text>
                <v-card-actions>
                  <input type="file" id="file" ref="file" v-on:change="handleFileUpload()">
                  <v-btn :disabled="file == '' || file == null" color="primary" v-on:click="submitFile()">Upload Photo</v-btn>
                </v-card-actions>
              <v-divider v-if="!imgErr"></v-divider>
              <v-card-text v-if="!imgErr" style="text-align:center; color:#f3884a; font-size:20px;">Delete Current Picture</v-card-text>
              <v-card-actions>
                <v-btn v-if="!imgErr" block color="primary" v-on:click="deleteProfilePicture">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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
        imgErr: false,
        changePhoto: false,
        file: null
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
      },
      handleFileUpload() {
        this.file = this.$refs.file.files[0];
      },
      submitFile() {
        let authTok = sessionStorage.getItem("authTok");
        if (this.file.size <= 20000000 && (this.file.type == "image/png" || this.file.type == "image/jpeg")) {
          this.$http.put( 'http://localhost:4941/api/v1/users/' + this.user['userId'] + '/photo',
            this.file,
            {
              headers: {
                "X-Authorization": authTok,
                'Content-Type': this.file.type
              }
            }
          ).then(function(response){
            document.location.reload();
          }), function (error) {
            this.error = error;
            this.errorFlag = true;
          }
        } else {
          alert("File size too big or wrong file type (only allowed .png and .jpeg")
        }
      },
      deleteProfilePicture: function () {
        let authTok = sessionStorage.getItem("authTok");
        this.$http.delete( 'http://localhost:4941/api/v1/users/' + this.user['userId'] + '/photo', {headers: {"X-Authorization": authTok}})
          .then(function (response) {
            document.location.reload();
          }), function (error) {
            this.error = error;
            this.errorFlag = true;
        }
      }
    }
  };
</script>

