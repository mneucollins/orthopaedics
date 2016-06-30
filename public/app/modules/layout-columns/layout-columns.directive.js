angular.module('layoutColumnsModule')
.directive('layoutColumns',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/layout-columns/layout-columns.html',
		controller:['$scope', '$element', 'dragularService', function($scope, $element, dragularService){
			$scope.items1 = [
				{content : 'item1'},
				{content : 'item2'},
				{content : 'item3'}
			];

			$scope.items2 = [
				{content : 'item4'},
				{content : 'item5'},
				{content : 'item6'}
			];

			var containers = $element.children().children();
			dragularService([containers[0],containers[1]],{
				containersModel: [$scope.items1, $scope.items2]
			});
		}]

	};
});


// angular.module('layoutColumnsModule')
// .directive('layoutColumns',function(){
// 	return {
// 		replace : true,
// 		restrict : 'E',
// 		scope : {
// 			user : "="
// 		},
// 		templateUrl : '/app/modules/layout-columns/layout-columns.html',
// 		controller:['$scope', '$rootScope', '$element', '$timeout', 'dragularService', 'LayoutService',
// 			function($scope, $rootScope, $element, $timeout, dragularService, LayoutService){

// 			var layout = null; 

// 			$timeout(function(){
// 				layout = LayoutService.getLayoutUser()
// 				$scope.items1 = layout.columns;
// 			} , 500);

			

// 			//$scope.items2 = $rootScope.user.layout.columns;

// 			// $scope.items1 = [
// 			// 	{content : 'item1'},
// 			// 	{content : 'item2'},
// 			// 	{content : 'item3'}
// 			// ];

// 			$scope.items2 = [
// 				{content : 'item4'},
// 				{content : 'item5'},
// 				{content : 'item6'}
// 			];

// 			var containers = $element.children().children();
// 			dragularService([containers[0],containers[1]],{
// 				containersModel: [$scope.items1, $scope.items2]
// 			});
// 		}]

// 	};
// });