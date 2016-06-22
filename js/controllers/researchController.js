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