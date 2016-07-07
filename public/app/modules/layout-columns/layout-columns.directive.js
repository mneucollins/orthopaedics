angular.module('layoutColumnsModule')
.directive('layoutColumns',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/layout-columns/layout-columns.html',
		controller:['$scope', '$timeout', 'LayoutService', 'dragulaService', function($scope, $timeout, LayoutService, dragulaService){

			dragulaService.options($scope, 'bag-one', {
				moves : function(el, source, handle, sibling){
					var totalLength = 0;
					for(var i in $scope.items2){
						totalLength += $scope.items2[i].len;
					}
					console.log("length: "+totalLength);
					if(totalLength>90){
						if(el.parentElement.id==="inactiveElements"){
							return false;
						}
					}
					return true;
				}
			});

			var layout = null; 

			$scope.items1 = [];
			$scope.items2 = [];

			$scope.selectedItems = $scope.items2.length;

			// $scope.$on('bag-one.drag',function(e,el){
				

			// 	$scope.selectedItems = $scope.items2.length;

			// 	dragulaService.options($scope,'bag-one',{
			// 		moves : function();
			// 	});

			// 	//alert('hey, myVar has changed!');
			// });


			$timeout(function(){
				// layout = LayoutService.getLayoutUser();
				$scope.items2 = LayoutService.getActiveColumns();

				$scope.items1 = LayoutService.getInactiveColumns();

			} , 500);


						
		}]

	};
});

