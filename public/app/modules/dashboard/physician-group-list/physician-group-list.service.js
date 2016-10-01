(function () {
	'use strict';

	angular
		.module("dashboardModule")
		.factory('PhysicianGroupListService', PhysicianListService);

	PhysicianListService.$inject = ['$interval', 'PhysicianFrontDeskGroup']; 
	function PhysicianListService($interval, PhysicianFrontDeskGroup){

		var physicianGroupList = [];
		$interval(retrieveGroupMetrics, 5 * 60 * 1000);

		return {
			getPhysicianGroupList: getPhysicianGroupList,
			setPhysicianGroupList: setPhysicianGroupList
		};

		/////////////

		function getPhysicianGroupList() {
			return physicianGroupList;
		}
		function setPhysicianGroupList(list, callback) {
			physicianGroupList = list;
			retrieveGroupMetrics(callback);
		}

		function retrieveGroupMetrics(callback) {
			if(physicianGroupList.length == 0) return;

	        var groupIds = _.pluck(physicianGroupList, '_id');
	        // Physician.getClinicDelays({phyList: groupIds}, function (delays) {
	            _.each(physicianGroupList, function (element, index, list) {
	                list[index].groupMetrics = {
	                	sumMinutes: 100,
	                	numPatients: 4,
	                	threshold: 10
	                };
	            });

	            if(callback) callback();
	        // });
	    }
	}

})();