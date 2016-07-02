/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute','uiSwitch','colorpicker.module','720kb.datepicker','pageslide-directive'
]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
/**
 * Configure the Routes
 */

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "HomeCtrl"})
    // Pages
    .when("/signin", {templateUrl: "partials/user/signin.html", controller: "LoginCtrl"})
    .when("/signup", {templateUrl: "partials/user/signup.html", controller: "RegisterCtrl"})
    .when("/signupRequest", {templateUrl: "partials/user/signuprequest.html", controller: "AccountManagerCtrl"})
    .when("/accountsmanager", {templateUrl: "partials/user/accountsmanager.html", controller: "AccountManagerCtrl"})
    .when("/researcher", {templateUrl: "partials/user/researcher.html", controller: "ResearcherCtrl"})
    .when("/administrator", {templateUrl: "partials/user/administrator.html", controller: "AdministratorCtrl"})
    .when("/profile", {templateUrl: "partials/user/userprofile.html", controller: "ProfileCtrl"})
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/news", {templateUrl: "partials/news.html", controller: "NewsCtrl"})
    .when("/research", {templateUrl: "partials/research/researchHome.html", controller: "ResearchHomeCtrl"})
    .when("/research/:research_id", {templateUrl: "partials/research/research.html", controller: "ResearchCtrl"})
    .when("/distribution", {templateUrl: "partials/distribution.html", controller: "MapCtrl"})
    .when("/sightings", {templateUrl: "partials/sightings.html", controller: "SightingsCtrl"})
    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    // Blog
    .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})
    .when("/blog/post", {templateUrl: "partials/blog_item.html", controller: "BlogCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);
