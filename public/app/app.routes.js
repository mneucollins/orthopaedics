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

      .when('/', {
        templateUrl: '/app/modules/login/login.html',
        controller: 'loginCtrl'
      })

      .when('/restore/:token', {
        templateUrl: '/app/modules/login/login.html',
        controller: 'restoreCtrl'
      })

      .when('/dashboard', {
        templateUrl: '/app/modules/dashboard/dashboard.html',
        controller: 'dashboardCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })

      .when('/admin', {
        templateUrl: '/app/modules/admin-panel/admin-panel.html',
        controller: 'adminCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })

      .otherwise({
        redirectTo: '/'
      });
}]);