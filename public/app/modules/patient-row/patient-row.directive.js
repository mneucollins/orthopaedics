angular.module('patientRowModule')
.directive('patientRow',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			patientList : "=",
			hidePhysicians : "="
		},
		templateUrl : '/app/modules/patient-row/patient-row.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Patient', 'Alerts', 'AuthService',
			function($scope, $rootScope, $modal, $log, Patient, Alerts, AuthService){


		    // Patient History
		    ///////////////////////////////////////////////////////////////////////////////////////////////

		    $scope.loadPatientHistory = function (patient) {
		      Patient.getHistory({patientId: patient.id}, function (history) {
		          patient.history = history;
		      })
		    }

		    $scope.isImaging = function (){
		    	var role = AuthService.currentUser().role.isImaging;
		    	return role;
		    }

		    $scope.isLabs = function (){
		    	var role = AuthService.currentUser().role.isLabs;
		    	return role;
		    }


		}]

	};
});