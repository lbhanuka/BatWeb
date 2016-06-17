/**
 * Created by lahiru on 6/17/2016.
 */

/**
 * login controller
 */

app.controller('LoginCtrl',function($scope,$http,$window){
    //check is logged in
    if($window.sessionStorage.getItem("usr")!= null){
        var usr = JSON.parse($window.sessionStorage.getItem("usr"));
        if(usr.user_type=="administrator"){
            window.location.href = "index.html#/administrator";
        }else if(usr.user_type == "researcher"){
            window.location.href = "index.html#/researcher";
        }
    }
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
                    // alert("Sign in successful");
                    swal({
                        title: "Sign in successful",
                        type: "success",
                        timer: 3000
                    });
                    // storing session variables
                    $window.sessionStorage.setItem("usr", JSON.stringify(response.data));

                    // page re-directions for user types
                    if(response.data.user_type == "researcher"){
                        window.location.href="index.html#/researcher";
                    }else if(response.data.user_type == "administrator"){
                        window.location.href="index.html#/administrator";
                    }
                }else if(response.data.signin == false){
                    if(response.data.acc_status == "deactivated"){
                        // alert("Sign in failed. Your account is deactivated. Please contact administrator.");
                        swal({
                            title: "Sign in failed",
                            text:"Your account is deactivated. Please contact administrator.",
                            type: "error",
                            timer: 3000
                        });
                    }else if(response.data.acc_status == "pending"){
                        // alert("Sign in failed. Your sign up request is still in pending.");
                        swal({
                            title: "Sign in failed",
                            text:"Your sign up request is still in pending.",
                            type: "error",
                            timer: 3000
                        });
                    }else if(response.data.cred == false){
                        swal({
                            title: "Sign in failed",
                            text:"Your email or password does not match.",
                            type: "error",
                            timer: 3000
                        });
                    }
                }
            },function errorCallback(response) {
                // alert("Error occurred");
                swal({   title: "Sign in error.",   text: "Connection error occurred.",   timer: 3000,   showConfirmButton: false });
            });
        }
    };

});

/**
 * signout controller
 */
app.controller('SignoutCtrl',function ($scope,$window) {
    $scope.signoutFunc = function () {
        if(confirm("Are you sure?")){
            $window.sessionStorage.removeItem('usr');
            window.location.href = "index.html#/signin";
        }

    };
    $scope.isSignedin = function () {
        if($window.sessionStorage.getItem("usr") == null){
            return false;
        }else {
            return true;
        }
    };

    $scope.goToDashboard = function () {
        var usr = JSON.parse($window.sessionStorage.getItem("usr"));
        if(usr.user_type=="administrator"){
            window.location.href = "index.html#/administrator";
        }else if(usr.user_type=="researcher"){
            window.location.href = "index.html#/researcher";
        }

    };

});

/**
 * register controller
 */
app.controller('RegisterCtrl',function($scope,$http,$window){
    //check is logged in
    if($window.sessionStorage.getItem("usr")!= null){
        var usr = JSON.parse($window.sessionStorage.getItem("usr"));
        if(usr.user_type=="administrator"){
            window.location.href = "index.html#/administrator";
        }else if(usr.user_type == "researcher"){
            window.location.href = "index.html#/researcher";
        }
    }
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
    if(usr.user_type=="administrator"){
        window.location.href = "index.html#/administrator";
    }else if(usr.user_type=="researcher"){
        window.location.href = "index.html#/researcher";
    }

});

/**
 * administrator page controller
 */
app.controller('AdministratorCtrl',function ($scope,$http,$window) {
    if($window.sessionStorage.getItem("usr")== null){
        window.location.href = "index.html#/signin";
    }
    var usr = JSON.parse($window.sessionStorage.getItem("usr"));
    if(usr.user_type=="administrator"){
        window.location.href = "index.html#/administrator";
    }else if(usr.user_type=="researcher"){
        window.location.href = "index.html#/researcher";
    }

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
 * sign up request controller - admin
 */
app.controller("SignupRequestCtrl",function ($scope,$http,$window,$route) {
    $scope.getRequest = function () {
        $http({
            url:"http://localhost:8080/userservice/getpendinglist",
            method: "GET"
        }).then(function successCallback(response) {
            if(response.data.pending == true){
                $scope.datalist = response.data.pendingList;
            }else if(response.data.pending == false){
                $scope.nopending = "No pending requests found.";
            }
        },function errorCallback(response) {
            alert("Error occurred");
        });
    };
    $scope.activateAcc = function (usremail) {
        if(confirm("Confirm to activate "+usremail+".")){
            var parameter = JSON.stringify({"email": usremail,"type":"act"});
            $http({
                url:"http://localhost:8080/userservice/manageaccount",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.activated == true){
                    alert("Activated.");
                    $route.reload();
                }else if(response.data.activated == false){
                    alert("Activation failed.");
                }
            },function errorCallback(response) {
                alert("Error occurred");
            });
        }
    };

    $scope.deactivateAcc = function (usremail) {
        if(confirm("Confirm to deactivate "+usremail+".")){
            var parameter = JSON.stringify({"email": usremail,"type":"deact"});
            $http({
                url:"http://localhost:8080/userservice/manageaccount",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.deactivated == true){
                    alert("Deactivated.");
                    $route.reload();
                }else if(response.data.deactivated == false){
                    alert("Deactivation failed.");
                }
            },function errorCallback(response) {
                alert("Error occurred");
            });
        }

    };

});