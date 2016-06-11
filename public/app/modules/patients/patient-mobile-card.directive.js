angular.module('patientsModule')
.directive('patientMobileCard',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
		},
		templateUrl : '/app/modules/patients/patient-mobile-card.html',
		controller:['$scope', function($scope){}]

	};
});