angular.module('usersModule')
.directive('userLayout',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/users/user-layout.html',
		controller:['$scope', '$timeout', 'LayoutService', function($scope, $timeout, LayoutService){


			$scope.items1 = [];
			$scope.items2 = [];

			$timeout(function(){
				$scope.layout = LayoutService.getLayoutUser();
				$scope.items2 = LayoutService.getActiveColumns();

				$scope.items1 = LayoutService.getInactiveColumns();

			} , 500);



		}]

	};
});

