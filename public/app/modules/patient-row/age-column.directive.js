angular.module('patientRowModule')
.directive('ageColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/age-column.html',
		controller:['$scope', function($scope){
			
		}]

	};
});