angular.module('patientRowModule')
.directive('apptTypeColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/appt-type-column.html',
		controller:['$scope', function($scope){
			
		}]

	};
});