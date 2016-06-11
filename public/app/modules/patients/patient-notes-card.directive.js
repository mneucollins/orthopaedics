angular.module('patientsModule')
.directive('patientNotesCard',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			showTab : "="
		},
		templateUrl : '/app/modules/patients/patient-notes-card.html',
		controller:['$scope', 'Patient', 'Alerts', function($scope, Patient, Alerts){

		    $scope.saveNotes = function (patient) {
		        
		        Patient.update({patientId: patient.id}, 
		            {notes: patient.notes}, 
		            function (updatedPatient) {
		                // var index = $scope.patientList.indexOf(patient); 
		                // if(index >= 0) {
		                    $scope.patient.notes = updatedPatient.notes;
		                // }
		                Alerts.addAlert("success", "Notes Saved");
		            }); 
		    }

		    

		}]

	};
});