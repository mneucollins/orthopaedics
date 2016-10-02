angular.module("physicianFrontDeskGroupsModule")
.factory('PhysicianFrontDeskGroup', ['$resource',
    function($resource){
        return $resource('/api/physicianFrontDeskGroups/:physicianGroupId', {physicianId: "@_id"}, {
        	update: {method: "PUT"},
            getGroupMetrics: {method: "POST", url: "/api/physicianFrontDeskGroups/metrics"},
            getPhysicianMetrics: {method: "POST", url: "/api/physicians/metrics"},
            // getPatientsToday: {method: "GET", url: "/api/physicians/:physicianId/patients/today", isArray: true},
            // getPatientsTodayByList: {method: "POST", isArray: true, url: "/api/physicians/patients/today"}
        });
}]);