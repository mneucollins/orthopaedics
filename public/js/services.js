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
            retrievePassword:{method: "POST", url: "/api/users/passwordRetrieval"},
            changePassword:{method: "PUT", url: "/api/users/:userId/changePassword"}
    });
}]);

orthopaedicsServices.factory('Physician', ['$resource',
    function($resource){
        return $resource('/api/physicians/:physicianId', {physicianId: "@_id"}, {
            getPatientsToday: {method: "GET", url: "/api/physicians/:physicianId/patients/today", isArray: true},
            getClinicDelays: {method: "POST", url: "/api/physicians/waittime"},
        });
}]);

orthopaedicsServices.factory('Reports', ['$resource',
    function($resource){
        return $resource('/api/reports/:reportId', {messageId: "@_id"}, {
            generate: {method: "GET", url: '/api/reports/generate'}
        });
}]);

