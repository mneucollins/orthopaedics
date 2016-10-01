angular.module('dashboardModule')
.directive('physiciansGroupList',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/dashboard/physician-group-list/physicians-group-list.html',
		controller: physiciansGroupListController
	};

	physiciansGroupListController.$inject = ['$scope', 'AuthService', 'PhysicianFrontDeskGroup', 'PhysicianGroupListService'];
	function physiciansGroupListController($scope, AuthService, PhysicianFrontDeskGroup, PhysicianGroupListService){

		$scope.selectAllGroup = selectAllGroup;
		$scope.selectGroup = selectGroup;

		activate();

		/////////////////////////


		function activate() {
		    PhysicianFrontDeskGroup.query(function (physicianGroups) {
		        _.each(physicianGroups, function (element, index, list) {
		            list[index].selected = false;
		        });
		        
		        $scope.physicianGroupList = physicianGroups;
		    });
		}

	    $scope.$on("fillSchedules", function () {
	        fillSchedules();
	    });

		//////////////////

	    function selectAllGroup() {
	        if ($scope.groupSelectAll) $scope.groupSelectAll = true;
	        else $scope.groupSelectAll = false;

	        angular.forEach($scope.physicianGroupList, function (group) {
	            group.selected = $scope.groupSelectAll;
	        });
	    }

	    function selectGroup(group) {
	        
	        group.selected = !group.selected;
	        
	        var selectedGroups = _.filter($scope.physicianGroupList, function (group) {
	            return group.selected;
	        });
	        $scope.phySelectAll = selectedGroups.length == $scope.physicianGroupList.length;
	    }

	    function fillSchedules() {
	        var selectedGroups = _.filter($scope.physicianGroupList, function (physician) {
	            return physician.selected;
	        }); 

	        PhysicianGroupListService.setPhysicianGroupList(selectedGroups, function() {
	            // $scope.$emit("selectedPhysiciansChanged", selectedPhysicians);
	        });
	    }

	}
});