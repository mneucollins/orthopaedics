angular.module('patientRowModule')
.directive('physicianColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/physician-column.html',
		controller:['$scope', function($scope){
			
		}]

	};
});