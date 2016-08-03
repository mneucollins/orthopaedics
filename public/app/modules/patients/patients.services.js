angular.module("patientsModule")
.factory('Patient', ['$resource',
    function($resource){
        return $resource('/api/patients/:patientId', {patientId: "@_id"}, {
            update: {method: "PUT"},
            queryToday: {method: "GET", url: "/api/patients/today", isArray: true},
            getHistory: {method: "GET", url: "/api/patients/:patientId/history", isArray: true},
            search: {method: "POST", url: "/api/patients/search", isArray: true},
            preregister: {method: "POST", url: "/api/patients/preregister", isArray: false},
            updCellphone: {method: "POST", url: "/api/patients/updCellphone", isArray: false},
            searchPreRegistered : {method: "POST", url: "/api/patients/searchPreRegistered", isArray: true}
    });
}]);