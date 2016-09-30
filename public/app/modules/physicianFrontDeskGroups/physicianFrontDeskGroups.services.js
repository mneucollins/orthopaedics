angular.module("physicianFrontDeskGroupsModule")
.factory('physicianFrontDeskGroup', ['$resource',
    function($resource){
        return $resource('/api/physicianFrontDeskGroups/:physicianGroupId', {physicianId: "@_id"}, {
        	update: {method: "PUT"},
            // getPatientsToday: {method: "GET", url: "/api/physicians/:physicianId/patients/today", isArray: true},
            // getClinicDelays: {method: "POST", url: "/api/physicians/waittime"},
            // getPatientsTodayByList: {method: "POST", isArray: true, url: "/api/physicians/patients/today"}
        });
}]);