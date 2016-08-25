angular.module('patientsModule')
.directive('patientBlock',function(){
	return {
		replace : true,
		restrict : 'E',
		// scope: {
		// 	patient : "=",
		// 	patientList : "=",
		// 	layout : "="
		// },
		templateUrl : '/app/modules/patients/patient-block.html',
		controller:['$scope',
		function($scope){

			$scope.$watch("patient", function (newValue) {
				if(newValue)
					console.log("patientBlock: " + newValue.needsImaging);
			})
		}]

	};
});