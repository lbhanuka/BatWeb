/**
 * Created by lahiru on 8/7/2016.
 */

app.controller('contactFormCtrl',function($rootScope,$scope,$http,$window){
    $scope.submitContactForm = function () {
            var parameter = JSON.stringify({
                "contact_email": $scope.contact_email,
                "contact_name": $scope.contact_name,
                "contact_phone": $scope.contact_phone,
                "contact_message": $scope.contact_message
            });
            $http({
                url:$rootScope.apiHostUrl+"emailservice/contactus",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                if(response.data.flag==true){
                    swal({
                        title: "Message submitted.",
                        text: "Your message submitted successfully.",
                        type: "success",
                        timer: 3000
                    });
                    window.location.href = "index.html#/";
                }else if(response.data.flag==false){
                    swal({
                        title: "Message submitting failed",
                        type: "error",
                        timer: 3000
                    });
                }

            },function errorCallback(response) {

            });
    }
});