angular.module('layoutColumnsModule')
.directive('layoutColumns',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/layout-columns/layout-columns.html',
		controller:['$scope', '$timeout', 'LayoutService', function($scope, $timeout, LayoutService){

			var layout = null; 

			var columns = [
                "action-column",
                "age-column",
                "appt-time-column",
                "appt-type-column",
                "at-column",
                "fp-column",
                "fc-column",
                "imaging-column",
                "labs-column",
                "name-column",
                "physician-column",
                "room-number-column",
                "wait-status-column",
                "wait-total-column"
            ];

			$timeout(function(){
				layout = LayoutService.getLayoutUser();
				$scope.items2 = layout.columns;

				// for (var i in columns){

				// 	if (layout.columns.indexOf(columns[i])==-1)
				// 		$scope.items1.push(columns[i]);	

				// }

				$scope.items1 = LayoutService.getOtherColumns();

			} , 500);
						
		}]

	};
});






// angular.module('layoutColumnsModule')
// .directive('layoutColumns',function(){
// 	return {
// 		replace : true,
// 		restrict : 'E',
// 		// scope : {},
// 		templateUrl : '/app/modules/layout-columns/layout-columns.html',
// 		controller:['$scope', '$element', 'dragularService', function($scope, $element, dragularService){
// 			$scope.items1 = [
// 				{content : 'item1'},
// 				{content : 'item2'},
// 				{content : 'item3'}
// 			];

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