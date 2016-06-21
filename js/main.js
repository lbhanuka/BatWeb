/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute','uiSwitch'
]);

/**
 * Configure the Routes
 */

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/signin", {templateUrl: "partials/user/signin.html", controller: "LoginCtrl"})
    .when("/signup", {templateUrl: "partials/user/signup.html", controller: "RegisterCtrl"})
    .when("/signupRequest", {templateUrl: "partials/user/signuprequest.html", controller: "AccountManagerCtrl"})
    .when("/accountsmanager", {templateUrl: "partials/user/accountsmanager.html", controller: "AccountManagerCtrl"})
    .when("/researcher", {templateUrl: "partials/user/researcher.html", controller: "ResearcherCtrl"})
    .when("/administrator", {templateUrl: "partials/user/administrator.html", controller: "AdministratorCtrl"})
    .when("/profile", {templateUrl: "partials/user/userprofile.html", controller: "ProfileCtrl"})
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/research", {templateUrl: "partials/research/researchHome.html", controller: "ResearchHomeCtrl"})
    .when("/distribution", {templateUrl: "partials/distribution.html", controller: "MapCtrl"})
    .when("/sightings", {templateUrl: "partials/sightings.html", controller: "PageCtrl"})
    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    // Blog
    .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})
    .when("/blog/post", {templateUrl: "partials/blog_item.html", controller: "BlogCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);
