angular.module('infoHeaderModule')
.directive('infoHeader',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/info-header/info-header.html',
		controller:['$scope', 'AuthService', 'PhysicianListService', 'PhysicianGroupListService',
		function($scope, AuthService, PhysicianListService, PhysicianGroupListService){

			$scope.selectedPhysicians = PhysicianListService.getPhysicianList;
			$scope.selectedPhysicianGroups = PhysicianGroupListService.getPhysicianGroupList;
			$scope.isFrontdeskAdmin = AuthService.isFrontdeskAdmin;
		}]

	};
});