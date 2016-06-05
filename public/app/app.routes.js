orthopaedicsApp.config(['$routeProvider',
  function($routeProvider) {



    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();
      // var AuthService = $injector.get('AuthService');

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
          // AuthService.setCurrentUser(null);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };
    
    $routeProvider

      .when('/login', {
        templateUrl: '/app/modules/login/login.html',
        controller: 'loginCtrl'
      })

      .when('/restore/:token', {
        templateUrl: '/partials/login.html',
        controller: 'restoreCtrl'
      })

      .when('/dashboard1', {
        templateUrl: '/partials/dashboard1.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })

      .when('/dashboard2', {
        templateUrl: '/partials/dashboard2.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .otherwise({
        redirectTo: '/login'
      });
}]);