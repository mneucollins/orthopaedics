angular.module('patientRowModule')
.directive('patientRow',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			patientList : "=",
			columnName : "="
		},
		templateUrl : '/app/modules/patient-row/patient-row.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Patient', 'Alerts', 'AuthService', 'LayoutService',
			function($scope, $rootScope, $modal, $log, Patient, Alerts, AuthService, LayoutService){


			$scope.$watch("patient", function (newValue) {
				if(newValue)
					console.log("patientRow: " + newValue.needsImaging);
			})

		    // Patient History
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.loadPatientHistory = function (patient) {
		      Patient.getHistory({patientId: patient.id}, function (history) {
		          patient.history = history;
		      })
		    }

		    $scope.isImaging = function (){
		    	return AuthService.isImaging();
		    }

		    $scope.isLabs = function (){
		    	return AuthService.isLabs();
		    }

			$scope.coloredPriorTime = function(){
				return LayoutService.coloredPriorTime();
			}


		}]

	};
});