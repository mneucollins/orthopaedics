angular.module('physiciansModule')
.directive('physiciansMini',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			physician : '='
		},
		templateUrl : '/app/modules/physicians/physicians-mini.html'
		// controller:['$scope', function($scope){}]

	};
});