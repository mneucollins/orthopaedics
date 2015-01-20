var orthopaedicsServices = angular.module('orthopaedicsServices', ['ngResource', 'ngCookies']);

orthopaedicsServices.factory('Patient', ['$resource',
	function($resource){
		return $resource('/api/patients/:patientId', {patientId: "@_id"}, {
		update: {method: "PUT"}
	});
}]);

orthopaedicsServices.factory('Session', ['$resource',
	function($resource){
		return $resource('/auth', {}, {
		login: {method: "POST", url: "/auth/login"},
		// signup: {method: "POST", url: "/auth/signup"}
	});
}]);

orthopaedicsServices.factory('AuthService', ["Session", "$cookieStore", function(Session, $cookieStore) {
  var currentUser;

  return {
    login: function(usuario, callback) {			
		Session.login(usuario, function (user) {
    		currentUser = user;
            $cookieStore.put("currentUser", user);
    		callback(user);
			// $location.path("/catalogos");
		});
	},
    logout: function() { 
        currentUser = null;
        $cookieStore.remove("currentUser");
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
    setCurrentUser: function(usr) { currentUser = usr; },
 //    signup: function(usuario, callback) {			
	// 	Session.signup(usuario, function (user) {
 //    		callback(user);
	// 	});
	// }
  };

}]);