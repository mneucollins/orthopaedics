angular.module('patientsModule')
.directive('patientInfoCard',function(){
	return {
		replace : true,
		restrict : 'E',
		scope : {
			patient : "=",
			showTab : "="
		},
		templateUrl : '/app/modules/patients/patient-info-card.html',
		controller:['$scope', '$rootScope', '$modal', '$log', 'Patient', 'Alerts',
		function($scope, $rootScope, $modal, $log, Patient, Alerts){


		    $scope.editPatient = function (patient) {
		        
		        var modalInstance = $modal.open({
		            templateUrl: '/app/modules/patients/register-patient.dialog.html',
		            controller: 'registerPatientCtrl',
		            resolve: {
		                patient: function () {
		                    return patient;
		                },
		                physicians: function () {
		                    return $rootScope.selectedPhysicians;
		                },
		                modalFunction: function () {
		                    return "edit";
		                }
		            }
		        });

		        modalInstance.result.then(function (updPatient) {
		            var listPatient = _.find($scope.patientList, function(patient){ 
		                return patient.id == updPatient.id; 
		            });

		            if(listPatient) {
		                var index = $scope.patientList.indexOf(listPatient);
		                $scope.patientList[index] = updPatient; 
		                $scope.$apply();
		            }
		            else {
		                Alerts.addAlert("danger", "Unknown error updating the patient. Please refresh the page");
		            }
		        }, function () {
		            $log.info('Message Modal dismissed at: ' + new Date());
		        });
		    }


		    $scope.deletePatient = function (patient) {
		        var resp = confirm("Are you sure you would like to delete this patient?");
		        
		        if (resp == true) {
		            Patient.update({patientId: patient.id}, 
		                {isDeleted: true, deletedTimestamp: new Date()}, 
		                function (updatedPatient) {
		                    var index = $scope.patientList.indexOf(patient); 
		                    if(index >= 0) {
		                        $scope.patientList[index].isDeleted = updatedPatient.isDeleted;
		                        $scope.patientList[index].deletedTimestamp = updatedPatient.deletedTimestamp;
		                    }
		                    Alerts.addAlert("danger", "Unknown error updating the patient. Please refresh the page");
		                });       
		        }   
		    }

		    $scope.restoreDeletedPatient = function (patient) {
		        var resp = confirm("Are you sure you would like to restore this patient?");
		        
		        if (resp == true) {
		            Patient.update({patientId: patient.id}, 
		                {isDeleted: false, deletedTimestamp: null}, 
		                function (updatedPatient) {
		                    var index = $scope.patientList.indexOf(patient); 
		                    if(index >= 0) {
		                        $scope.patientList[index].isDeleted = updatedPatient.isDeleted;
		                        $scope.patientList[index].deletedTimestamp = updatedPatient.deletedTimestamp;
		                    }
		                    Alerts.addAlert("success", "Patient restored");
		                });       
		        }   
		    }

		}]

	};
});