angular.module('patientRowModule')
.directive('nameColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/name-column.html',
		controller:['$scope', function($scope){
			
		}]

	};
});