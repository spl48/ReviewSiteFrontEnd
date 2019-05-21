<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="venues">
    <v-app id="inspire">
      <v-dialog
        v-model="dialog"
        persistent
        width="250"
      >
        <v-card>
          <v-card-title
            class="headline red lighten-2"
            primary-title
          >
            Unauthorized
          </v-card-title>

          <v-card-text>
            Can't view other user's venues
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="dialog = false"
            >
              Back to Home Page
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container fluid grid-list-xl>
        <v-layout justify-space-between row>
            <v-navigation-drawer permanent>
              <v-toolbar flat>
                <v-list>
                  <v-list-tile>
                    <v-list-tile-title class="title">
                      Filters
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-toolbar>

              <v-divider></v-divider>

              <v-text-field
                v-model="q"
                append-outer-icon="search"
                @change="changePage('first'), getVenues()"
                @click:append-outer="changePage('first'), getVenues()"
                @click:clear="search"
                label="Keyword"
                clearable>
              </v-text-field>

              <v-select
                v-model="city"
                :items="cities"
                label="City"
                @change="changePage('first'), getVenues()"
                clearable>
              </v-select>

              <v-select
                v-model="categoryId"
                :items="categories"
                item-text="categoryName"
                item-value="categoryId"
                label="Venue Type"
                @change="changePage('first'), getVenues()"
                clearable>
              </v-select>

              <v-select
                v-model="maxCostRating"
                :items="[1, 2, 3, 4]"
                label="Maximum Cost Rating"
                @change="changePage('first'), getVenues()"
                clearable>
              </v-select>

              <v-select
                v-model="minStarRating"
                :items="[1, 2, 3, 4]"
                label="Minimum Star Rating"
                @change="changePage('first'), getVenues()"
                clearable>
              </v-select>

              <v-layout row>
                <v-flex></v-flex>
                <v-layout column align-centre>
                  <span class="subheading">Sort By</span>
                  <v-switch
                    v-model="sortBy"
                    value="STAR_RATING"
                    label="Star Rating"
                    @change="getVenues">
                  </v-switch>
                  <v-switch
                    v-model="sortBy"
                    value="COST_RATING"
                    label="Cost Rating"
                    @change="getVenues">
                  </v-switch>
                  <v-switch
                    v-model="sortBy"
                    value="DISTANCE"
                    label="Distance"
                    @change="getLocation">
                  </v-switch>
                  <v-divider></v-divider>
                  <v-switch
                    v-model="reverseSort"
                    label="Reverse Sort"
                    @change="getVenues">
                  </v-switch>
                </v-layout>
                <v-flex></v-flex>
              </v-layout>


            </v-navigation-drawer>
          <v-flex md8>
            <v-card>
              <v-container
                fluid
                grid-list-md
              >
                <v-layout row wrap>
                  <v-flex
                    v-for="card in cards"
                    :key="card.title"
                    v-bind="{ [`xs${card.flex}`]: true }"
                  >
                    <v-hover>
                    <v-card  style="cursor: pointer" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`" class="mx-auto" @click="toVenue(card.venueId)">
                      <v-img
                        :src="card.src"
                        height="200px"
                        :contain="card.contain"
                      >
                        <v-container
                          fill-height
                          fluid
                          pa-2
                        >
                          <v-layout fill-height>
                            <v-flex xs12 align-end flexbox>
                              <span class="headline white black--text" v-text="card.title"></span>
                              <div><span class="subheading white black--text" v-text="card.categoryName"></span></div>
                              <div><span v-if="card.distance !== undefined" class="subheading white black--text" v-text="card.distance.toFixed(2) + ' km'"></span></div>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-img>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <div v-if="card.meanStar !== null">
                          <h2 style="text-align:center;">Average Star Rating</h2>
                          <v-rating large dense color="primary" v-model="card.meanStar" half-increments readonly></v-rating>
                          <h2 style="text-align:center;">Average Cost Rating</h2>
                          <!--<v-rating large dense color="primary" v-model="card.modeCost" full-icon="attach_money" empty-icon="attach_money" half-icon="attach_money" half-increments readonly></v-rating>-->
                          <h2 style="text-align:center; color:#f3884a; font-size:25px;" v-text="'$'.repeat(card.modeCost) || 'Free'"></h2>
                        </div>
                        <div v-else>
                          <h2 style="text-align:center;">No Reviews</h2>
                          <h2 style="text-align:center;">No Reviews</h2>
                        </div>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                    </v-hover>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex xs2>
          </v-flex>
        </v-layout>
        <v-layout justify-start align-centre>
          <v-btn
            color="primary"
            :disabled="firstPage"
            @click="changePage('back')"
          ><v-icon>arrow_back</v-icon>Previous Page</v-btn>
          <v-btn
            color="primary"
            :disabled="lastPage"
            @click="changePage('forward')"
          >Next Page<v-icon>arrow_forward</v-icon></v-btn>
          <span v-text="(startIndex+1) + '-' + (startIndex+cards.length)"></span>
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
        cards: [],
        cities: [],
        categories: [],
        city: null,
        count: 100000,
        startIndex: null,
        categoryId: null,
        maxCostRating: null,
        adminId: null,
        q: "",
        minStarRating: null,
        sortBy: "STAR_RATING",
        reverseSort: false,
        myLatitude: null,
        myLongitude: null,
        firstPage: true,
        lastPage: false,
        totalNumVenues: null,
        userId: sessionStorage.getItem("userId"),
        dialog: false
      }
    },
    mounted: function () {
      this.getCategories();
      this.getVenues();
    },
    methods: {
      getAllVenues: function (response) {
        this.totalNumVenues = response.data.length;
        for (var i = 0; i<response.data.length; i++) {
          this.cities.push(response.data[i]['city'].toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));
          this.cities.sort();
        }
      },
      getVenues: function () {
        if (this.$route.params.id != null && this.$route.params.id == this.userId) {
          this.adminId = this.$route.params.id;
        } else if (this.$route.params.id != null && this.$route.params.id != this.userId) {
          this.dialog = true;
          this.$router.push('/venues');
        }
        this.$http.get('http://localhost:4941/api/v1/venues' + this.filter())
          .then(function (response) {
            this.getAllVenues(response);
            this.cards = [];
            for (var i = 0; i < response.data.length && i < 10; i++) {
              let flex = 4;
              if (i===0) flex = 12;
              let category = this.getSingleCategory(response.data[i]['categoryId']);
              this.cards.push({
                title: response.data[i]['venueName'],
                categoryName: category['categoryName'],
                categoryDescription: category['categoryDescription'],
                meanStar: response.data[i]['meanStarRating'],
                modeCost: response.data[i]['modeCostRating'],
                city: response.data[i]['city'],
                distance: response.data[i]['distance'],
                venueId: response.data[i]['venueId'],
                src: this.getPrimaryPhoto(response.data[i]['venueId'], response.data[i]['primaryPhoto'], response.data[i]['categoryId'])[0],
                contain: this.getPrimaryPhoto(response.data[i]['venueId'], response.data[i]['primaryPhoto'], response.data[i]['categoryId'])[1],
                flex: flex
              });
            }
            this.changePage("refresh");
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getCategories: function () {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getSingleCategory: function (categoryId) {
        for (var v = 0; v<this.categories.length; v++) {
          if (this.categories[v]['categoryId'] === categoryId) {
            return this.categories[v];
          }
        }
      },
      filter: function () {
        let filterURL = "?";
        // filterURL += "count=" + this.count;
        if (this.startIndex !== "" && this.startIndex !== null) filterURL += "&startIndex=" + this.startIndex;
        if (this.city !== undefined && this.city !== null) filterURL += "&city=" + this.city;
        if (this.categoryId !== undefined && this.categoryId !== null) filterURL += "&categoryId=" + this.categoryId;
        if (this.maxCostRating !== undefined && this.maxCostRating !== null) filterURL += "&maxCostRating=" + this.maxCostRating;
        if (this.adminId !== "" && this.adminId !== null) filterURL += "&adminId=" + this.adminId;
        if (this.q !== "" && this.q !== null) filterURL += "&q=" + this.q;
        if (this.minStarRating !== undefined && this.minStarRating !== null) filterURL += "&minStarRating=" + this.minStarRating;
        if (this.sortBy !== "" && this.sortBy !== null) filterURL += "&sortBy=" + this.sortBy;
        if (this.reverseSort !== false && this.reverseSort !== null) filterURL += "&reverseSort=" + this.reverseSort;
        if (this.myLatitude !== "" && this.myLatitude !== null) filterURL += "&myLatitude=" + this.myLatitude;
        if (this.myLongitude !== "" && this.myLongitude !== null) filterURL += "&myLongitude=" + this.myLongitude;
        console.log(filterURL);
        return filterURL;
      },
      search: function () {
        this.q = "";
        this.getVenues();
      },
      getLocation: function () {
        navigator.geolocation.getCurrentPosition(this.locationSuccess);
      },
      locationSuccess: function (position) {
        this.myLatitude = position.coords.latitude;
        this.myLongitude = position.coords.longitude;
        this.getVenues();
      },
      changePage: function (direction) {
        if (direction === "forward") {
          this.startIndex += 10;
          this.firstPage = false;
          if (this.startIndex+10 >= this.totalNumVenues) this.lastPage = true;
          this.getVenues();
        } else if (direction === "back") {
          this.startIndex -= 10;
          this.lastPage = false;
          if (this.startIndex === 0) this.firstPage = true;
          this.getVenues();
        } else if (direction === "refresh") {
          this.lastPage = this.startIndex + 10 >= this.totalNumVenues;
          this.firstPage = this.startIndex <= 0;
        } else if (direction === "first") {
          this.startIndex = 0;
          this.changePage("refresh");
        }
      },
      toVenue: function (venueId) {
        this.$router.push(/venues/ + venueId);
      },
      getPrimaryPhoto: function (venueId, filename, venueType) {
        if (filename !== undefined && filename !== null && filename !== "") {
          return ['http://localhost:4941/api/v1/venues/' + venueId + '/photos/' + filename, false];
        }

        let defaultPic = "";
        switch(venueType) {
          case 1: defaultPic = require('./assets/defaultAccom.png'); break;
          case 2: defaultPic = require('./assets/defaultFood.png'); break;
          case 3: defaultPic = require('./assets/defaultAttractions.png'); break;
          case 4: defaultPic = require('./assets/defaultEvent.png'); break;
          case 5: defaultPic = require('./assets/defaultNature.png'); break;
        }
        return [defaultPic, true];
      }
      // getVenueReviews: function (venueId) {
      //   this.$http.get('http://localhost:4941/api/v1/venues/' + venueId + '/reviews')
      //     .then(function (response) {
      //       console.log(response.data);
      //       return response.data;
      //     }, function (error) {
      //       this.error = error;
      //       this.errorFlag = true;
      //     })
      // },
      // getMeanStar: function (venueId) {
      //   let revs = this.getVenueReviews(venueId);
      //   let totalStar = 0;
      //   var i = 0;
      //   for (i; i<revs; i++) {
      //     totalStar += revs['starRating'];
      //   }
      //   return (totalStar / i);
      // }
    }
  }
</script>
