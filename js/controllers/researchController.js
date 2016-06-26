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
    // alert($routeParams.research_id);
    $http({
        url:$rootScope.apiHostUrl+"researchservice/research/"+$routeParams.research_id,
        method: "GET"
    }).then(function successCallback(response) {
        if(response.data.flag == true){
            $scope.res_title = response.data.res_title;
            $scope.user_email = response.data.user_email;
            $scope.created_date = response.data.created_date;
            $scope.created_time = response.data.created_time;
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


});