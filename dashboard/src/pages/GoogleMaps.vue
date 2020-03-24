<template>
    <div>
        <h1>Google Maps</h1>
        <v-card>
            <v-card-title class="justify-center cyan darken-1 white--text pa-3">
                Build Route
            </v-card-title>
            <v-card-text>
                <v-row no-gutters justify="center" class="mt-5">
                    <v-col cols="12" sm="5" class="text-right">
                        <input type="text" placeholder="From" ref="from" />
                    </v-col>
                    <v-col cols="12" sm="auto" class="text-center">
                        <v-icon
                            class="mx-3 my-2"
                            v-if="$vuetify.breakpoint.smAndUp"
                        >
                            mdi-arrow-right-bold-outline
                        </v-icon>
                        <v-icon class="my-3" v-else>
                            mdi-arrow-down-bold-outline
                        </v-icon>
                    </v-col>
                    <v-col cols="12" sm="5">
                        <input type="text" placeholder="To" ref="to" />
                    </v-col>
                </v-row>
                <v-alert
                    v-if="distance"
                    text
                    prominent
                    color="teal"
                    icon="mdi-vector-polyline"
                    border="left"
                    class="ma-0 mt-3"
                >
                    Distance between
                    <b>{{ $refs.from.value }}</b>
                    and
                    <b>{{ $refs.to.value }}</b>
                    is
                    <b>{{ distance }}</b>
                    km
                </v-alert>
                <div></div>
            </v-card-text>
            <div class="map" ref="map"></div>
        </v-card>
    </div>
</template>

<script>
// https://developers.google.com/maps/documentation/javascript/tutorial?hl=ru#api_key
// https://developers.google.com/maps/documentation/javascript/places-autocomplete
// https://developers.google.com/maps/documentation/javascript/directions
// https://developers.google.com/maps/documentation/javascript/examples/directions-simple

import GoogleMapsApiLoader from "google-maps-api-loader";
let google;

export default {
    data() {
        return {
            map: null,
            directionsDisplay: null,
            directionsService: null,
            autocompleteFrom: null,
            autocompleteTo: null,
            locationFrom: null,
            locationTo: null,
            from: "",
            to: "",
            distance: 0
        };
    },
    methods: {
        onPlaceFromChanged() {
            var placeFrom = this.autocompleteFrom.getPlace();
            if (placeFrom && placeFrom.geometry) {
                this.locationFrom = placeFrom.geometry.location;
                this.refreshDirection();
            }
        },
        onPlaceToChanged() {
            var placeTo = this.autocompleteTo.getPlace();
            if (placeTo && placeTo.geometry) {
                this.locationTo = placeTo.geometry.location;
                this.refreshDirection();
            }
        },
        refreshDirection() {
            if (this.locationFrom && this.locationTo) {
                var request = {
                    origin: this.locationFrom,
                    destination: this.locationTo,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                this.directionsService.route(request, (result, status) => {
                    if (status == google.maps.DirectionsStatus.OK) {
                        this.directionsDisplay.setDirections(result);
                        if (
                            result &&
                            result.routes &&
                            result.routes[0] &&
                            result.routes[0].legs &&
                            result.routes[0].legs[0] &&
                            result.routes[0].legs[0].distance
                        ) {
                            this.distance = Math.ceil(
                                result.routes[0].legs[0].distance.value / 1000
                            );
                        }
                    }
                });
            }
        }
    },
    async mounted() {
        google = await GoogleMapsApiLoader({
            libraries: ["places"],
            apiKey: "AIzaSyCifmSvEU38gNoswX4MckQUSy7ezTIuIyo"
        });

        var mapOptions = {
            scrollwheel: false,
            center: { lat: 48, lng: 22 },
            zoom: 4.8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.$refs.map, mapOptions);

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(52.2, 21.5),
            new google.maps.LatLng(43.8, 40.4)
        );

        var inputFrom = this.$refs.from;
        var inputTo = this.$refs.to;
        var options = {
            bounds: defaultBounds,
            types: ["(cities)"]
        };

        this.autocompleteFrom = new google.maps.places.Autocomplete(
            inputFrom,
            options
        );
        this.autocompleteTo = new google.maps.places.Autocomplete(
            inputTo,
            options
        );

        google.maps.event.addListener(
            this.autocompleteFrom,
            "place_changed",
            this.onPlaceFromChanged
        );
        google.maps.event.addListener(
            this.autocompleteTo,
            "place_changed",
            this.onPlaceToChanged
        );

        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(this.map);
    }
};
</script>

<style lang="scss" scoped>
input {
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 220px;

    @media (max-width: 599px) {
        margin: 0 auto;
        display: block;
    }
}

.map {
    height: 600px;
}
</style>
