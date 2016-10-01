(function () {
	'use strict';

	angular
		.module("dashboardModule")
		.factory('PhysicianGroupListService', PhysicianListService);

	PhysicianListService.$inject = ['$interval', 'PhysicianFrontDeskGroup']; 
	function PhysicianListService($interval, PhysicianFrontDeskGroup){

		var physicianGroupList = [];
		$interval(retrieveGroupMetrics, 60 * 1000);

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
	        PhysicianFrontDeskGroup.getGroupMetrics({groupList: groupIds}, function (metrics) {
	            _.each(physicianGroupList, function (elem, index, list) {
	                list[index].groupMetrics = metrics[elem._id];
	                if(list[index].groupMetrics.threshold == -500)
	                	list[index].groupMetrics.threshold = "-";
	            });

	            if(callback) callback();
	        });
	    }
	}

})();