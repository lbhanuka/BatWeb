/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function (/* $scope, $location, $http */) {
  console.log("Blog Controller reporting for duty.");
});

/**
 * login controller
 */

app.controller('LoginCtrl',function($scope,$http,$window){
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
                    // storing session variables
                    $window.sessionStorage.setItem("usr", JSON.stringify(response.data));

                    // page re-directions for user types
                    if(response.data.user_type == "researcher"){
                        window.location.href="index.html#/researcher";
                    }else if(response.data.user_type == "administrator"){
                        window.location.href="index.html#/administrator";
                    }
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
                    alert("Sign up successful");
                }else if(response.data.signup == false){
                    if(response.data.passwordNotEquals == true){
                        alert("Sign up failed. Password not equals");
                    }else {
                        alert("Sign up failed");
                    }

                }
            },function errorCallback(response) {
                alert("Error occurred");
            });
        }

    };

});

/**
 * researcher page controller
 */
app.controller('ResearcherCtrl',function ($scope,$http,$window) {
    if($window.sessionStorage.getItem("usr")== null){
        window.location.href = "index.html#/signin";
    }
    var usr = JSON.parse($window.sessionStorage.getItem("usr"));

});

/**
 * administrator page controller
 */
app.controller('AdministratorCtrl',function ($scope,$http,$window) {
    if($window.sessionStorage.getItem("usr")== null){
        window.location.href = "index.html#/signin";
    }
    var usr = JSON.parse($window.sessionStorage.getItem("usr"));

});

/**
 * update profile page controller
 */
app.controller('ProfileCtrl',function ($scope,$http,$window) {
    if($window.sessionStorage.getItem("usr")== null){
        window.location.href = "index.html#/signin";
    }
    var usr = JSON.parse($window.sessionStorage.getItem("usr"));
    var usremail = usr.email;

    //getting user details from API
    $http({
        url:"http://localhost:8080/userservice/getuser/"+usremail,
        method: "GET"
    }).then(function successCallback(response) {
        if(response.data.getdetails == true){
            $scope.email = response.data.email;
            $scope.first_name = response.data.first_name;
            $scope.last_name = response.data.last_name;
            $scope.institute = response.data.institute;
            $scope.password = response.data.password;
            $scope.confirmpassword = response.data.password;
            // alert("Get details successful");
            // alert(JSON.stringify(response.data));
        }else if(response.data.getdetails == false){
            // alert("get details failed");
        }
    },function errorCallback(response) {
        alert("Error occurred while retrieving data");
    });
    
    //enable update button
    // $scope.enableUpdate = function () {
    //     if(confirm("Are you sure?")){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // };

    //update after all validations
    $scope.submitUpdateForm = function() {

        // check to make sure the form is completely valid
        if ($scope.updateForm.$valid) {
            var parameter = JSON.stringify({"email": usremail,
                "password":$scope.password,
                "confirmpassword":$scope.confirmpassword,
                "first_name":$scope.first_name,
                "last_name":$scope.last_name,
                "institute":$scope.institute
            });
            $http({
                url:"http://localhost:8080/userservice/updateprofile",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.updated == true){
                    alert("Update successful");
                }else if(response.data.updated == false){
                    if(response.data.passwordNtEquals == true){
                        alert("Update failed. Password not equals");
                    }else {
                        alert("Update failed");
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
app.controller('PageCtrl', function ($scope, $http) {
    console.log("Page Controller reporting for duty.");

    // Activates the Carousel
    $('.carousel').carousel({
        interval: 5000
    });
    
    $scope.showAllNews = function() {
        $scope.newsposts = [];
        $scope.currentPage = 0;
        $scope.pageSize = 3;
        $http.get("http://localhost:8080/BatMAP_J2EE_API/newsservice/gettennews").then(function (response) {
            $scope.newsposts = response.data.news;
        })
        $scope.numberOfPages=function(){
            return Math.ceil($scope.newsposts.length/$scope.pageSize);                
        }
    };
    
    $scope.disabled = function() {
        if($scope.addInviteesDisabled) { return false;}
    };
    
    console.log("All news reporting for duty.");
    // Activates Tooltips for Social Links
    $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
    })
});

app.filter('startFrom', function() {
    return function(input, start) {
        console.log("Filter reporting for duty.");
        start = +start; //parse to int
        return input.slice(start);
    }
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
    };

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

    };

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };

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
