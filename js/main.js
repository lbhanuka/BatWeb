/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/signin", {templateUrl: "partials/signin.html", controller: "LoginCtrl"})
    .when("/signup", {templateUrl: "partials/signup.html", controller: "RegisterCtrl"})
    .when("/researcher", {templateUrl: "partials/researcher.html", controller: "ResearcherCtrl"})
    .when("/administrator", {templateUrl: "partials/administrator.html", controller: "AdministratorCtrl"})
    .when("/profile", {templateUrl: "partials/userprofile.html", controller: "ProfileCtrl"})
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/research", {templateUrl: "partials/faq.html", controller: "PageCtrl"})
    .when("/distribution", {templateUrl: "partials/distribution.html", controller: "MapCtrl"})
    .when("/sightings", {templateUrl: "partials/services.html", controller: "PageCtrl"})
    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    // Blog
    .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})
    .when("/blog/post", {templateUrl: "partials/blog_item.html", controller: "BlogCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);
