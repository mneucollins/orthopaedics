angular.module('patientRowModule')
.directive('waitStatusColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			card : "="
		},
		templateUrl : '/app/modules/patient-row/wait-status-column.html',
		controller:['$scope', function($scope){


		}]

	};
});