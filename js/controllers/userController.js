/**
 * Created by lahiru on 6/17/2016.
 */
app.controller("HostUrlCtrl",function ($rootScope) {
    // $rootScope.apiHostUrl = "http://localhost:8080/BatMAP_J2EE_API/";
    $rootScope.apiHostUrl = "http://localhost:8080/";
});
/**
 * login controller
 */

app.controller('LoginCtrl',function($rootScope,$scope,$http,$window){
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
                // url:"http://localhost:8080/userservice/signin",
                url:$rootScope.apiHostUrl+"userservice/signin",
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
                swal({   title: "Sign in error",   text: "Connection error occurred.",   timer: 3000,   showConfirmButton: false });
            });
        }
    };

});

/**
 * signout controller
 */
app.controller('SignoutCtrl',function ($rootScope,$scope,$window) {
    $scope.signoutFunc = function () {
        // if(confirm("Are you sure?")){
        //     $window.sessionStorage.removeItem('usr');
        //     window.location.href = "index.html#/signin";
        // }
        swal({
            title: "Are you sure?",
            text: "You are going to sign out.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: false
        }, function(){
            $window.sessionStorage.removeItem('usr');
            $rootScope.signedinas = null;
            window.location.href = "index.html#/signin";
            swal({
                title: "Signed out.",
                type: "success",
                timer: 3000
            });
        });

    };
    $scope.isSignedin = function () {
        if($window.sessionStorage.getItem("usr") == null){
            return false;
        }else {
            var usr = JSON.parse($window.sessionStorage.getItem("usr"));
            $scope.signedinas = usr.email;
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
app.controller('RegisterCtrl',function($rootScope,$scope,$http,$window){
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
                url:$rootScope.apiHostUrl+"userservice/signup",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.signup == true){
                    // alert("Sign up successful");
                    swal({
                        title: "Sign up successful.",
                        text: "Please sign in.",
                        type: "success",
                        timer: 3000
                    });
                    window.location.href = "index.html#/signin";
                }else if(response.data.signup == false){
                    if(response.data.passwordNotEquals == true){
                        // alert("Sign up failed. Password not equals");
                        swal({
                            title: "Sign up failed.",
                            text: "Password not equals.",
                            type: "error",
                            timer: 3000
                        });
                    }else if(response.data.userExists == true){
                        swal({
                            title: "Sign up failed.",
                            text: "User already registered.",
                            type: "error",
                            timer: 3000
                        });
                    }else {
                        // alert("Sign up failed");
                        swal({
                            title: "Sign up failed.",
                            type: "error",
                            timer: 3000
                        });
                    }

                }
            },function errorCallback(response) {
                // alert("Error occurred");
                swal({
                    title: "Sign up error.",
                    text: "Connection error occurred.",
                    timer: 3000,
                    showConfirmButton: false
                });
            });
        }

    };

});

/**
 * researcher page controller
 */
app.controller('ResearcherCtrl',function ($rootScope,$scope,$http,$window) {
    if($window.sessionStorage.getItem("usr")== null){
        window.location.href = "index.html#/signin";
    }
    var usr = JSON.parse($window.sessionStorage.getItem("usr"));
    if(usr.user_type=="administrator"){
        window.location.href = "index.html#/administrator";
    }else if(usr.user_type=="researcher"){
        window.location.href = "index.html#/researcher";
    }

    $scope.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
                swal({
                    title: "File uploaded successfully",
                    type: "success",
                    timer: 3000
                });
            })
            .error(function(){
            });
    };

    $scope.submitNewResearch = function () {
        var parameter = JSON.stringify({"resTitle": $scope.resTitle,
            "resDescription":$scope.resDescription,
            "userEmail":usr.email
        });
        $http({
            url: $rootScope.apiHostUrl+'researchservice/addnew',
            method: "POST",
            data: parameter

        }).then(function successCallback(response) {
            if(response.data.addRes == true ){
                alert("Research added");
            }else {
                alert("error");
            }
            // alert(JSON.stringify(response.data));
            var file = $scope.researchFile;
            var uploadUrl = $rootScope.apiHostUrl+'researchservice/addnewupload';
            $scope.uploadFileToUrl(file, uploadUrl);
        }, function errorCallback(response) {
            alert("Connection error");
        });

    };

});

/**
 * administrator page controller
 */
app.controller('AdministratorCtrl',function ($rootScope,$scope,$http,$window) {
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
app.controller('ProfileCtrl',function ($rootScope,$scope,$http,$window) {
    if($window.sessionStorage.getItem("usr")== null){
        window.location.href = "index.html#/signin";
    }
    var usr = JSON.parse($window.sessionStorage.getItem("usr"));
    var usremail = usr.email;

    //getting user details from API
    $http({
        url:$rootScope.apiHostUrl+"userservice/getuser/"+usremail,
        method: "GET"
    }).then(function successCallback(response) {
        if(response.data.getdetails == true){
            $scope.email = response.data.email;
            $scope.first_name = response.data.first_name;
            $scope.last_name = response.data.last_name;
            $scope.institute = response.data.institute;
            $scope.password = response.data.password;
            $scope.confirmpassword = response.data.password;
        }else if(response.data.getdetails == false){
            // alert("get details failed");
        }
    },function errorCallback(response) {
        // alert("Error occurred while retrieving data");
        swal({
            title: "Error",
            text: "Error occurred while retrieving data.",
            type: "error",
            timer: 3000
        });
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
                url:$rootScope.apiHostUrl+"userservice/updateprofile",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.updated == true){
                    swal({
                        title: "Update successful.",
                        type: "success",
                        timer: 3000
                    });
                }else if(response.data.updated == false){
                    if(response.data.passwordNtEquals == true){
                        swal({
                            title: "Update failed",
                            text: "Password not equals",
                            type: "error",
                            timer: 3000
                        });
                    }else {
                        swal({
                            title: "Update failed",
                            type: "error",
                            timer: 3000
                        });
                    }

                }
            },function errorCallback(response) {
                swal({
                    title: "Error in connection",
                    type: "error",
                    timer: 3000
                });
            });
        }

    };
});

/**
 * Accounts manager controller - admin
 */
app.controller("AccountManagerCtrl",function ($rootScope,$scope,$http,$window,$route) {
    $scope.currentUser = JSON.parse($window.sessionStorage.getItem("usr")).email;

    //get sign up requests
    $scope.getRequest = function () {
        $http({
            url:$rootScope.apiHostUrl+"userservice/getpendinglist",
            method: "GET"
        }).then(function successCallback(response) {
            if(response.data.pending == true){
                $scope.datalist = response.data.pendingList;
            }else if(response.data.pending == false){
                $scope.nopending = "No pending requests found.";
            }
        },function errorCallback(response) {
            swal({
                title: "Error in connection",
                type: "error",
                timer: 3000
            });
        });
    };

    //all accounts
    $scope.getAllAccounts = function () {
        $http({
            url:$rootScope.apiHostUrl+"userservice/getallaccountslist",
            method: "GET"
        }).then(function successCallback(response) {
            if(response.data.getAll == true){
                $scope.alldatalist = response.data.allAccountList;
            }else if(response.data.getAll == false){
                $scope.noacc = "No accounts found.";
            }
        },function errorCallback(response) {
            swal({
                title: "Error in connection",
                type: "error",
                timer: 3000
            });
        });
    };


    $scope.activateAcc = function (usremail) {
        swal({
            title: "Are you sure?",
            text: "You are going to activate "+usremail,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Activate it!",
            closeOnConfirm: false
        }, function(){
            var parameter = JSON.stringify({"email": usremail,"type":"act"});
            $http({
                url:$rootScope.apiHostUrl+"userservice/manageaccount",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.activated == true){
                    swal({
                        title: "Activated",
                        text: usremail+" account activated successfully.",
                        type: "success",
                        timer: 3000
                    });
                    $route.reload();
                }else if(response.data.activated == false){
                    swal({
                        title: "Activation failed",
                        text: usremail+" account activation failed.",
                        type: "error",
                        timer: 3000
                    });
                }
            },function errorCallback(response) {
                swal({
                    title: "Error",
                    text:"Error in connection",
                    type: "error",
                    timer: 3000
                });
            });

        });
    };

    $scope.deactivateAcc = function (usremail) {
        swal({
            title: "Are you sure?",
            text: "You are going to deactivate "+usremail,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Deactivate it!",
            closeOnConfirm: false
        }, function(){
            var parameter = JSON.stringify({"email": usremail,"type":"deact"});
            $http({
                url:$rootScope.apiHostUrl+"userservice/manageaccount",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.deactivated == true){
                    swal({
                        title: "Deactivated",
                        text: usremail+" account deactivated successfully.",
                        type: "success",
                        timer: 3000
                    });
                    $route.reload();
                }else if(response.data.deactivated == false){
                    swal({
                        title: "Deactivation failed",
                        text: usremail+" account deactivation failed.",
                        type: "error",
                        timer: 3000
                    });
                }
            },function errorCallback(response) {
                swal({
                    title: "Error",
                    text:"Error in connection",
                    type: "error",
                    timer: 3000
                });
            });
        });

    };

    $scope.rejectAcc = function (usremail) {
        swal({
            title: "Are you sure?",
            text: "You are going to reject "+usremail,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Reject it!",
            closeOnConfirm: false
        }, function(){
            var parameter = JSON.stringify({"email": usremail,"type":"reject"});
            $http({
                url:$rootScope.apiHostUrl+"userservice/manageaccount",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.rejected == true){
                    swal({
                        title: "Rejected",
                        text: usremail+" account rejected successfully.",
                        type: "success",
                        timer: 3000
                    });
                    $route.reload();
                }else if(response.data.rejected == false){
                    swal({
                        title: "Rejection failed",
                        text: usremail+" account rejection failed.",
                        type: "error",
                        timer: 3000
                    });
                }
            },function errorCallback(response) {
                swal({
                    title: "Error",
                    text:"Error in connection",
                    type: "error",
                    timer: 3000
                });
            });
        });

    };
    
    //searching
    $scope.searchMethod = "Search By";
    $scope.methodSelectFlag = false;
    $scope.searchMethodChange = function (sb) {
        $scope.searchBy = sb;
        $scope.methodSelectFlag = true;
        if(sb == "email"){
            $scope.searchMethod = "Email";
        }else if(sb =="first_name"){
            $scope.searchMethod = "First Name";
        }else if(sb == "last_name"){
            $scope.searchMethod = "Last Name";   
        }else if(sb == "institute"){
            $scope.searchMethod = "Institute";
        }

    };
    $scope.searchUser = function () {
        if($scope.methodSelectFlag==false){
            $scope.methodSelectErrMsg = "*Please select the search method."
        }
        $http({
            url:$rootScope.apiHostUrl+"userservice/search/"+$scope.searchBy+"/"+$scope.searchTerm,
            method: "GET"
        }).then(function successCallback(response) {
            if(response.data.AccountList.length > 0){
                $scope.searchAcclist = response.data.AccountList;
                $scope.noSearchAcc = "";
            }else{
                $scope.searchAcclist = [];
                $scope.noSearchAcc = "No accounts found.";
            }
        },function errorCallback(response) {
            // swal({
            //     title: "Error in connection",
            //     type: "error",
            //     timer: 3000
            // });
        });

    };

});
