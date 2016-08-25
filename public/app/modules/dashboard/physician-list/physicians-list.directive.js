angular.module('dashboardModule')
.directive('physiciansList',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/dashboard/physician-list/physicians-list.html',
		controller:['$scope', '$rootScope', 'AuthService', 'Physician', 'PhysicianListService', 
		function($scope, $rootScope, AuthService, Physician, PhysicianListService){

			$scope.hidePhysiciansList = false;

			$rootScope.tooglePhysiciansList = tooglePhysiciansList;
			$scope.fillSchedules = fillSchedules;
			$scope.selectAll = selectAll;
			$scope.selectPhysician = selectPhysician;

			activate();

			/////////////////////////


			function activate() {
			    Physician.query(function (physicians) {
			        _.each(physicians, function (element, index, list) {
			            list[index].selected = false;
			        });
			        
			        $scope.physicianList = _.filter(physicians, function (phy) {
			            return phy.isActive;
			        });
			        // $scope.physicianList = physicians;
			    });
			}

			//////////////////

		    function tooglePhysiciansList() {
		        $scope.hidePhysiciansList = !$scope.hidePhysiciansList;
		    }

		    function fillSchedules() {
		        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
		            return physician.selected;
		        }); 

		        // $rootScope.selectedPhysicians = selectedPhysicians;
		        PhysicianListService.setPhysicianList(selectedPhysicians);
		        $scope.hidePhysiciansList = true;

		        $scope.$emit("selectedPhysiciansChanged", selectedPhysicians);
		    }

		    function selectAll() {
		        if ($scope.phySelectAll) $scope.phySelectAll = true;
		        else $scope.phySelectAll = false;

		        angular.forEach($scope.physicianList, function (physician) {
		            physician.selected = $scope.phySelectAll;
		        });
		    };

		    function selectPhysician(physician) {
		         
		        var role = AuthService.currentUser().role;
		        physician.selected = !physician.selected;
		        
		        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
		            return physician.selected;
		        });
		        $scope.phySelectAll = selectedPhysicians.length == $scope.physicianList.length;
		    };

		}]
	};
});