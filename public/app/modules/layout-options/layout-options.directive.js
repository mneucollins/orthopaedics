angular.module('layoutOptionsModule')
.directive('layoutOptions',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			items1 : "=",
			items2 : "=",
			layout : "="
		},
		templateUrl : '/app/modules/layout-options/layout-options.html',
		controller:['$scope', 'dragulaService', function($scope, dragulaService){

			dragulaService.options($scope, 'bag-one', {
				moves : function(el, source, handle, sibling){

					if(el.id=="Button" || el.id=="Name" || el.id=="Appt Time" || el.id=="Status" || el.id=="Total"){
						return false;
					}

					var totalLength = 0;
					for(var i in $scope.items2){
						totalLength += $scope.items2[i].len;
					}
					if(totalLength>90){
						if(el.parentElement.id==="inactiveElements"){
							return false;
						}
					}

					// el.addClass("draggable-cursor");
					return true;
				}
			});

			$scope.isFixed = function(title){
				return title=="Button" || title=="Name" || title=="Appt Time" || title=="Status" || title=="Total";
			}

			// $scope.items1 = [];
			// $scope.items2 = [];

			// $scope.selectedItems = $scope.items2.length;

			// $timeout(function(){
			// 	$scope.layout = LayoutService.getLayoutUser();
			// 	$scope.items2 = LayoutService.getActiveColumns();

			// 	$scope.items1 = LayoutService.getInactiveColumns();

			// } , 500);


						
		}]

	};
});

