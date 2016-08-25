angular.module('infoHeaderModule')
.directive('physicianHeader',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			physician : "="
		},
		templateUrl : '/app/modules/info-header/physician-header.html',
		// controller:['$scope', function($scope) {
		// }]

	};
});