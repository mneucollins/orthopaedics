angular.module("patientsModule")
.factory('Patient', ['$resource',
    function($resource){
        return $resource('/api/patients/:patientId', {patientId: "@_id"}, {
            update: {method: "PUT"},
            queryToday: {method: "GET", url: "/api/patients/today", isArray: true},
            getHistory: {method: "GET", url: "/api/patients/:patientId/history", isArray: true}
    });
}]);