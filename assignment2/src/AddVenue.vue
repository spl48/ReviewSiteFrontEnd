<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Add Venue</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form v-model="valid">
                    <v-text-field v-model="venueName" prepend-icon="home" name="venueName" label="Name of Venue" type="text" color="accent" clearable required :rules="requiredRule"></v-text-field>
                    <v-select
                      v-model="categoryId"
                      :items="categories"
                      item-text="categoryName"
                      item-value="categoryId"
                      label="Venue Type"
                      prepend-icon="category"
                      color="accent"
                      required
                      :rules="requiredRule">
                    </v-select>
                    <v-text-field v-model="shortDescription" prepend-icon="short_text" label="Short Description" type="text" color="accent" clearable required :rules="requiredRule"></v-text-field>
                    <v-textarea
                      prepend-icon="reorder"
                      v-model="longDescription"
                      auto-grow
                      color="accent"
                      label="Long Description (e.g opening times/days)"
                      rows="2"
                      clearable
                      :rules="requiredRule"
                    ></v-textarea>
                    <v-text-field v-model="city" prepend-icon="location_city" label="City" type="text" color="accent" clearable required :rules="requiredRule"></v-text-field>
                    <v-text-field v-model="address" prepend-icon="pin_drop" label="Address" type="text" color="accent" clearable required :rules="requiredRule"></v-text-field>
                    <v-text-field v-model="lat" prepend-icon="pin_drop" label="Latitude" type="number" color="accent" clearable required :rules="latRules"></v-text-field>
                    <v-text-field v-model="lon" prepend-icon="pin_drop" label="Longitude" type="number" color="accent" clearable required :rules="lonRules"></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" :disabled="!valid" v-on:click="addVenue()"> Add </v-btn>
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
        error: "",
        errorFlag: false,
        categories: [],
        venueName: null,
        categoryId: null,
        shortDescription: null,
        longDescription: null,
        city: null,
        address: null,
        lat: null,
        lon: null,
        requiredRule: [
          v => !!v || 'Required'
        ],
        latRules: [
          v => !!v || 'Required',
          v => (-90 <= v && v <= 90) || 'Latitude must be within range -90 to 90'
        ],
        lonRules: [
          v => !!v || 'Required',
          v => (-180 <= v && v <= 180) || 'Longitude must be within range -180 to 180'
        ]

      }
    },
    mounted: function () {
      if(sessionStorage.getItem("authTok") == null) this.$router.push('/venues');
      this.getCategories();
    },
    methods: {
      getCategories: function () {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      addVenue: function () {
        let authTok = sessionStorage.getItem("authTok");
        this . $http . post ( 'http://localhost:4941/api/v1/venues', {
          "venueName": this.venueName,
          "categoryId": this.categoryId,
          "city": this.city,
          "shortDescription": this.shortDescription,
          "longDescription": this.longDescription,
          "address": this.address,
          "latitude": Number.parseFloat(this.lat),
          "longitude": Number.parseFloat(this.lon)
        }, {headers: {"X-Authorization": authTok}})
          . then (function(response) {
            this.$router.push('/venues/' + response.data['venueId']);
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      }
    }
  }
</script>
