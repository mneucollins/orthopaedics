var orthopaedicsApp = angular.module('orthopaedicsApp', [
  "ngRoute",
  "ngAnimate",
  "ngCookies",
  "orthopaedicsServices",
  "orthopaedicsControllers",
  "orthopaedicsFilters",
  "orthopaedicsDirectives"
]);

orthopaedicsApp.config(['$locationProvider', '$httpProvider', '$injector',
  function($locationProvider, $httpProvider, $injector) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $httpProvider.interceptors.push('AuthenticationInterceptor');


}]);