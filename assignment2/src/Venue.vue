<template>
  <!--<div>-->
    <!--Single Venue Page-->
    <!--<v-layout>-->
      <!--<v-flex xs12 sm6 offset-sm3>-->
        <!--<v-card>-->
          <!--<v-carousel>-->
            <!--<v-carousel-item-->
              <!--v-for="(item,i) in items"-->
              <!--:key="i"-->
              <!--:src="item.src"-->
            <!--&gt;</v-carousel-item>-->
          <!--</v-carousel>-->

          <!--<v-card-title primary-title>-->
            <!--<div>-->
              <!--<h3 class="headline mb-0">Kangaroo Valley Safari</h3>-->
              <!--<div> {{ card_text }} </div>-->
            <!--</div>-->
          <!--</v-card-title>-->

          <!--<v-card-actions>-->
            <!--<v-btn flat color="orange">Share</v-btn>-->
            <!--<v-btn flat color="orange">Explore</v-btn>-->
          <!--</v-card-actions>-->
        <!--</v-card>-->
      <!--</v-flex>-->
    <!--</v-layout>-->
  <!--</div>-->
  <div id="app">
    <v-app id="inspire">
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
                  <v-text v-text="'Description: ' + venueInfo['shortDescription']"></v-text>
                  <v-text v-show="show" v-text="venueInfo['longDescription']"></v-text>
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
                    <h2 style="text-align:center;">Average Cost Rating</h2>
                    <v-rating size="50px" color="primary" v-model="venueRatings.cost" full-icon="attach_money" empty-icon="attach_money" half-icon="attach_money" half-increments readonly></v-rating>
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
                        <h1 style="text-align:center;">
                          {{ props.item.reviewAuthor.username }}
                        </h1>
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
                            <v-rating color="primary" v-model="props.item.starRating" half-increments readonly></v-rating>
                            <h4 style="text-align:center;">Cost Rating</h4>
                            <v-rating color="primary" v-model="props.item.costRating" full-icon="attach_money" empty-icon="attach_money" half-icon="attach_money" half-increments readonly></v-rating>
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
        }
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
            console.log(this.reviews);
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
      }
    }
  }
</script>
