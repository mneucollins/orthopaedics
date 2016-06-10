angular.module('patientsModule')
.directive('patientRow',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			patientList : "="
		},
		templateUrl : '/app/modules/patients/patient-row.html',
		controller:['$scope', function($scope){}]

	};
});