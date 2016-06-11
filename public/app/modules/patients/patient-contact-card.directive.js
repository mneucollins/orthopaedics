angular.module('patientsModule')
.directive('patientContactCard',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			showTab : "="
		},
		templateUrl : '/app/modules/patients/patient-contact-card.html',
		controller:['$scope', 'Alerts', function($scope, Alerts){

		    $scope.msjToCustom = function (patient) {
		        patient.messageSelectorPos = 1;
		        patient.message = "";
		    }

		    $scope.msjToDefault = function (patient) {
		        patient.messageSelectorPos = 17;
		        patient.message = "This is a default message";
		    }

		    $scope.sendMessage = function (patient) {
		        Messages.sendMessage({
		            patient: patient,
		            message: patient.message
		        }, function messageSent (sentMessage) {
		            patient.message = "";
		            Alerts.addAlert("success", "message sent!");
		        });
		        Alerts.addAlert("success", "message on it's way...");
		    }

		}]

	};
});