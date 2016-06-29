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

    //getting reply data
    var repliesList = [];
    $scope.getRepliesByComment = function (comment_id) {
        console.log(comment_id);
        $http({
            url:$rootScope.apiHostUrl+"researchservice/research/"+$routeParams.research_id+"/"+comment_id+"/replies",
            method: "GET"
        }).then(function successCallback(response) {
            if(response.data.flag == true){
                comment_id.repliesList = response.data.repliesList;
            }else if(response.data.flag == false){
                $scope.norepliesfound = "No replies found.";
            }
        },function errorCallback(response) {
            swal({
                title: "Error in connection",
                type: "error",
                timer: 3000
            });
        });
    };
    //end - getting replies

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

    }

});