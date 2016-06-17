
angular.module("appCommons")
.factory('Session', ['$resource',
	function($resource){
		return $resource('/auth', {}, {
		login: {method: "POST", url: "/auth/login"},
        logout: {method: "GET", url: "/auth/logout"},
        signup: {method: "POST", url: "/auth/signup"}
	});
}]);


angular.module("appCommons")
.factory('AuthService', ["Session", "$cookieStore", function(Session, $cookieStore) {
 	var currentUser;

  	return {
    	login: function(usuario, callback) {			
			Session.login(usuario, function (user) {
	    		currentUser = user;
	            $cookieStore.put("currentUser", user);
	    		callback(user);
			});
		},
	    logout: function(callback) { 
	        Session.logout(function () {
	            currentUser = null;
	            $cookieStore.remove("currentUser");
	            if(callback) callback();
	        });
	    },
	    isLoggedIn: function() { 
	    	if (currentUser)
	    		return true;
	    	else {
	            currentUser = $cookieStore.get("currentUser");
	            if (currentUser)
	                return true;
	            else 
	                return false;
	                    
	        }
	    },
	    currentUser: function() { return currentUser; },
	    setCurrentUser: function(usr) { 
	        $cookieStore.put("currentUser", usr);
	        currentUser = usr; 
	    },
	    signup: function(usuario, callback) {
	        Session.signup(usuario, function (user) {
	            callback(user);
	        });
	    },
	    restoreLogin: function(usuario,callback){
	        Session.restoreLogin(usuario, function (user) {
	            callback(user);
	        });
	    },
        isImaging: function(){
            return currentUser.role.isImaging;
        }
  	};
}]);


//////////////////////////////////////////////////////////////
/////////////////////// INTERCEPTORS  ////////////////////////
//////////////////////////////////////////////////////////////


// este servicio no debería existir. Hay que hacer validación de permisos en cada controlador
angular.module("appCommons")
.factory('AuthenticationInterceptor', ['$q', '$injector','$location','$rootScope',
    function ($q, $injector,$location,$rootScope) {
    return {

        response: function (response) {

            var AuthService = $injector.get('AuthService');

            if(response.status == 401) {
                var AuthService = $injector.get('AuthService');
                var Alerts = $injector.get('Alerts');
                AuthService.logout();

                if(response.data.message)
                    Alerts.addAlert("warning", response.data.message);
            }
            else if(response.status==202) {
                $rootScope.tempUser = response.user;
                $location.path("/");
            }
            else {
                if(response.user && response.user !== AuthService.currentUser())
                    AuthService.login(response.user);

                if(response.data && response.data.message) {
                    var Alerts = $injector.get('Alerts');
                    Alerts.addAlert("warning", response.data.message);
                }
            }

            return response;
        },
        responseError: function (response) {

            // Sign out if the user is no longer authorized.
            if (response.status == 401) {
                var AuthService = $injector.get('AuthService');
                var Alerts = $injector.get('Alerts');
                AuthService.logout();

                if(response.data.message)
                    Alerts.addAlert("warning", response.data.message);
            }
            else if (response.status == 500) {
                // var Alerts = $injector.get('Alerts');
                // Alerts.addAlert("danger", "server error: " + JSON.stringify(response.body));
                console.log("server error: " + JSON.stringify(response.body));
            }

            return $q.reject(response);
        }
    };
}]);
