var orthopaedicsServices = angular.module('orthopaedicsServices', ['ngResource', 'ngCookies']);

orthopaedicsServices.factory('Patient', ['$resource',
	function($resource){
		return $resource('/api/patients/:patientId', {patientId: "@_id"}, {
		update: {method: "PUT"}
	});
}]);

orthopaedicsServices.factory('Physician', ['$resource',
    function($resource){
        return $resource('/api/physicians/:physicianId', {physicianId: "@_id"});
}]);

orthopaedicsServices.factory('Messages', ['$resource',
    function($resource){
        return $resource('/api/messages/:messageId', {messageId: "@_id"}, {
            sendMessage: {method: "POST"},
            sendWelcomeMessage: {method: "POST", url: '/api/messages/welcome'}
        });
}]);

orthopaedicsServices.factory('Session', ['$resource',
	function($resource){
		return $resource('/auth', {}, {
		login: {method: "POST", url: "/auth/login"},
        logout: {method: "GET", url: "/auth/logout"}
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
    logout: function(callback) { 
        Session.logout(function () {
            currentUser = null;
            $cookieStore.remove("currentUser");
            callback();
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
    setCurrentUser: function(usr) { currentUser = usr; },
 //    signup: function(usuario, callback) {			
	// 	Session.signup(usuario, function (user) {
 //    		callback(user);
	// 	});
	// }
  };

}]);

orthopaedicsServices.factory('AuthenticationInterceptor', ['$q', '$injector',
  function ($q, $injector) {
  return {
    response: function (response) {
      
        var AuthService = $injector.get('AuthService');

        if(response.user && response.user !== AuthService.currentUser)
            AuthService.login(response.user);


        return response;
    },
    responseError: function (response) {
      // Sign out if the user is no longer authorized.
      if (response.status == 401) {
        var AuthService = $injector.get('AuthService');
        AuthService.logout();
      }
      if (response.status == 500) {
        alert("error de servidor!" + response.body);
      }
      
      return $q.reject(response);
    }
  };
}]);