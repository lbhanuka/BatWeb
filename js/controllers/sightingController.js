
app.controller('SightingManagerCtrl',function($scope,$http,$rootScope,$window){

  var GetAllSightings = function() {
    $http.get($rootScope.apiHostUrl+"sightingservice/getall").then(function (response) {
      $scope.allsightings = response.data.allsightings;
      //alert(JSON.stringify($scope.allsightings));
    });
  };

  $scope.moreInfo = function(sighting) {
    $rootScope.currentSighting = sighting;
    $window.location.href = '#/sightingdetails';
    //alert(JSON.stringify($rootScope.currentSighting));
  };

  $scope.removeSighting = function(sighting_id) {
    swal({
        title: "Are you sure?",
        text: "You are going to delete this sighting.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    }, function(){
        $http.get($rootScope.apiHostUrl+"sightingservice/remove/"+sighting_id).then(function (response) {
          if(response.data.status=="done"){
            swal({
                title: "Sighting Removed.",
                type: "success",
                timer: 3000
            });
            var index = 0;
            angular.forEach($scope.allsightings, function(value, key) {
              if(value.sighting_id == sighting_id){
                $scope.allsightings.splice(index, 1);
              };
              index = index + 1;
            });
          }
        });
    });
  };

  GetAllSightings();

  //sighting search
  $scope.searchMethode = "Search By";
  $scope.searchTerm = '';
  $scope.searchSightings = function() {
    var searchTermLowercase = $scope.searchTerm.toLowerCase();
    if ($scope.searchMethode == 'Reporter') {
      angular.forEach($scope.allsightings, function(value, key) {
        var fullname = value.first_name.toLowerCase() + " " + value.last_name.toLowerCase();
        if (fullname.indexOf(searchTermLowercase) == -1) {
          value.succsess = 'false';
        }else {
          value.succsess = 'true';
        }
      });
    }else if ($scope.searchMethode == 'Date') {
      angular.forEach($scope.allsightings, function(value, key) {
        if (value.date.indexOf(searchTermLowercase) == -1) {
          value.succsess = 'false';
        }else {
          value.succsess = 'true';
        }
      });
    }else if ($scope.searchMethode == 'Institute') {
      angular.forEach($scope.allsightings, function(value, key) {
        if (value.institute.toLowerCase().indexOf(searchTermLowercase) == -1) {
          value.succsess = 'false';
        }else {
          value.succsess = 'true';
        }
      });
    }else if ($scope.searchMethode == 'Bat Count') {
      angular.forEach($scope.allsightings, function(value, key) {
        if (!true) {
          value.succsess = 'false';
        }else {
          value.succsess = 'true';
        }
      });
    }else if ($scope.searchMethode == 'Species') {
      angular.forEach($scope.allsightings, function(value, key) {
        if (value.species_name.toLowerCase().indexOf(searchTermLowercase) == -1) {
          //alert("OK");
          value.succsess = false;
        }else {
          //alert("NOTOK");
          value.succsess = true;
        }
      });
    }
  };
});

app.controller('SightingViewCtrl',function($scope,$http,$rootScope,$window,$compile){

  $scope.sighting = $rootScope.currentSighting;
  var mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(7.642650, 80.674438),
      mapTypeId: google.maps.MapTypeId.TERRAIN
  }
  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng($scope.sighting.latitude, $scope.sighting.longitude),
    map: $scope.map
  });

  var prepareSightingImagesModal = function(sighting_id) {
    $http.get("http://localhost:8080/BatMAP_J2EE_API/sightingservice/getimageids/" + sighting_id).then(function (response) {
    $scope.sightingImages = response.data.imageIds;
    //alert(JSON.stringify($scope.sightingImages));
    });
    $scope.selectedImage = null;
  };
  prepareSightingImagesModal($scope.sighting.sighting_id);

  $scope.setImage = function(image_id) {
    $scope.selectedImage = image_id;
    document.getElementById("previewImage").innerHTML = '<img class="img-responsive" style="width: 50%; margin: 0 auto;" src="http://localhost:8080/BatMAP_J2EE_API/sightingservice/getimage/' + image_id + '">';
  };

  $scope.removeImage = function() {
    swal({
        title: "Are you sure?",
        text: "You are going to delete this Image.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    }, function(){
        $http.get($rootScope.apiHostUrl+"sightingservice/removeimage/"+$scope.selectedImage).then(function (response) {
          if(response.data.status=="done"){
            swal({
                title: "Sighting Removed.",
                type: "success",
                timer: 3000
            });
            var index = $scope.sightingImages.indexOf($scope.selectedImage);
            $scope.sightingImages.splice(index, 1);
            if($scope.sightingImages.length != 0){
            $scope.selectedImage = $scope.sightingImages[0];
            document.getElementById("previewImage").innerHTML = '<img class="img-responsive" style="width: 50%; margin: 0 auto; max-height:400px;" src="http://localhost:8080/BatMAP_J2EE_API/sightingservice/getimage/'+ $scope.sightingImages[0] +'">';
            }else{
              document.getElementById("closeModal").click();
            }
          }
        });
    });
  };

  $scope.removeSighting = function(sighting_id) {
    swal({
        title: "Are you sure?",
        text: "You are going to delete this sighting.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    }, function(){
        $http.get($rootScope.apiHostUrl+"sightingservice/remove/"+sighting_id).then(function (response) {
          $scope.allsightings = response.data.status;
          if(response.data.status=="done"){
            swal({
                title: "Sighting Removed.",
                type: "success",
                timer: 3000
            });
            $window.location.href = '#/sightingmanager';
          }
        });
    });
  };

  $scope.acceptSighting = function(sighting_id) {
    swal({
        title: "Are you sure?",
        text: "You are about to approve this sighting.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    }, function(){
        $http.get($rootScope.apiHostUrl+"sightingservice/accept/"+sighting_id).then(function (response) {
          $scope.allsightings = response.data.status;
          if(response.data.status=="done"){
            swal({
                title: "Sighting Approved.",
                type: "success",
                timer: 3000
            });
            $window.location.href = '#/sightingmanager';
          }
        });
    });
  };
  //get all species for changeSpecies function
  var getAllSpecies = function() {
      $http.get("http://localhost:8080/BatMAP_J2EE_API/species/getall/less").then(function (response) {
      $scope.allSpecies = response.data.allspecies
      //alert(JSON.stringify($scope.allSpecies));
      });
  };

  $scope.changeSpecies = function() {
    getAllSpecies();
    //$scope.newspecies = $scope.sighting.species_name;
    var element = document.getElementById('changeSpeciesInput');
    element.style.display='initial';
    element = document.getElementById('changeSpeciesBtn');
    element.style.display='none';
    element = document.getElementById('changeSpeciesSubmitBtn');
    element.style.display='initial';
  };

  $scope.changeSpeciesSubmit = function() {

    $http.get("http://localhost:8080/BatMAP_J2EE_API/sightingservice/updateSpecies/" + $scope.sighting.sighting_id +"/"+ $scope.sighting.species_id).then(function (response) {
      if(response.data.status=="done"){
        swal('Species Updated!')
      };
    });
    var element = document.getElementById("changeSpeciesInput");
    element.style.display='none';
    element = document.getElementById('changeSpeciesBtn');
    element.style.display='initial';
    element = document.getElementById('changeSpeciesSubmitBtn');
    element.style.display='none';
  };

});

app.controller('UserSightingViewCtrl',function($scope,$http,$rootScope,$window,$compile){
  $scope.sighting = $rootScope.currentSighting;
  var mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(7.642650, 80.674438),
      mapTypeId: google.maps.MapTypeId.TERRAIN
  }
  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng($scope.sighting.latitude, $scope.sighting.longitude),
    map: $scope.map
  });

  var prepareSightingImagesModal = function(sighting_id) {
    $http.get("http://localhost:8080/BatMAP_J2EE_API/sightingservice/getimageids/" + sighting_id).then(function (response) {
    $scope.sightingImages = response.data.imageIds;
    //alert(JSON.stringify($scope.sightingImages));
    });
    $scope.selectedImage = null;
  };
  prepareSightingImagesModal($scope.sighting.sighting_id);

  $scope.setImage = function(image_id) {
    $scope.selectedImage = image_id;
    document.getElementById("previewImage").innerHTML = '<img class="img-responsive" style="width: 50%; margin: 0 auto;" src="http://localhost:8080/BatMAP_J2EE_API/sightingservice/getimage/' + image_id + '">';
  };

});


app.controller('MySightingCtrl',function($scope,$http,$rootScope,$window){

  var GetAllSightings = function() {
    var usr = JSON.parse($window.sessionStorage.getItem("usr"));
    $rootScope.signedinas = usr.email;
    $http.get($rootScope.apiHostUrl+"sightingservice/getall/"+$rootScope.signedinas).then(function (response) {
      $scope.allsightings = response.data.usersightings;
      //alert(JSON.stringify($scope.allsightings));
    });
  };

  $scope.moreInfo = function(sighting) {
    $rootScope.currentSighting = sighting;
    $window.location.href = '#/usersightingdetails';
    //alert(JSON.stringify($rootScope.currentSighting));
  };

  $scope.removeSighting = function(sighting_id) {
    swal({
        title: "Are you sure?",
        text: "You are going to delete this sighting.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    }, function(){
        $http.get($rootScope.apiHostUrl+"sightingservice/remove/"+sighting_id).then(function (response) {
          if(response.data.status=="done"){
            swal({
                title: "Sighting Removed.",
                type: "success",
                timer: 3000
            });
            var index = 0;
            angular.forEach($scope.allsightings, function(value, key) {
              if(value.sighting_id == sighting_id){
                $scope.allsightings.splice(index, 1);
              };
              index = index + 1;
            });
          }
          deleteNotification(sighting_id);
        });
    });
  };

  var deleteNotification = function(event_id) {
    //alert("ok");
    $http.get($rootScope.apiHostUrl+"notification/getnotification/"+event_id+"/2").then(function (response) {
      $scope.notification_id = response.data.notification_id;
      //alert(JSON.stringify($scope.allsightings));
      $http.get($rootScope.apiHostUrl+"notification/remove/admin_notifications/"+$scope.notification_id+"/2").then(function (response) {
      });
    });
  };

  GetAllSightings();
});
