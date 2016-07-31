
app.controller('NotificationCtrl',function($scope,$http,$rootScope,$window,$interval,$location,$compile){
  $scope.isSignedin = function () {
      if($window.sessionStorage.getItem("usr") == null){
          return false;
      }else {
          var usr = JSON.parse($window.sessionStorage.getItem("usr"));
          $rootScope.signedinas = usr.email;
          return true;
      }
  };

  $scope.bellClicked = function () {
      hideNotificationBadge();
  };

  var showNotificationBadge = function() {
    //alert("ok");
    document.getElementById("bell").className += " fa-warn";
  };

  var hideNotificationBadge = function() {
    document.getElementById("bell").className = "fa fa-bell fa-1x";
    //alert("ok");
  };

  var deleteNotification = function(notification) {
    //alert("ok");
    var index = 0;
    angular.forEach($scope.notifications, function(value, key) {
      if(value.notification_id == notification.notification_id){
        $scope.notifications.splice(index, 1);
      };
      index = index + 1;
    });
    $http.get($rootScope.apiHostUrl+"notification/remove/"+notification.table+"/"+notification.notification_id+"/"+notification.notification_type_id).then(function (response) {
    });
  };

  $scope.moreInfo = function(notification) {
    deleteNotification(notification);
    if(notification.notification_type_id == 2){
      $http.get($rootScope.apiHostUrl+"sightingservice/getone/"+notification.event_id).then(function (response) {
        $rootScope.currentSighting = response.data.sighting[0];
        //$location('#/sightingdetails');
        var url = $window.location.href;
        if(url.indexOf("#/sightingdetails1") > -1) {
          $window.location.href = '#/sightingdetails';
        }else if (url.indexOf("#/sightingdetails") > -1) {
          $window.location.href = '#/sightingdetails1';
        }else {
          $window.location.href = '#/sightingdetails';
        };
        //alert(JSON.stringify($scope.notifications));
      });
    }else if (notification.notification_type_id == 2) {
      //signup request!
    }else if (notification.notification_type_id == 3) {
      $http.get($rootScope.apiHostUrl+"sightingservice/getone/"+notification.event_id).then(function (response) {
        $rootScope.currentSighting = response.data.sighting[0];
        //$location('#/sightingdetails');
        var url = $window.location.href;
        if(url.indexOf("#/usersightingdetails1") > -1) {
          $window.location.href = '#/usersightingdetails';
        }else if (url.indexOf("#/usersightingdetails") > -1) {
          $window.location.href = '#/usersightingdetails1';
        }else {
          $window.location.href = '#/usersightingdetails';
        };
        //alert(JSON.stringify($scope.notifications));
      });
    };
    //$rootScope.currentSighting = sighting;
    //alert(JSON.stringify($rootScope.currentSighting));
  };

  $scope.notifications = [];

  var getNotifications = function() {
    if($rootScope.signedinas != null){
      var prevLength = $scope.notifications.length;
      $http.get($rootScope.apiHostUrl+"notification/getallforuser/"+$rootScope.signedinas).then(function (response) {
        $scope.notifications = response.data.notifications;
        //alert(JSON.stringify($scope.notifications));
        if (prevLength < $scope.notifications.length) {
          showNotificationBadge();
        }
      });
    }else {
      $scope.notifications = [];
    }
  };

  $interval(getNotifications, 10000);

});
