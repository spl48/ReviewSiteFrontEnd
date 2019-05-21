<template>
  <div id="app">
    <v-app id="inspire">

      <v-alert :value=incorrect type="error" dismissible>
        Your account has already reviewed this venue
      </v-alert>

      <v-dialog
        v-model="dialog"
        width="275"
      >
        <v-card style="text-align:center;">
          <v-card-text
            class="subheading"
          >
            Username: {{ clickedOnUser.username }}
          </v-card-text>
          <v-card-text
            class="subheading">
            Name: {{ clickedOnUser.givenName }}
            {{ clickedOnUser.familyName }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="dialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="reviewPopup" max-width="550px">
        <v-card>
          <v-card-title>
            <span class="headline">Review</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-form v-model="valid">
                <v-layout row>
                  <v-flex></v-flex>
                  <v-flex>
                    <span class="headline">Star Rating</span>
                  </v-flex>
                  <v-flex></v-flex>
                  <v-flex></v-flex>
                  <v-flex >
                    <span class="headline">Cost Rating</span>
                  </v-flex>
                  <v-flex></v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex >
                    <v-rating v-model="reviewToSubmit.starRating" hover></v-rating>
                  </v-flex>
                  <v-flex >
                    <v-slider v-model="reviewToSubmit.costRating" :tick-labels="['FREE', '$', '$$', '$$$', '$$$$']" max="4" step="1" ticks="always"></v-slider>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="reviewToSubmit.reviewBody" label="Review Body" :rules="requiredRule" required></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="reviewPopup = false">Cancel</v-btn>
            <v-btn :disabled="!valid" color="blue darken-1" flat @click="reviewPopup = false, postReview()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container fluid grid-list-md>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm1>
            <v-card>
              <div v-if="photos.length != 0">
              <v-carousel>

                  <v-carousel-item
                    v-for="(photo,i) in photos"
                    :key="i"
                    :src="'http://localhost:4941/api/v1/venues/' + venueId + '/photos/' + photo['photoFilename']"
                  ></v-carousel-item>
              </v-carousel>
              </div>
              <div v-else>
                <v-card-title>
                  <v-img
                    :src="getDefaultPhoto()"
                    contain
                    height="300"
                  ></v-img>
                </v-card-title>
              </div>

              <v-card-title primary-title>
                <div>
                  <h1 class="headline text-xs-center" v-text="venueInfo['venueName']"></h1>
                  <h1 class="subheading" v-text="venueInfo['category']['categoryName']"></h1>
                </div>
              </v-card-title>

              <v-card-text>
                <div>
                  <v-card-text color=blue v-text="'Admin: ' + venueInfo['admin']['username']" v-on:click=""></v-card-text>
                  <v-card-text v-text="'Address: ' + venueInfo['address'] + ', ' + venueInfo['city']"></v-card-text>
                  <span v-text="'Description: ' + venueInfo['shortDescription']"></span>
                  <span v-show="show" v-text="venueInfo['longDescription']"></span>
                  <v-btn icon @click="show = !show">
                    <v-icon>{{ show ? 'keyboard_arrow_left' : 'keyboard_arrow_right' }}</v-icon>
                  </v-btn>
                  <v-card-text class="text-xs-right" v-text="venueInfo['dateAdded'].slice(0, 10)"></v-card-text>
                </div>
                <!--<v-slide-y-transition>-->
                  <!--<v-card-text v-show="show" v-text="venueInfo['longDescription']">-->
                  <!--</v-card-text>-->
                <!--</v-slide-y-transition>-->
              </v-card-text>

              <v-card-actions>
                <v-btn color="accent" v-show="isAdmin" :to="'/edit-venue/' + venueId">Edit</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs4 >
            <v-card>
              <v-card-title primary-title>
                <v-layout row>
                  <v-spacer></v-spacer>
                  <div v-if="venueRatings.star !== null">
                    <h2 style="text-align:center;">Average Star Rating</h2>
                    <v-rating size="50px" color="primary" v-model="venueRatings.star" half-increments readonly></v-rating>
                    <h2 style="text-align:center;">Most Common Cost Rating</h2>
                    <!--<v-rating size="50px" color="primary" v-model="venueRatings.cost" full-icon="attach_money" empty-icon="attach_money" half-icon="attach_money" readonly></v-rating>-->
                    <h2 style="text-align:center; color:#f3884a; font-size:50px;" size="50px" v-text="'$'.repeat(venueRatings.cost) || 'Free'"></h2>
                  </div>
                  <div v-else>
                    <h2 style="text-align:center;">No Reviews</h2>
                    <h2 style="text-align:center;">No Reviews</h2>
                  </div>
                  <v-spacer></v-spacer>
                </v-layout>
              </v-card-title>
            </v-card>
            <v-container fluid grid-list-md>
              <div v-show="reviews.length > 0">
              <v-card color="accent">
                <h2 style="text-align:center;">Recent Reviews</h2>
              </v-card>
              <v-data-iterator
                :items="reviews"
                :rows-per-page-items="[1]"
                :pagination.sync="pagination"
                content-tag="v-layout"
                aria-rowcount="wrap"
                >
                <template v-slot:item="props">
                  <v-flex
                    xs128
                    sm64
                    md32
                    lg12
                  >
                    <v-card>
                      <v-card-text>
                        <v-layout row>
                          <v-flex></v-flex>
                          <v-btn large color="primary" style="text-align:center;" v-on:click="getUser(props.item.reviewAuthor.userId)">
                            {{ props.item.reviewAuthor.username }}
                          </v-btn>
                          <v-flex></v-flex>
                        </v-layout>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-text style="text-align:center;">
                        {{ props.item.reviewBody }}
                      </v-card-text>
                      <v-card-text>
                        <v-layout row align-centre>
                          <v-spacer></v-spacer>
                          <div>
                            <h4 style="text-align:center;">Star Rating</h4>
                            <v-rating size="25px" color="primary" v-model="props.item.starRating" half-increments readonly></v-rating>
                            <h4 style="text-align:center;">Cost Rating</h4>
                            <!--<v-rating color="primary" v-model="props.item.costRating" full-icon="attach_money" empty-icon="attach_money" half-icon="attach_money" half-increments readonly></v-rating>-->
                            <h2 style="text-align:center; color:#f3884a; font-size:25px;" v-text="'$'.repeat(venueRatings.cost) || 'Free'"></h2>
                          </div>
                          <v-spacer></v-spacer>
                        </v-layout>
                      </v-card-text>
                      <v-card-text style="text-align:right;">
                        {{ props.item.timePosted.slice(0, 10) }}
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </template>
              </v-data-iterator>
              </div>
              <v-btn block color="primary" v-show="userId != null && !isAdmin" v-on:click="reviewPopup=true">Write A Review</v-btn>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>

<script>
  export  default {
    data() {
      return {
        incorrect: false,
        dialog: false,
        reviewPopup: false,
        isAdmin: false,
        error: "",
        errorFlag: false,
        show: false,
        photos: [],
        venueId: this.$route.params.id,
        categoryId: null,
        venueInfo: [],
        venueRatings: {
          cost: null,
          star: null
        },
        reviews: [],
        pagination: {
          rowsPerPage: 1
        },
        clickedOnUser: [],
        reviewToSubmit: {
          starRating: 1,
          costRating: 0,
          reviewBody: ""
        },
        valid: false,
        requiredRule: [
          v => !!v || 'Required',
        ],
        userId: sessionStorage.getItem("userId")
      }
    },
    mounted: function() {
      this.getVenue(this.venueId);
      this.getRatings();
      this.getReviews();
    },
    methods: {
      getVenue: function(venueId) {
        this . $http . get ( 'http://localhost:4941/api/v1/venues/' + venueId)
          .then(function(response) {
            this.photos = response.data['photos'];
            this.venueInfo = response.data;
            if (this.venueInfo['admin']['userId'] == sessionStorage.getItem("userId")) this.isAdmin = true;
          } , function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },
      getRatings: function () {
        this.$http.get('http://localhost:4941/api/v1/venues')
          .then(function (response) {
            for (var i=0; i<response.data.length; i++) {
              if (response.data[i]['venueId'] == this.venueId) {
                this.venueRatings['cost'] = response.data[i]['modeCostRating'];
                this.venueRatings['star'] = response.data[i]['meanStarRating'];
                this.categoryId = response.data[i]['categoryId'];
              }
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getReviews: function () {
        this.$http.get('http://localhost:4941/api/v1/venues/' + this.venueId + '/reviews')
          .then(function (response) {
            for (var i=0; i<response.data.length; i++) {
              this.reviews.push(response.data[i]);
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getDefaultPhoto: function () {
        let defaultPic = "";
        switch(this.categoryId) {
          case 1: defaultPic = require('./assets/defaultAccom.png'); break;
          case 2: defaultPic = require('./assets/defaultFood.png'); break;
          case 3: defaultPic = require('./assets/defaultAttractions.png'); break;
          case 4: defaultPic = require('./assets/defaultEvent.png'); break;
          case 5: defaultPic = require('./assets/defaultNature.png'); break;
        }
        return defaultPic;
      },
      getUser: function (userId) {
        this.$http.get('http://localhost:4941/api/v1/users/' + userId)
          .then(function (response) {
            this.clickedOnUser = response.data;
            this.dialog = true;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      postReview: function () {
        let authTok = sessionStorage.getItem("authTok");
        this.$http.post('http://localhost:4941/api/v1/venues/' + this.venueId + '/reviews', {
          "reviewBody": this.reviewToSubmit.reviewBody,
          "starRating": this.reviewToSubmit.starRating,
          "costRating": this.reviewToSubmit.costRating
        }, {headers: {"X-Authorization": authTok}})
          .then(function (response) {
            document.location.reload();
          }, function (error) {
            if (error.status === 403) {
              this.incorrect = true;
            }
            this.error = error;
            this.errorFlag = true;
          });
      }
    }
  }
</script>
