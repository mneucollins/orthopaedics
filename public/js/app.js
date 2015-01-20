var orthopaedicsApp = angular.module('orthopaedicsApp', [
  "ngRoute",
  "ngAnimate",
  "ngCookies",
  "orthopaedicsServices",
  "orthopaedicsControllers"
]);

orthopaedicsApp.config(['$routeProvider','$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/auth/loggedin').success(function(user){
        // Authenticated
        if (user !== '0') {
          $timeout(deferred.resolve, 0);
          // $cookieStore.put("currentUser", user);
          // AuthService.setCurrentUser(user);
        }

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          $timeout(function(){deferred.reject();}, 0);
          $location.url('/');
        }
      });

      return deferred.promise;
    };

// ========================= NAVIGATION ===================
    $routeProvider
      .when('/', {  // THIS IS TEMPORARY, WHIE LOGIN IS FINISHED
        templateUrl: '/partials/schedule.html',
        controller: 'scheduleCtrl',
        routeName:"0"
      }) // end of temp code

      .when('/login', {
        templateUrl: '/partials/login.html',
        controller: 'loginCtrl',
        routeName:"0"
      })
      .when('/schedule', {
        templateUrl: '/partials/schedule.html',
        controller: 'scheduleCtrl',
        routeName:"1"
      })
      .when('/physicians', {
        templateUrl: '/partials/physicians.html',
        controller: 'physiciansCtrl',
        routeName:"2"
      });
      // .otherwise({
      //   redirectTo: '/login'
      // })

}]);