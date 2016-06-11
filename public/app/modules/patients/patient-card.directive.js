angular.module('patientsModule')
.directive('patientCard',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patients/patient-card.html',
		controller:['$scope', function($scope){
		}]

	};
});