(function () {
	'use strict';

	angular
		.module("dashboardModule")
		.factory('PhysicianGroupListService', PhysicianGroupListService);

	PhysicianGroupListService.$inject = ['$interval', 'PhysicianFrontDeskGroup', 'PhysicianListService']; 
	function PhysicianGroupListService($interval, PhysicianFrontDeskGroup, PhysicianListService){

		var currentPhisiciansMetrics = {
			name: "Selected Physicians"
		};
		var physicianGroupList = [];
		$interval(retrieveGroupMetrics, 30 * 1000);

		return {
			getPhysicianGroupList: getPhysicianGroupList,
			setPhysicianGroupList: setPhysicianGroupList,
			retrieveCurrentPhysiciansMetrics: retrieveCurrentPhysiciansMetrics
		};

		/////////////

		function getPhysicianGroupList() {
			return [currentPhisiciansMetrics].concat(physicianGroupList);
		}
		function setPhysicianGroupList(list, callback) {
			physicianGroupList = list;
			retrieveGroupMetrics(callback);
		}

		function retrieveGroupMetrics(callback) {
			retrieveCurrentPhysiciansMetrics();
			if(physicianGroupList.length == 0) return;

	        var groupIds = _.pluck(physicianGroupList, '_id');
	        
	        PhysicianFrontDeskGroup.getGroupMetrics({groupList: groupIds}, function (metrics) {
	            _.each(physicianGroupList, function (elem, index, list) {
	                list[index].groupMetrics = metrics[elem._id];
	                if(list[index].groupMetrics.threshold == -500)
	                	list[index].groupMetrics.threshold = "-";
	            });

	            if(_.isFunction(callback)) callback();
	        });
	    }

		function retrieveCurrentPhysiciansMetrics(callback) {

			var phyList = _.pluck(PhysicianListService.getPhysicianList(), "_id");

			if(phyList.length == 0) return;
	        
	        PhysicianFrontDeskGroup.getPhysicianMetrics({phyList: phyList}, function (metrics) {
	            currentPhisiciansMetrics.groupMetrics = metrics;
	                if(currentPhisiciansMetrics.groupMetrics.threshold == -500)
	                	currentPhisiciansMetrics.groupMetrics.threshold = "-";

	            if(_.isFunction(callback)) callback();
	        });
	    }
	}

})();