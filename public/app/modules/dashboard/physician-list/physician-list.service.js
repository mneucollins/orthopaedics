(function () {
	'use strict';

	angular
		.module("dashboardModule")
		.factory('PhysicianListService', PhysicianListService);

	PhysicianListService.$inject = ['$interval', 'Physician']; 
	function PhysicianListService($interval, Physician){

		var physicianList = [];
		$interval(retrieveClinicDelays, 5 * 60 * 1000);

		return {
			getPhysicianById: getPhysicianById,
			getPhysicianList: getPhysicianList,
			setPhysicianList: setPhysicianList
		};

		/////////////

		function getPhysicianById(id) {
			return _.find(physicianList, function (phy) {
				return phy._id = id;
			});
		}

		function getPhysicianList() {
			return physicianList;
		}
		function setPhysicianList(list) {
			physicianList = list;
			retrieveClinicDelays();
		}

		function retrieveClinicDelays() {
			if(physicianList.length == 0) return;

	        var physicianIds = _.map(physicianList, function (phy) {
	            return phy._id;
	        });
	        Physician.getClinicDelays({phyList: physicianIds}, function (delays) {
	            _.each(physicianList, function (element, index, list) {
	                list[index].clinicDelay = delays[element._id] ? delays[element._id] : 0;
	            });
	        });
	    }
	}

})();