var orthopaedicsApp = angular.module('orthopaedicsApp', [
  "ngRoute",
  "ngAnimate",
  "ngCookies",

  "ui.bootstrap",

  "appCommons",
  "loginModule",
  "dashboardModule",
  "faqModule",
  "infoHeaderModule",
  "patientsModule",
  "patientRowModule",
  "physiciansModule",
  "messagesModule",
  "reportsModule",
  "usersModule",
  "rolesModule",
  "adminModule",
  "rowTitleModule",
  "layoutOptionsModule",

  "orthopaedicsServices",
  // "orthopaedicsControllers",
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

orthopaedicsApp.run(function($rootScope, WaitTime, AuthService){

  $rootScope.getWRTime = WaitTime.getWRTime;
  $rootScope.getEXTime = WaitTime.getEXTime;
  $rootScope.getTotalTime = WaitTime.getTotalTime;
  $rootScope.getTimerColor = WaitTime.getTimerColor;

  $rootScope.user = AuthService.currentUser();
  

});