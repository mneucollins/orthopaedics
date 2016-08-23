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
		controller:['$scope', 'dragulaService', 'LayoutService', function($scope, dragulaService, LayoutService){

			dragulaService.options($scope, 'bag-one', {
				moves : function(el, source, handle, sibling){

					if(el.id=="Button" || el.id=="Name" || el.id=="Appt Time" || el.id=="Status" || el.id=="Total"){
						return false;
					}
					return true;
				},
				accepts : function(el, target, source, sibling){
					var columnData = LayoutService.getColumnData();
					var elementLenght = 0;
					for(var i in columnData){
						if(columnData[i].title == el.innerHTML){
							elementLenght = columnData[i].len;
						}
					}
					var totalLength = 0;
					for(var i in $scope.items2){
						totalLength += $scope.items2[i].len;
					}
					totalLength+=elementLenght;
					if(totalLength>100){
						if(el.parentElement.id==="inactiveElements"){
							return false;
						}
					}
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

