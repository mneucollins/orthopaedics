angular.module('patientsModule')
.directive('patientRow',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patients/patient-row.html',
		controller:['$scope', '$rootScope', function($scope, $rootScope){


		}]

	};
});