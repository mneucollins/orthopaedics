angular.module('infoHeaderModule')
.directive('physicianGroupHeader',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			group : "="
		},
		templateUrl : '/app/modules/info-header/physician-group-header.html',
		// controller:['$scope', function($scope) {
		// }]

	};
});