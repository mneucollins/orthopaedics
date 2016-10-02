(function () {
	'use strict';

	angular
		.module("dashboardModule")
		.factory('PhysicianGroupListService', PhysicianListService);

	PhysicianListService.$inject = ['$interval', 'PhysicianFrontDeskGroup', 'PhysicianListService']; 
	function PhysicianListService($interval, PhysicianFrontDeskGroup, PhysicianListService){

		var currentPhisiciansMetrics = {
			name: "Current"
		};
		var physicianGroupList = [];
		$interval(retrieveGroupMetrics, 30 * 1000);

		return {
			getPhysicianGroupList: getPhysicianGroupList,
			setPhysicianGroupList: setPhysicianGroupList
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
			if(physicianGroupList.length == 0) return;

	        var groupIds = _.pluck(physicianGroupList, '_id');
			retrieveCurrentPhysiciansMetrics();
	        
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

	            if(_.isFunction(callback)) callback();
	        });
	    }
	}

})();