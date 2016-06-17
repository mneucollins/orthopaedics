angular.module("physiciansModule")
.factory('Physician', ['$resource',
    function($resource){
        return $resource('/api/physicians/:physicianId', {physicianId: "@_id"}, {
            getPatientsToday: {method: "GET", url: "/api/physicians/:physicianId/patients/today", isArray: true},
            getClinicDelays: {method: "POST", url: "/api/physicians/waittime"},
        });
}]);