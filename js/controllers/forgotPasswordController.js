/**
 * Created by lahiru on 8/6/2016.
 */

app.controller('ForgotPassStepOneCtrl',function($rootScope,$scope,$http,$window){
    $scope.submitEmailForPassword = function () {

        swal({
            title: "Are you sure?",
            text: "You are going to reset your password.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: false
        }, function(){
            //after confirm
            var parameter = JSON.stringify({"email": $scope.email});
            $http({
                url:$rootScope.apiHostUrl+"userservice/forgotpassstepone",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.flag==true && response.data.se==true){
                    swal({
                        title: "Instructions sent to your email",
                        text: "Please check your email and follow the instructions.",
                        type: "success",
                        timer: 10000
                    });
                    window.location.href = "index.html#/";
                }else{
                    swal({
                        title: "user not exists",
                        type: "error",
                        timer: 3000
                    });
                }

            },function errorCallback(response) {

            });

        });
    }
});

app.controller('ForgotPassStepTwoCtrl',function($rootScope,$scope,$http,$window,$routeParams){

    $scope.submitPasswordChange = function () {
        swal({
            title: "Are you sure?",
            text: "You are going to reset your password.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: false
        }, function(){
            //after confirm
            var parameter = JSON.stringify({
                "email": $routeParams.email,
                "token": $routeParams.token,
                "password":$scope.password,
                "confirmPassword":$scope.confirmpassword
            });
            $http({
                url:$rootScope.apiHostUrl+"userservice/forgotpasssteptwo",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.auth && response.data.flag){
                    swal({
                        title: "Password Change",
                        text: "Password changed successfully. Please sign in.",
                        type: "success",
                        timer: 3000
                    });
                    window.location.href = "index.html#/signin";
                }else if(response.data.auth==false){
                    swal({
                        title: "Unauthorised Access",
                        text: "Authorisation failed. You are not authorised.",
                        type: "warning",
                        timer: 3000
                    });
                    window.location.href = "index.html#/";
                }else if(response.data.auth==true && response.data.flag==false){
                    swal({
                        title: "Error",
                        text: "Internal error occurred. Please contact administrator via contact us form.",
                        type: "error",
                        timer: 3000
                    });
                }

            },function errorCallback(response) {

            });

        });
    }
});

