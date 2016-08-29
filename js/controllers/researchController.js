/**
 * Created by lahiru on 6/19/2016.
 */

/**
 * research home controller
 */

app.controller("ResearchHomeCtrl",function ($rootScope,$scope,$http,$window,$route){
    $scope.getAllResearch = function () {
        $http({
            url:$rootScope.apiHostUrl+"researchservice/getall",
            method: "GET"
        }).then(function successCallback(response) {
            if(response.data.getAll == true){
                $scope.resdatalist = response.data.allResearchList;
            }else if(response.data.getAll == false){
                $scope.noresearchfound = "No research data found.";
            }
        },function errorCallback(response) {
            swal({
                title: "Error in connection",
                type: "error",
                timer: 3000
            });
        });
    };
    $scope.searchFlag = false;
    $scope.searchResearch = function () {
        $scope.searchFlag = true;
        $http({
            url:$rootScope.apiHostUrl+"researchservice/search/"+$scope.searchTerm,
            method: "GET"
        }).then(function successCallback(response) {
            if(response.data.searchResearchList.length > 0){
                $scope.searchResearchList = response.data.searchResearchList;
                $scope.noSearchResFound = '';
            }else{
                $scope.searchResearchList = [];
                $scope.noSearchResFound = 'No Search Results Found.';
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


app.controller("ResearchCtrl",function ($routeParams,$rootScope,$scope,$http,$window,$route){
    // getting research data
    $http({
        url:$rootScope.apiHostUrl+"researchservice/research/"+$routeParams.research_id,
        method: "GET"
    }).then(function successCallback(response) {
        if(response.data.flag == true){
            $scope.res_title = response.data.res_title;
            $scope.res_user_email = response.data.user_email;
            $scope.res_created_date = response.data.created_date;
            $scope.res_created_time = response.data.created_time;
            $scope.res_desc = response.data.res_desc;
        }else if(response.data.flag == false){
            $scope.noresearchfound = "No research data found.";
        }
    },function errorCallback(response) {
        swal({
            title: "Error in connection",
            type: "error",
            timer: 3000
        });
    });

    // getting comment data
    $http({
        url:$rootScope.apiHostUrl+"researchservice/research/"+$routeParams.research_id+"/comments",
        method: "GET"
    }).then(function successCallback(response) {
        if(response.data.flag == true){
            $scope.commentsList = response.data.commentsList;
        }else if(response.data.flag == false){
            $scope.nocommentsfound = "No comments found.";
        }
    },function errorCallback(response) {
        swal({
            title: "Error in connection",
            type: "error",
            timer: 3000
        });
    });

    $scope.addComment = function () {
        var usr = JSON.parse($window.sessionStorage.getItem("usr"));
        if(usr!=null){
            var usremail = usr.email;
            var parameter = JSON.stringify({"research_id": $routeParams.research_id,
                "user_email": usremail,
                "content": $scope.comm_content
            });
            $http({
                url:$rootScope.apiHostUrl+"researchservice/research/comment",
                method: "POST",
                data: parameter
            }).then(function successCallback(response) {
                // if(response.data.flag == true){
                $route.reload();

                // }
            },function errorCallback(response) {
                swal({
                    title: "Commenting error.",
                    text: "Connection error occurred.",
                    timer: 3000,
                    showConfirmButton: false
                });
            });
        }else {
            alert("Please login");
        }

    };

});


app.controller("AddResearchCtrl",function ($rootScope,$scope,$http,$window,$route){
    var usr = JSON.parse($window.sessionStorage.getItem("usr"));
    
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