/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function (/* $scope, $location, $http */) {
  console.log("Blog Controller reporting for duty.");
});

/**
 * login controller
 */

app.controller('LoginCtrl',function($scope,$http){
    // function to submit the form after all validation has occurred
    $scope.submitSigninForm = function() {
        // check to make sure the form is completely valid
        if ($scope.signinForm.$valid) {

            var parameter = JSON.stringify({"email": $scope.email,"password": $scope.password});
            $http({
                url:"http://localhost:8080/userservice/signin",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.signin == true){
                    alert("Sign in successful");
                }else if(response.data.signin == false){
                    alert("Sign in failed");
                }
            },function errorCallback(response) {
                alert("Error occurred");
            });
        }
    };
        
          
        


   
});

/**
 * register controller
 */
app.controller('RegisterCtrl',function($scope,$http){
    // function to submit the form after all validation has occurred
    $scope.submitSignupForm = function() {

        // check to make sure the form is completely valid
        if ($scope.signupForm.$valid) {
            // alert($scope.email+" "+$scope.password+" "+$scope.first_name);
            var parameter = JSON.stringify({"email": $scope.email,
                "password":$scope.password,
                "confirmpassword":$scope.confirmpassword,
                "first_name":$scope.first_name,
                "last_name":$scope.last_name,
                "institute":$scope.institute
            });
            $http({
                url:"http://localhost:8080/userservice/signup",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.signup == true){
                    alert("Sign in successfull");
                }else if(response.data.signup == false){
                    if(response.data.passwordNotEquals == true){
                        alert("Sign in failed. Password not equals");
                    }else {
                        alert("Sign in failed");
                    }

                }
            },function errorCallback(response) {
                alert("Error occurred");
            });
        }

    };

});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
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
 * Controls the Distribution map page
 */
app.controller('MapCtrl', function ($scope, $http) {

    //alert(JSON.stringify($scope.allsightings[0]));
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(7.642650, 80.674438),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){
      //  alert("marker creator reporting to duty");
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.latitude, info.longitude),
            title: "info.city"
        });
        marker.content = '<div class="infoWindowContent">' + info.count + '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

    var ShowAllSightings = function() {

        $http.get("http://ec2-52-37-196-128.us-west-2.compute.amazonaws.com:8080/BatMAP_J2EE_API/sightingservice/getall").then(function (response) {
        $scope.allsightings = response.data.allsightings;

        angular.forEach($scope.allsightings, function(value, key) {
          createMarker(value);
        });

        });
    };

    ShowAllSightings();

});
