angular.module('patientRowModule')
.directive('apptTimeColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/appt-time-column.html',
		controller:['$scope', function($scope){
			
		}]

	};
});