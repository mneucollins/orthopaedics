angular.module("dashboardModule")
.factory('DashboardService',['$rootScope', 'Physician', function($rootScope, Physician){



	return {
		retrieveClinicDelays : function (user) {
	        var physicianIds = _.map($rootScope.selectedPhysicians, function (phy) {
	            return phy._id;
	        });
	        Physician.getClinicDelays({phyList: physicianIds}, function (delays) {
	            _.each($rootScope.selectedPhysicians, function (element, index, list) {
	                element.clinicDelay = delays[element._id] ? delays[element._id] : 0;
	            });
	        });
	    },

	};

}]);