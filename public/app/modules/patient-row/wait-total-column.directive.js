angular.module('patientRowModule')
.directive('waitTotalColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/wait-total-column.html',
		controller:['$scope', function($scope){


		}]

	};
});