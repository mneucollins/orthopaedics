angular.module('infoHeaderModule')
.directive('infoHeader',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope : {},
		templateUrl : '/app/modules/info-header/info-header.html',
		// controller:['$scope', function($scope){

		// }]

	};
});