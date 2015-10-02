var orthopaedicsServices = angular.module('orthopaedicsServices', ['ngResource', 'ngCookies']);


//////////////////////////////////////////////////////////////
//////////////////////    SERVICES    ////////////////////////
//////////////////////////////////////////////////////////////


orthopaedicsServices.factory('Patient', ['$resource',
	function($resource){
		return $resource('/api/patients/:patientId', {patientId: "@_id"}, {
    		update: {method: "PUT"},
            queryToday: {method: "GET", url: "/api/patients/today", isArray: true},
            getHistory: {method: "GET", url: "/api/patients/:patientId/history", isArray: true}
	});
}]);

orthopaedicsServices.factory('User', ['$resource',
    function($resource){
        return $resource('/api/users/:userId', {userId: "@_id"}, {
            update: {method: "PUT"},
            setSecurityQuestions: {method: "PUT", url: "/api/users/:userId/questions"},
            restorePassword: {method: "PUT", url: "/api/users/:userId/restorePassword"},
            getByToken: {method: "GET", url: "/api/users/token/:token"},
            retrievePassword:{method: "POST", url: "/api/users/passwordRetrieval"}
    });
}]);

orthopaedicsServices.factory('Physician', ['$resource',
    function($resource){
        return $resource('/api/physicians/:physicianId', {physicianId: "@_id"}, {
            getPatientsToday: {method: "GET", url: "/api/physicians/:physicianId/patients/today", isArray: true},
            getClinicDelays: {method: "POST", url: "/api/physicians/waittime"},
        });
}]);

orthopaedicsServices.factory('Messages', ['$resource',
    function($resource){
        return $resource('/api/messages/:messageId', {messageId: "@_id"}, {
            sendMessage: {method: "POST"},
            sendWelcomeMessage: {method: "POST", url: '/api/messages/welcome'},
            sendBulkMessages: {method: "POST", url: '/api/messages/bulk'}
        });
}]);

orthopaedicsServices.factory('Emails', ['$resource',
    function($resource){
        return $resource('/api/emails/:emailId', {emailId: "@_id"}, {
            sendHelpMail: {method: "POST", url: '/api/emails/help'}
        });
}]);

orthopaedicsServices.factory('Reports', ['$resource',
    function($resource){
        return $resource('/api/reports/:reportId', {messageId: "@_id"}, {
            generate: {method: "GET", url: '/api/reports/generate'}
        });
}]);

orthopaedicsServices.factory('Session', ['$resource',
	function($resource){
		return $resource('/auth', {}, {
		login: {method: "POST", url: "/auth/login"},
        logout: {method: "GET", url: "/auth/logout"},
        signup: {method: "POST", url: "/auth/signup"}
	});
}]);

//============================ Alert managment ==========================================

orthopaedicsServices.factory('Alerts', ['$rootScope', function ($rootScope) {
        var systemAlerts = [];

        return {
            addAlert: function (type, message) { 
                var newAlert = {type: type, msg: message};
                systemAlerts.push(newAlert);

                function autoCloseAlert (value) {
                    setTimeout(function () {
                        var index = systemAlerts.indexOf(value);
                        if(index != -1) {
                            systemAlerts.splice(index, 1);
                            $rootScope.$broadcast('alerts:updated',systemAlerts);
                        }
                    }, 3000);
                }

                autoCloseAlert(newAlert);
            },
            closeAlert: function (index) {
                systemAlerts.splice(index, 1);
            },
            getAlerts: function () {
                return systemAlerts;
            }
        };
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
    }
  };

}]);


//////////////////////////////////////////////////////////////
/////////////////////// INTERCEPTORS  ////////////////////////
//////////////////////////////////////////////////////////////

orthopaedicsServices.factory('AuthenticationInterceptor', ['$q', '$injector','$location','$rootScope',
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
                var Alerts = $injector.get('Alerts');
                Alerts.addAlert("danger", "server error: " + JSON.stringify(response.body));
            }

            return $q.reject(response);
        }
    };
}]);

