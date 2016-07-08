angular.module('rowTitleModule')
.directive('rowTitle',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			titleData:"=",
		},
		templateUrl : '/app/modules/row-title/row-title.html',
		controller:['$scope', function($scope){
		}]

	};
});