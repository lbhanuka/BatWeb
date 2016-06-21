/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function (/* $scope, $location, $http */) {
  console.log("Blog Controller reporting for duty.");
});

/**
 * Controls the Home Page
 */
app.controller('HomeCtrl', function ($scope,$http) {
      $scope.showFifteenNews = function() {
          $scope.newsposts = [];
          $scope.currentPage = 0;
          $scope.pageSize = 3;
          $http.get("http://localhost:8080/BatMAP_J2EE_API/newsservice/getfifteennews").then(function (response) {
              $scope.newsposts = response.data.news;
          })
          $scope.numberOfPages=function(){
              return Math.ceil($scope.newsposts.length/$scope.pageSize);
          }
      };
      console.log("All news reporting for duty.");

  var getAllSpeciesMedium = function() {

      $http.get("http://localhost:8080/BatMAP_J2EE_API/species/getall/medium").then(function (response) {
        $scope.allSpeciesMedium = response.data.allspecies;
        var newArr = [];
        for (var i=0; i<$scope.allSpeciesMedium.length; i+=3) {
          newArr.push($scope.allSpeciesMedium.slice(i, i+3));
        }
        $scope.allSpeciesMedium = newArr;
      });
  };
  getAllSpeciesMedium();

  $scope.prepareSpeciesModal = function(species) {
    $scope.modalTitle = species.species_name;
    $scope.modalDescription = species.description;
    $scope.modalImage = species.species_id;

  };

  $scope.uploadFileToUrl = function(file, uploadUrl){
      var fd = new FormData();
      fd.append('file', file);
      $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      })
      .success(function(){
        alert("DONE!");
      })
      .error(function(){
      });
  }

  $scope.submitSpecies = function() {
        var new_species = {"species_name":$scope.new_species_name, "description":$scope.new_species_description, "color":$scope.hexPicker.color};
        var parameter = JSON.stringify(new_species);
        $http({
             url: 'http://localhost:8080/BatMAP_J2EE_API/species',
             method: "POST",
             headers : {
                 'Content-Type': 'application/json'
             },
             data: new_species

         }).then(function successCallback(response) {
           alert(JSON.stringify(response.data));
           var file = $scope.species_image;
           var uploadUrl = "http://localhost:8080/BatMAP_J2EE_API/species/upload";
           $scope.uploadFileToUrl(file, uploadUrl);
           $scope.new_species_name = null;
           $scope.new_species_description = null;
           $scope.hexPicker.color = null;
           $scope.species_image = null;
           //alert("OK");
         }, function errorCallback(response) {
           //alert("Fucked Up!");
         });
         //alert(parameter);

  };

});
//pagination
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

/**
 * Controls the Sightings page
 */
app.controller('SightingsCtrl', function ($scope, $http) {

  $scope.submitSighting = function() {

  };

});


/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ($scope, $http) {
    console.log("Page Controller reporting for duty.");
  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});

/**
 * Controls Add News Page
 */
app.controller('NewsCtrl',function($scope,$http){
    // function to submit the form after all validation has occurred
    $scope.submitAddNewsForm = function() {

        // check to make sure the form is completely valid
        if ($scope.addNewsForm.$valid) {
            var parameter = JSON.stringify({"user_id": $scope.user_id,
                "header":$scope.header,
                "content":$scope.content
            });
            $http({
                url:"http://localhost:8080/BatMAP_J2EE_API/newsservice/addnews",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.newsadded == true){
                    alert("News added successfully");
                }else if(response.data.newsadded == false){
                    alert("Failed adding news");
                }
            },function errorCallback(response) {
                alert("Error occurred");
            });
        }

    };

});

/**
 * Controls the Distribution map page
 */
app.controller('MapCtrl', function ($scope, $http) {


    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(7.642650, 80.674438),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];
    $scope.infoWindows = [];

    var createMarkerImg = function (colour){

      var markerSVGImg = {
        path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
        fillColor: colour,
        fillOpacity: 1,
        scale: 0.4,
        strokeColor: 'black',
        strokeWeight: 1
      };
      return markerSVGImg;
    };

    var createMarker = function (info){
      //  alert("marker creator reporting to duty");
        var marker = new google.maps.Marker({
            map: $scope.map,
            icon: createMarkerImg(info.colour_code),
            position: new google.maps.LatLng(info.latitude, info.longitude),
        });

        // InfoWindow content
        marker.content = '<div id="iw-container">' +
                          '<div class="iw-title">Sighting Details <div style="font-size: 13px; text-align: right; float: right; padding-top: 5px; padding-left: 20px;">by Bhanuka Thirimanne </div></div>' +
                          '<div class="iw-content">' +
                          '<div class="iw-subTitle">' + "Date: " + info.date + '</div>' +
                          '<div class="iw-subTitle">' + "Species: " + info.species_name + '</div>' +
                          '<div class="iw-subTitle">' + "Count: " + info.count + '</div>' +
                          '<div class="iw-subTitle">' + "Time of the day: " + info.time + '</div>' +
                          '<div class="iw-subTitle">' + "Location: " + info.location + '</div>' +
                          '</div>' +
                        '</div>';

        var infoWindow = new google.maps.InfoWindow({content: marker.content, maxWidth: 350});

        google.maps.event.addListener(marker, 'click', function(){
          angular.forEach($scope.infoWindows, function(value, key) {
            value.close();
          });
          infoWindow.open($scope.map, marker);
        });
        $scope.markers[info.species_id].push(marker);
        $scope.infoWindows.push(infoWindow);

    }

    // Event that closes the Info Window with a click on the map
    google.maps.event.addListener($scope.map, 'click', function() {
      angular.forEach($scope.infoWindows, function(value, key) {
        value.close();
      });
    });

    var ShowAllSightings = function() {

        $http.get("http://localhost:8080/BatMAP_J2EE_API/sightingservice/getall").then(function (response) {
        $scope.allsightings = response.data.allsightings;

        angular.forEach($scope.allsightings, function(value, key) {
          createMarker(value);
        });

        });
    };

    var getAllSpecies = function() {

        $http.get("http://localhost:8080/BatMAP_J2EE_API/species/getall/less").then(function (response) {
        $scope.allspecies = response.data.allspecies;
        angular.forEach($scope.allspecies, function(value, key) {
          $scope.markers[value.species_id] = [];
        });

        });
    };

    var hideMarkers = function(species_id) {

      angular.forEach($scope.markers[species_id], function(value, key) {
        value.setMap(null);
      });
    };

    var showMarkers = function(species_id) {

      angular.forEach($scope.markers[species_id], function(value, key) {
        value.setMap($scope.map);
      });
    };

    $scope.hideAllMarkers = function() {
        angular.forEach($scope.allspecies, function(value, key) {
        value.show = false;
        hideMarkers(value.species_id);
      });
    };

    $scope.showAllMarkers = function() {
      angular.forEach($scope.allspecies, function(value, key) {
        value.show = true;
        showMarkers(value.species_id);
      });
    };

    $scope.toggle = function(species_id) {
        //$scope.yesNo = !$scope.yesNo;
        if(!this.species.show){
          showMarkers(species_id);
          this.species.show = true;
        }else{
          hideMarkers(species_id);
          this.species.show = false;
        }
      };

    getAllSpecies();
    setTimeout(function() {
        ShowAllSightings();
        $scope.showAllMarkers();
    }, 2000);

});
