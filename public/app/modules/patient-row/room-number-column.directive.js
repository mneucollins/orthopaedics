angular.module('patientRowModule')
.directive('roomNumberColumn',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "="
		},
		templateUrl : '/app/modules/patient-row/room-number-column.html',
		controller:['$scope', function($scope){
			
		}]

	};
});