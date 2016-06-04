/**
 * Service to get sighting data from the api
 */
app.service('mapService', function($q, $http) {

  this.submitSighting = function(newSighting){
    sightings.push(newSighting);
    //alert(newSighting.lat);
    //alert(newSighting.lng);
    };



});
