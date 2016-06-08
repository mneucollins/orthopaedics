angular.module('physiciansModule')
.directive('physiciansList',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/physicians/physicians-list.html',
		controller:['$scope', '$rootScope', 'AuthService', function($scope, $rootScope, AuthService){


		    $scope.fillSchedules = function () {
		        var selectedPhysicians = _.filter($scope.physicianList, function (physician) {
		            return physician.selected;
		        }); 

		        $rootScope.selectedPhysicians = selectedPhysicians;
		        $rootScope.hidePhysiciansList = true;
		        // $(".physiciansList").css("left", "-37%");
		    }

		    $scope.selectAll = function () {
		        if ($scope.phySelectAll) $scope.phySelectAll = true;
		        else $scope.phySelectAll = false;

		        angular.forEach($scope.physicianList, function (physician) {
		            physician.selected = $scope.phySelectAll;
		        });
		    };


		    $scope.selectPhysician = function (physician) {
		         
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